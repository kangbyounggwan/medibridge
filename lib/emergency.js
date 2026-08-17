// 국립중앙의료원 전국 응급의료기관 정보 조회 - 위치기반.
// 병·의원 찾기(lib/hospitals.js)와 같은 제공기관(B552657)이라 응답 구조가 같다.
//
// 주의: 이 API는 별도 활용신청이 필요하다. 승인 전에는 인증 오류가 나므로
// 화면에서 not_approved 상태로 안내한다. 승인되면 코드 수정 없이 동작한다.

export const ERMCT_ENDPOINT =
  "https://apis.data.go.kr/B552657/ErmctInfoInqireService/getEgytLcinfoInqire";

export const DEFAULT_RADIUS_M = 5000;
export const MAX_RADIUS_M = 15000;
export const MAX_LIMIT = 30;

const MAX_ROWS = 30;

function toArray(items) {
  if (!items || typeof items === "string") return [];
  const item = items.item;
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

function normalize(raw) {
  return {
    id: raw.hpid ?? `${raw.dutyName}-${raw.dutyAddr}`,
    name: raw.dutyName ?? "",
    // 위치기반 조회는 응급의료기관 등급(dutyEmclsName)을 주지 않는다.
    // 기관 종별(종합병원 등)이 오므로 그걸 표시한다.
    grade: raw.dutyEmclsName || raw.dutyDivName || null,
    address: raw.dutyAddr ?? "",
    // dutyTel3가 응급실 직통, dutyTel1이 대표번호다.
    phone: raw.dutyTel3 || raw.dutyTel1 || "",
    lat: Number(raw.latitude) || null,
    lng: Number(raw.longitude) || null,
    // 응답의 distance는 km 단위다. 앱은 m로 다룬다.
    distance:
      raw.distance == null ? null : Math.round(Number(raw.distance) * 1000),
  };
}

export class EmergencyLookupError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

export async function fetchEmergencyRooms({
  lat,
  lng,
  radius = DEFAULT_RADIUS_M,
  page = 1,
  pageSize = 20,
  serviceKey,
}) {
  if (!serviceKey) {
    throw new EmergencyLookupError(
      "not_configured",
      "응급의료 서비스 키가 설정되지 않았습니다."
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

  const res = await fetch(`${ERMCT_ENDPOINT}?${query}`);

  if (!res.ok) {
    throw new EmergencyLookupError(
      "upstream_error",
      `응급의료 API 응답 실패: ${res.status}`
    );
  }

  const text = await res.text();

  // 미승인 키는 200에 XML 에러 본문으로 돌아온다.
  if (!text.trimStart().startsWith("{")) {
    if (text.includes("SERVICE_KEY_IS_NOT_REGISTERED")) {
      throw new EmergencyLookupError(
        "not_approved",
        "응급의료기관 API 사용 승인이 아직 완료되지 않았습니다."
      );
    }
    console.error("응급의료 API 비정상 응답:", text.slice(0, 300));
    throw new EmergencyLookupError(
      "upstream_error",
      "응급실 정보를 가져오지 못했습니다."
    );
  }

  const body = JSON.parse(text);

  // 미승인 응답이 JSON으로 오는 경우도 있다.
  const authMsg = body?.OpenAPI_ServiceResponse?.cmmMsgHeader?.errMsg;
  if (authMsg) {
    throw new EmergencyLookupError(
      authMsg.includes("SERVICE_KEY_IS_NOT_REGISTERED")
        ? "not_approved"
        : "upstream_error",
      "응급의료기관 API 사용 승인이 아직 완료되지 않았습니다."
    );
  }

  const header = body?.response?.header;
  if (header && header.resultCode !== "00") {
    console.error("응급의료 API 에러:", header);
    throw new EmergencyLookupError(
      "upstream_error",
      header.resultMsg || "응급실 정보를 가져오지 못했습니다."
    );
  }

  const all = toArray(body?.response?.body?.items)
    .map(normalize)
    .filter((r) => r.name)
    .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

  const rooms = all.filter(
    (r) => r.distance == null || r.distance <= cappedRadius
  );

  const totalCount = Number(body?.response?.body?.totalCount) || all.length;

  // 거리순이므로 반경 밖 항목이 한 번 나오면 다음 페이지는 모두 반경 밖이다.
  const trimmedByRadius = rooms.length < all.length;
  const hasMore =
    !trimmedByRadius &&
    all.length === cappedPageSize &&
    currentPage * cappedPageSize < totalCount;

  return {
    rooms,
    radius: cappedRadius,
    count: rooms.length,
    page: currentPage,
    pageSize: cappedPageSize,
    totalCount,
    hasMore,
  };
}
