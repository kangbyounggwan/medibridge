// 국립중앙의료원 전국 병·의원 찾기 - 위치기반 조회.
// 좌표에서 가까운 순으로 정렬된 결과를 주고, distance(km)를 이미 계산해서 내려준다.
//
// 이 모듈은 서버(/api/hospitals)와 앱 클라이언트 양쪽에서 함께 쓴다.
// 앱에서는 CapacitorHttp가 fetch를 네이티브로 보내므로 CORS 없이 직접 호출된다.

export const NMC_ENDPOINT =
  "https://apis.data.go.kr/B552657/HsptlAsembySearchService/getHsptlMdcncLcinfoInqire";

export const DEFAULT_RADIUS_M = 2000;
export const MAX_RADIUS_M = 5000;
export const MAX_LIMIT = 50;

const MAX_ROWS = 50;

/** 결과가 1건이면 item이 객체, 여러 건이면 배열, 0건이면 없다. 배열로 맞춘다. */
function toArray(items) {
  if (!items || typeof items === "string") return [];
  const item = items.item;
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

/** 0900 / 2100 같은 값을 09:00 형태로. 값이 없으면 null. */
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

/** 호출부가 종류를 구분할 수 있도록 code를 달아준다. */
export class HospitalLookupError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/**
 * 공공데이터 API를 직접 호출해 정규화된 병원 목록을 돌려준다.
 * serviceKey는 디코딩된 값이어야 한다 (URLSearchParams가 한 번 인코딩한다).
 */
export async function fetchHospitals({
  lat,
  lng,
  radius = DEFAULT_RADIUS_M,
  page = 1,
  pageSize = 20,
  serviceKey,
}) {
  if (!serviceKey) {
    throw new HospitalLookupError(
      "not_configured",
      "병원 데이터 서비스 키가 설정되지 않았습니다."
    );
  }

  const cappedRadius = Math.min(radius, MAX_RADIUS_M);
  const cappedPageSize = Math.min(pageSize, MAX_ROWS);
  const currentPage = Math.max(1, page);

  const query = new URLSearchParams({
    serviceKey,
    WGS84_LON: String(lng),
    WGS84_LAT: String(lat),
    pageNo: String(currentPage),
    numOfRows: String(cappedPageSize),
    _type: "json",
  });

  const res = await fetch(`${NMC_ENDPOINT}?${query}`);

  if (!res.ok) {
    throw new HospitalLookupError(
      "upstream_error",
      `공공데이터 API 응답 실패: ${res.status}`
    );
  }

  // 인증 실패 등은 200에 XML 에러 본문으로 오기도 한다.
  const text = await res.text();
  if (!text.trimStart().startsWith("{")) {
    console.error("공공데이터 API 비정상 응답:", text.slice(0, 300));
    throw new HospitalLookupError(
      "upstream_error",
      "병원 정보를 가져오지 못했습니다."
    );
  }

  const body = JSON.parse(text);
  const header = body?.response?.header;

  if (header && header.resultCode !== "00") {
    console.error("공공데이터 API 에러:", header);
    throw new HospitalLookupError(
      "upstream_error",
      header.resultMsg || "병원 정보를 가져오지 못했습니다."
    );
  }

  // API가 거리순으로 주지만 그 순서에 기대지 않는다.
  // 아래 hasMore 판단이 "거리순"을 전제로 하므로, 전제를 코드로 보장한다.
  const all = toArray(body?.response?.body?.items)
    .map(normalize)
    .filter((h) => h.name)
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

  // 응답은 거리순이지만 반경 제한은 없다. 요청한 반경 안으로 자른다.
  const hospitals = all.filter(
    (h) => h.distance == null || h.distance <= cappedRadius
  );

  const totalCount = Number(body?.response?.body?.totalCount) || all.length;

  // 거리순이므로 반경 밖 항목이 한 번 나오면 다음 페이지는 모두 반경 밖이다.
  const trimmedByRadius = hospitals.length < all.length;
  const hasMore =
    !trimmedByRadius &&
    all.length === cappedPageSize &&
    currentPage * cappedPageSize < totalCount;

  return {
    hospitals,
    radius: cappedRadius,
    count: hospitals.length,
    page: currentPage,
    pageSize: cappedPageSize,
    totalCount,
    hasMore,
  };
}
