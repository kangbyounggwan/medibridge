import { NextResponse } from "next/server";

// 모바일 앱(Capacitor)은 http://localhost 오리진에서 크로스 오리진으로 호출한다.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// 국립중앙의료원 전국 병·의원 찾기 - 위치기반 조회.
// 좌표에서 가까운 순으로 정렬된 결과를 주고, distance(km)를 이미 계산해서 내려준다.
const NMC_ENDPOINT =
  "https://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncLcinfoInqire";

const DEFAULT_RADIUS_M = 2000;
const MAX_RADIUS_M = 5000;
const MAX_ROWS = 50;

const json = (body, init = {}) =>
  NextResponse.json(body, { ...init, headers: corsHeaders });

/** 결과가 1건이면 item이 객체, 여러 건이면 배열, 0건이면 없다. 배열로 맞춘다. */
function toArray(items) {
  if (!items || typeof items === "string") return [];
  const item = items.item;
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

/** 0900 / 2100 같은 정수를 09:00 형태로. 값이 없으면 null. */
function formatDutyTime(value) {
  if (value == null || value === "") return null;
  const padded = String(value).padStart(4, "0");
  return `${padded.slice(0, 2)}:${padded.slice(2)}`;
}

function normalize(raw) {
  const open = formatDutyTime(raw.startTime);
  const close = formatDutyTime(raw.endTime);

  return {
    id: raw.hpid ?? `${raw.dutyName}-${raw.dutyAddr}`,
    name: raw.dutyName ?? "",
    type: raw.dutyDivName ?? "",
    address: raw.dutyAddr ?? "",
    phone: raw.dutyTel1 ?? "",
    lat: Number(raw.latitude) || null,
    lng: Number(raw.longitude) || null,
    // 응답의 distance는 km 단위다. 앱은 m로 다루므로 변환한다.
    distance:
      raw.distance == null ? null : Math.round(Number(raw.distance) * 1000),
    // 요일별 시간이 아니라 대표 진료시간이라 "지금 진료중" 판정에는 쓰지 않는다.
    dutyHours: open && close ? `${open} - ${close}` : null,
  };
}

export async function GET(request) {
  // 공공데이터포털에서 발급받은 "디코딩" 인증키.
  // 인코딩 키를 넣으면 URLSearchParams가 다시 인코딩해 인증에 실패한다.
  const serviceKey = process.env.DATA_GO_KR_SERVICE_KEY;

  if (!serviceKey) {
    return json(
      {
        error: "hospital_api_not_configured",
        message:
          "병원 데이터 서비스 키가 설정되지 않았습니다. DATA_GO_KR_SERVICE_KEY를 등록해주세요.",
      },
      { status: 503 }
    );
  }

  const params = request.nextUrl.searchParams;
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return json(
      { error: "invalid_location", message: "위치 정보가 필요합니다." },
      { status: 400 }
    );
  }

  const radius = Math.min(
    Number(params.get("radius")) || DEFAULT_RADIUS_M,
    MAX_RADIUS_M
  );
  const limit = Math.min(Number(params.get("limit")) || 20, MAX_ROWS);

  const query = new URLSearchParams({
    serviceKey,
    WGS84_LON: String(lng),
    WGS84_LAT: String(lat),
    pageNo: "1",
    numOfRows: String(MAX_ROWS),
    _type: "json",
  });

  try {
    const res = await fetch(`${NMC_ENDPOINT}?${query}`, {
      // 병·의원 기본정보는 자주 바뀌지 않는다. 같은 좌표 반복 조회를 캐시로 흡수한다.
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      throw new Error(`공공데이터 API 응답 실패: ${res.status}`);
    }

    // 인증 실패 등은 200에 XML 에러 본문으로 오기도 한다.
    const text = await res.text();
    if (!text.trimStart().startsWith("{")) {
      console.error("공공데이터 API 비정상 응답:", text.slice(0, 300));
      return json(
        {
          error: "upstream_error",
          message: "병원 정보를 가져오지 못했습니다.",
        },
        { status: 502 }
      );
    }

    const body = JSON.parse(text);
    const header = body?.response?.header;

    if (header && header.resultCode !== "00") {
      console.error("공공데이터 API 에러:", header);
      return json(
        {
          error: "upstream_error",
          message: header.resultMsg || "병원 정보를 가져오지 못했습니다.",
        },
        { status: 502 }
      );
    }

    const hospitals = toArray(body?.response?.body?.items)
      .map(normalize)
      .filter((h) => h.name)
      // 응답은 거리순이지만 반경 제한은 없다. 요청한 반경 안으로 자른다.
      .filter((h) => h.distance == null || h.distance <= radius)
      .slice(0, limit);

    return json({ hospitals, radius, count: hospitals.length });
  } catch (error) {
    console.error("병원 조회 실패:", error);
    return json(
      {
        error: "fetch_failed",
        message: "병원 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}
