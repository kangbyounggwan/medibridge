"use client";

import { useCallback, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation } from "@capacitor/geolocation";
import {
  AlertCircle,
  ChevronDown,
  Clock,
  Loader2,
  MapPin,
  Phone,
  RefreshCw,
  Siren,
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import { formatDistance } from "@/lib/geo";
import {
  DEFAULT_RADIUS_M,
  EmergencyLookupError,
  fetchEmergencyRooms,
} from "@/lib/emergency";

/**
 * 앱은 공공데이터 API를 직접 호출하고(CapacitorHttp가 CORS를 우회한다),
 * 브라우저는 CORS 때문에 /api/emergency 프록시를 거친다.
 */
const PAGE_SIZE = 20;

async function lookupEmergencyRooms({ lat, lng, radius, page }) {
  if (Capacitor.isNativePlatform()) {
    try {
      return await fetchEmergencyRooms({
        lat,
        lng,
        radius,
        page,
        pageSize: PAGE_SIZE,
        serviceKey: process.env.NEXT_PUBLIC_DATA_GO_KR_SERVICE_KEY,
      });
    } catch (error) {
      if (error instanceof EmergencyLookupError) {
        return { error: error.code, message: error.message };
      }
      throw error;
    }
  }

  const query = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
    page: String(page),
    pageSize: String(PAGE_SIZE),
  });
  const res = await fetch(apiUrl(`/api/emergency?${query}`));
  const data = await res.json();

  return res.ok ? data : { error: data.error ?? "unknown", message: data.message };
}

