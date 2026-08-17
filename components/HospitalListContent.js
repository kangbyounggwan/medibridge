"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
} from "lucide-react";
import { apiUrl } from "@/lib/api";
import { formatDistance } from "@/lib/geo";
import { HospitalLookupError, fetchHospitals } from "@/lib/hospitals";

const SEARCH_RADIUS_M = 2000;
const PAGE_SIZE = 20;

/**
 * 앱에서는 서버 없이 공공데이터 API를 직접 부른다.
 * CapacitorHttp가 fetch를 네이티브로 보내므로 CORS에 막히지 않는다.
 * 브라우저는 CORS 때문에 직접 부를 수 없어 /api/hospitals 프록시를 거친다.
 */
async function lookupHospitals({ lat, lng, radius, page }) {
  if (Capacitor.isNativePlatform()) {
    try {
      return await fetchHospitals({
        lat,
        lng,
        radius,
        page,
        pageSize: PAGE_SIZE,
        serviceKey: process.env.NEXT_PUBLIC_DATA_GO_KR_SERVICE_KEY,
      });
    } catch (error) {
      if (error instanceof HospitalLookupError) {
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
  const res = await fetch(apiUrl(`/api/hospitals?${query}`));
  const data = await res.json();

  return res.ok ? data : { error: data.error ?? "unknown", message: data.message };
}

export default function HospitalListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [symptoms, setSymptoms] = useState("");
  const [aiResponse, setAiResponse] = useState("");

  const [hospitals, setHospitals] = useState([]);
  const [coords, setCoords] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setSymptoms(searchParams.get("symptoms") || "");
    setAiResponse(searchParams.get("aiResponse") || "");
  }, [searchParams]);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    let origin;
    try {
      // maximumAge를 주지 않으면 매번 새 GPS 픽스를 기다린다. 실내나 콜드 스타트에서는
      // 수십 초가 걸리거나 아예 실패한다. 병원 목록은 수백 m 단위 정확도면 충분하므로
      // 최근 5분 내 캐시된 위치를 받아들인다.
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
      const data = await lookupHospitals({ ...origin, radius: SEARCH_RADIUS_M, page: 1 });

      if (data.error) {
        setError({ kind: data.error, message: data.message });
        return;
      }

      setHospitals(data.hospitals ?? []);
      setPage(1);
      setHasMore(Boolean(data.hasMore));
    } catch {
      setError({
        kind: "network",
        message: "병원 정보를 가져오지 못했습니다. 연결을 확인해주세요.",
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
      const data = await lookupHospitals({
        ...coords,
        radius: SEARCH_RADIUS_M,
        page: nextPage,
      });

      if (data.error) {
        setHasMore(false);
        return;
      }

      // 같은 병원이 페이지 경계에서 중복돼 오는 경우를 막는다.
      setHospitals((prev) => {
        const seen = new Set(prev.map((h) => h.id));
        return [...prev, ...(data.hospitals ?? []).filter((h) => !seen.has(h.id))];
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

  const openHospital = (hospital) => {
    const query = new URLSearchParams({
      hospitalId: String(hospital.id),
      hospitalName: hospital.name,
      hospitalType: hospital.type,
      hospitalPhone: hospital.phone ?? "",
      symptoms,
      aiResponse,
    });
    // location.href는 앱에서 전체 리로드(흰 화면 깜빡임)를 일으킨다.
    router.push(`/hospitalChat?${query}`);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-5">
      {symptoms && (
        <div className="mb-5 rounded-xl bg-gray-100 p-4">
          <h2 className="mb-1 text-sm font-semibold text-gray-700">
            상담받은 증상
          </h2>
          <p className="text-sm text-gray-500">{symptoms}</p>
        </div>
      )}

      {loading && <LoadingState />}

      {!loading && error && <ErrorState error={error} onRetry={load} />}

      {!loading && !error && hospitals.length === 0 && (
        <EmptyState radius={SEARCH_RADIUS_M} onRetry={load} />
      )}

      {!loading && !error && hospitals.length > 0 && (
        <>
          <p className="mb-3 text-sm font-semibold text-green-600">
            반경 {SEARCH_RADIUS_M / 1000}km 내 {hospitals.length}곳
          </p>

          <ul className="flex flex-col gap-3">
            {hospitals.map((hospital) => (
              <li key={hospital.id}>
                <button
                  type="button"
                  onClick={() => openHospital(hospital)}
                  className="w-full rounded-2xl border border-gray-200 bg-white p-4 text-left transition active:scale-[0.995] active:bg-gray-50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-base font-bold text-gray-800">
                      {hospital.name}
                    </h3>
                    {hospital.distance != null && (
                      <span className="shrink-0 text-sm font-bold text-blue-600">
                        {formatDistance(hospital.distance)}
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {hospital.type && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
                        {hospital.type}
                      </span>
                    )}
                    {hospital.dutyHours && (
                      <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                        <Clock size={13} aria-hidden="true" />
                        {hospital.dutyHours}
                      </span>
                    )}
                  </div>

                  <div className="mt-3 flex flex-col gap-1 text-sm text-gray-500">
                    {hospital.address && (
                      <span className="flex items-start gap-1.5">
                        <MapPin
                          size={14}
                          className="mt-0.5 shrink-0"
                          aria-hidden="true"
                        />
                        {hospital.address}
                      </span>
                    )}
                    {hospital.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone size={14} aria-hidden="true" />
                        {hospital.phone}
                      </span>
                    )}
                  </div>
                </button>
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
          <li>병원 정보는 실시간으로 변경될 수 있습니다.</li>
          <li>진료 시간 및 예약 가능 여부를 미리 확인하세요.</li>
          <li>응급상황 시에는 119에 신고하세요.</li>
        </ul>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-4 text-center">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-blue-500" />
      <p className="text-sm text-gray-500">주변 병원을 찾는 중...</p>
    </div>
  );
}

function ErrorState({ error, onRetry }) {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <AlertCircle size={36} className="text-gray-300" aria-hidden="true" />
      <p className="text-sm text-gray-600">
        {error.message ?? "병원 정보를 가져오지 못했습니다."}
      </p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-1 inline-flex items-center gap-1.5 rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-semibold text-white active:scale-[0.99]"
      >
        <RefreshCw size={15} aria-hidden="true" />
        다시 시도
      </button>
    </div>
  );
}

function EmptyState({ radius, onRetry }) {
  return (
    <div className="flex min-h-[45vh] flex-col items-center justify-center gap-3 px-6 text-center">
      <MapPin size={36} className="text-gray-300" aria-hidden="true" />
      <p className="text-sm text-gray-600">
        반경 {radius / 1000}km 안에 등록된 병원이 없습니다.
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
