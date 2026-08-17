import { NextResponse } from "next/server";
import {
  DEFAULT_RADIUS_M,
  EmergencyLookupError,
  fetchEmergencyRooms,
} from "@/lib/emergency";

// 웹사이트용 프록시. 앱은 이 라우트를 거치지 않고 직접 호출한다.
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
    const result = await fetchEmergencyRooms({
      lat,
      lng,
      radius: Number(params.get("radius")) || DEFAULT_RADIUS_M,
      page: Number(params.get("page")) || 1,
      pageSize: Number(params.get("pageSize")) || 20,
      serviceKey: process.env.DATA_GO_KR_SERVICE_KEY,
    });

    return json(result);
  } catch (error) {
    if (error instanceof EmergencyLookupError) {
      console.error("응급실 조회 실패:", error.code, error.message);
      const status =
        error.code === "not_configured" || error.code === "not_approved"
          ? 503
          : 502;
      return json({ error: error.code, message: error.message }, { status });
    }

    console.error("응급실 조회 실패:", error);
    return json(
      {
        error: "fetch_failed",
        message: "응급실 정보를 가져오지 못했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 502 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200, headers: corsHeaders });
}