export default function EmergencyContent() {
  const [rooms, setRooms] = useState([]);
  const [coords, setCoords] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    let origin;
    try {
      const position = await Geolocation.getCurrentPosition({
        enableHighAccuracy: false,
        maximumAge: 5 * 60 * 1000,
        timeout: 20000,
      });
      origin = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      setCoords(origin);
    } catch {
      setError({
        kind: "location",
        message: "위치를 확인할 수 없습니다. 위치 권한을 허용해주세요.",
      });
      setLoading(false);
      return;
    }

    try {
      const data = await lookupEmergencyRooms({
        ...origin,
        radius: DEFAULT_RADIUS_M,
        page: 1,
      });

      if (data.error) {
        setError({ kind: data.error, message: data.message });
        return;
      }

      setRooms(data.rooms ?? []);
      setPage(1);
      setHasMore(Boolean(data.hasMore));
    } catch {
      setError({
        kind: "network",
        message: "응급실 정보를 가져오지 못했습니다. 연결을 확인해주세요.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(async () => {
    if (!coords || loadingMore) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    try {
      const data = await lookupEmergencyRooms({
        ...coords,
        radius: DEFAULT_RADIUS_M,
        page: nextPage,
      });

      if (data.error) {
        setHasMore(false);
        return;
      }

      // 같은 기관이 페이지 경계에서 중복돼 오는 경우를 막는다.
      setRooms((prev) => {
        const seen = new Set(prev.map((r) => r.id));
        return [...prev, ...(data.rooms ?? []).filter((r) => !seen.has(r.id))];
      });
      setPage(nextPage);
      setHasMore(Boolean(data.hasMore));
    } catch {
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  }, [coords, page, loadingMore]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-5">
      {/*
        응급 화면의 첫 번째 임무는 119 연결이다.
        목록 조회가 실패하든 승인 전이든 이 버튼은 항상 동작해야 한다.
      */}
      <a
        href="tel:119"
        className="flex items-center gap-4 rounded-2xl bg-red-500 p-5 text-white shadow-lg shadow-red-500/20 transition active:scale-[0.99]"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
          <Siren size={26} aria-hidden="true" />
        </span>
        <span>
          <span className="block text-lg font-bold">119 전화하기</span>
          <span className="mt-0.5 block text-sm text-red-50">
            생명이 위급하면 먼저 신고하세요
          </span>
        </span>
      </a>

      <h2 className="mt-6 mb-3 text-sm font-bold text-gray-800">
        가까운 응급실
      </h2>

      {loading && <LoadingState />}

      {!loading && error && <ErrorState error={error} onRetry={load} />}

      {!loading && !error && rooms.length === 0 && (
        <EmptyState radius={DEFAULT_RADIUS_M} onRetry={load} />
      )}

      {!loading && !error && rooms.length > 0 && (
        <>
          <p className="mb-3 text-sm text-gray-500">
            반경 {DEFAULT_RADIUS_M / 1000}km 내 {rooms.length}곳
          </p>

          <ul className="flex flex-col gap-3">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="rounded-2xl border border-gray-200 bg-white p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-bold text-gray-800">
                    {room.name}
                  </h3>
                  {room.distance != null && (
                    <span className="shrink-0 text-sm font-bold text-red-600">
                      {formatDistance(room.distance)}
                    </span>
                  )}
                </div>

                {room.grade && (
                  <span className="mt-1.5 inline-block rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
                    {room.grade}
                  </span>
                )}

                {room.address && (
                  <p className="mt-3 flex items-start gap-1.5 text-sm text-gray-500">
                    <MapPin size={14} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {room.address}
                  </p>
                )}

                {room.phone && (
                  <a
                    href={`tel:${room.phone.replace(/[^0-9+]/g, "")}`}
                    className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-gray-100 py-3 text-sm font-bold text-gray-800 transition active:scale-[0.99]"
                  >
                    <Phone size={16} aria-hidden="true" />
                    {room.phone}
                  </a>
                )}
              </li>
            ))}
          </ul>

          {hasMore && (
            <button
              type="button"
              onClick={loadMore}
              disabled={loadingMore}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-2xl border border-gray-200 bg-white py-3.5 text-sm font-bold text-gray-700 transition active:scale-[0.99] active:bg-gray-50 disabled:text-gray-400"
            >
              {loadingMore ? (
                <>
                  <Loader2 size={16} className="animate-spin" aria-hidden="true" />
                  불러오는 중...
                </>
              ) : (
                <>
                  <ChevronDown size={16} aria-hidden="true" />더 보기
                </>
              )}
            </button>
          )}
        </>
      )}

      <div className="mt-6 rounded-xl border border-yellow-200 bg-yellow-50 p-4">
        <h3 className="mb-1.5 text-sm font-bold text-yellow-800">안내사항</h3>
        <ul className="list-inside list-disc text-sm text-yellow-800">
          <li>가용 병상은 실시간으로 달라질 수 있습니다.</li>
          <li>이동 전 응급실에 전화로 확인하는 것이 안전합니다.</li>
          <li>의식이 없거나 출혈이 심하면 이동하지 말고 119에 신고하세요.</li>
        </ul>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-red-500" />
      <p className="text-sm text-gray-500">가까운 응급실을 찾는 중...</p>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  const pending = error.kind === "not_approved" || error.kind === "not_configured";

  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 px-6 text-center">
      {pending ? (
        <Clock size={36} className="text-gray-300" aria-hidden="true" />
      ) : (
        <AlertCircle size={36} className="text-gray-300" aria-hidden="true" />
      )}

      <p className="text-sm text-gray-600">
        {error.message ?? "응급실 정보를 가져오지 못했습니다."}
      </p>

      {pending ? (
        <p className="text-xs text-gray-400">
          승인이 완료되면 자동으로 목록이 표시됩니다.
          <br />
          그전까지는 위의 119 신고를 이용해주세요.
        </p>
      ) : (
        <button
          type="button"
          onClick={onRetry}
          className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-red-500 px-5 py-2.5 text-sm font-semibold text-white active:scale-[0.99]"
        >
          <RefreshCw size={15} aria-hidden="true" />
          다시 시도
        </button>
      )}
    </div>
  );
}

function EmptyState({ radius, onRetry }) {
  return (
    <div className="flex min-h-[30vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <MapPin size={36} className="text-gray-300" aria-hidden="true" />
      <p className="text-sm text-gray-600">
        반경 {radius / 1000}km 안에 응급의료기관이 없습니다.
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-semibold text-gray-700 active:scale-[0.99]"
      >
        <RefreshCw size={15} aria-hidden="true" />
        다시 찾기
      </button>
    </div>
  );
}
