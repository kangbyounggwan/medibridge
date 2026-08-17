import { NextResponse } from "next/server";

// 모바일 앱(Capacitor)은 http://localhost 오리진에서 이 API를 크로스 오리진으로 호출한다.
// 쿠키/인증정보를 쓰지 않는 엔드포인트라 * 로 허용한다.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(request) {
  try {
    const { symptoms, language } = await request.json();

    if (!symptoms || symptoms.trim() === "") {
      return NextResponse.json(
        { error: "증상을 입력해주세요." },
        { status: 400, headers: corsHeaders }
      );
    }

    // 언어별 명시적 프롬프트 생성
    const getLanguageSpecificPrompt = (symptoms, language) => {
      let languageInstruction = "";
      let userMessage = symptoms;

      switch (language) {
        case "Korean":
          languageInstruction =
            "You MUST respond ONLY in Korean (한국어). Do not use any other language.";
          userMessage = `다음 증상에 대해 한국어로만 의료 상담을 해주세요: "${symptoms}"`;
          break;
        case "Chinese":
          languageInstruction =
            "You MUST respond ONLY in Chinese (中文). Do not use any other language.";
          userMessage = `请仅用中文为以下症状提供医疗咨询: "${symptoms}"`;
          break;
        case "Japanese":
          languageInstruction =
            "You MUST respond ONLY in Japanese (日本語). Do not use any other language.";
          userMessage = `次の症状について日本語でのみ医療相談をしてください: "${symptoms}"`;
          break;
        default:
          languageInstruction =
            "You MUST respond ONLY in English. Do not use any other language.";
          userMessage = `Please provide medical consultation in English only for the following symptoms: "${symptoms}"`;
      }

      return { languageInstruction, userMessage };
    };

    const { languageInstruction, userMessage } = getLanguageSpecificPrompt(
      symptoms,
      language
    );

    console.log("입력된 증상:", symptoms);
    console.log("감지된 언어:", language);
    console.log("생성된 프롬프트:", userMessage);

    // OpenAI API 호출
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `당신은 의료 상담 AI입니다. 
            중요한 면책조항: 제공되는 정보는 참고용이며, 정확한 진단과 치료를 위해서는 반드시 의료진의 직접적인 진료를 받으시기 바랍니다.
            
            사용자의 증상에 대해:
            1. 가능한 원인들을 설명해주세요
            2. 일반적인 대처법을 제안해주세요  
            3. 의료진 방문이 필요한 상황인지 판단해주세요
            4. 응급상황 징후가 있다면 즉시 병원 방문을 권하세요
            
            ${languageInstruction}`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API 에러:", errorText);
      throw new Error(`OpenAI API 호출 실패: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // ✅ 출처 추가 (예시)
    const sources = [
      {
        title: "서울대학교병원 의학정보",
        url: "https://www.snuh.org/m/health/nMedInfo/nList.do",
      },
      {
        title: "국가건강정보포털",
        url: "https://health.kdca.go.kr/healthinfo/",
      },
      {
        title: "Mayo Clinic - Symptoms",
        url: "https://www.mayoclinic.org/symptoms",
      },
    ];

    return NextResponse.json(
      {
        response: aiResponse,
        sources,
        timestamp: new Date().toISOString(),
      },
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("API 에러:", error);

    // OpenAI API 키가 없는 경우 테스트 응답 제공
    if (error.message.includes("OpenAI API")) {
      return NextResponse.json(
        {
          response: `테스트 응답: 입력하신 증상에 대해 다음과 같이 안내드립니다.

🔍 증상 분석:
입력하신 증상을 확인했습니다.

💊 일반적인 대처법:
- 충분한 휴식을 취하세요
- 수분을 충분히 섭취하세요
- 증상이 심해지면 의료진 상담을 받으세요

⚠️ 의료진 상담 권장:
정확한 진단을 위해 가까운 병원을 방문하시기 바랍니다.

*이것은 테스트 응답입니다. 실제 서비스를 위해서는 OpenAI API 키가 필요합니다.*`,
          sources: [
            {
              title: "국가건강정보포털",
              url: "https://health.kdca.go.kr/healthinfo/",
            },
            {
              title: "서울대학교병원 의학정보",
              url: "https://www.snuh.org/m/health/nMedInfo/nList.do",
            },
          ],
          timestamp: new Date().toISOString(),
          isTestResponse: true,
        },
        { headers: corsHeaders }
      );
    }

    return NextResponse.json(
      {
        error:
          "AI 상담 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.",
      },
      { status: 500, headers: corsHeaders }
    );
  }
}

// OPTIONS 메소드 (CORS 대응)
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
