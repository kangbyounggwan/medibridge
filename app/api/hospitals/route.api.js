import { NextResponse } from "next/server";
import {
  DEFAULT_RADIUS_M,
  HospitalLookupError,
  fetchHospitals,
} from "@/lib/hospitals";

// 웹사이트용 프록시. 앱은 이 라우트를 거치지 않고 공공데이터 API를 직접 부른다
// (lib/hospitals.js 참고). 브라우저는 CORS 때문에 직접 부를 수 없어 서버를 거친다.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const json = (body, init = {}) =>
  NextResponse.json(body, { ...init, headers: corsHeaders });

export async function GET(request) {
  const params = request.nextUrl.searchParams;
  const lat = Number(params.get("lat"));
  const lng = Number(params.get("lng"));

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return json(
      { error: "invalid_location", message: "위치 정보가 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const result = await fetchHospitals({
      lat,
      lng,
      radius: Number(params.get("radius")) || DEFAULT_RADIUS_M,
      page: Number(params.get("page")) || 1,
      pageSize: Number(params.get("pageSize")) || 20,
      // 서버 전용 키. 클라이언트 번들에 들어가지 않는다.
      serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
    });

    return json(result);
  } catch (error) {
    if (error instanceof HospitalLookupError) {
      const notConfigured = error.code === "not_configured";
      console.error("병원 조회 실패:", error.code, error.message);

      return json(
        {
          error: error.code,
          message: notConfigured
            ? "병원 데이터 서비스 키가 설정되지 않았습니다. DATA_GO_KR_SERVICE_KEY를 등록해주세요."
            : error.message,
        },
        { status: notConfigured ? 503 : 502 }
      );
    }

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
