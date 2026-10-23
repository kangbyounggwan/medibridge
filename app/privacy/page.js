// Google Play 제출에 필요한 공개 개인정보처리방침.
// 앱 탭 구조와 무관한 단독 페이지이며, 배포 후 URL을 Play Console에 등록한다.
// 같은 내용을 gh-pages 브랜치에도 정적 HTML로 올려 두었다.
export const metadata = {
  title: "개인정보처리방침 | MediBridge",
  description: "MediBridge 개인정보처리방침 / Privacy Policy",
};

const UPDATED = "2026년 10월 23일";
const CONTACT = "support@medibridge.example";

function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-gray-900">{title}</h2>
      <div className="mt-2 flex flex-col gap-2">{children}</div>
    </div>
  );
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-10 md:px-6">
      <h1 className="text-2xl font-extrabold text-gray-900 md:text-3xl">
        개인정보처리방침
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Privacy Policy · 최종 수정일 {UPDATED}
      </p>

      <section className="mt-8 flex flex-col gap-6 text-[15px] leading-relaxed text-gray-700">
        <Section title="1. 수집하는 정보">
          <p>
            MediBridge(이하 &ldquo;앱&rdquo;)는 회원가입 없이 이용할 수 있으며,
            이름·연락처 등 신원을 식별할 수 있는 정보를 수집하지 않습니다. 앱은
            아래 두 가지 정보만 기능 제공에 사용합니다.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>위치 정보(좌표)</strong> — 주변 병·의원과 응급의료기관을 찾기
              위해 사용합니다. 사용자가 권한을 허용한 경우에만 수집합니다.
            </li>
            <li>
              <strong>증상 텍스트</strong> — 사용자가 상담 화면에 직접 입력한
              내용으로, 상담 응답을 생성하기 위해 사용합니다.
            </li>
          </ul>
        </Section>

        <Section title="2. 저장 및 보유">
          <p>
            위치 정보와 증상 텍스트는 <strong>서버에 저장하지 않습니다.</strong>{" "}
            요청을 처리하는 동안에만 사용되고 그 즉시 폐기되며, 별도의 보유 기간이
            없습니다. 사용자가 선택한 표시 언어만 기기 내부 저장소에 보관되며, 앱을
            삭제하면 함께 지워집니다.
          </p>
        </Section>

        <Section title="3. 제3자 제공">
          <p>
            아래 목적에 한해 외부 서비스로 전달되며, 모든 통신은 HTTPS로
            암호화됩니다.
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>공공데이터 개방 API</strong>(국립중앙의료원) — 주변 의료기관
              조회를 위해 좌표를 전달합니다.
            </li>
            <li>
              <strong>AI 상담 처리 서비스</strong> — 상담 응답 생성을 위해 입력된
              증상 텍스트를 전달합니다. 신원 정보는 함께 전달하지 않습니다.
            </li>
          </ul>
          <p>
            위 목적 외에 어떤 정보도 제3자에게 판매하거나 광고 목적으로 제공하지
            않습니다. 앱에는 광고와 분석 추적 도구가 포함되어 있지 않습니다.
          </p>
        </Section>

        <Section title="4. 권한">
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong>위치</strong> — 주변 의료기관 검색에만 사용합니다. 허용하지
              않아도 상담을 포함한 다른 기능은 이용할 수 있습니다. 권한은 기기
              설정에서 언제든 철회할 수 있습니다.
            </li>
          </ul>
        </Section>

        <Section title="5. 아동의 개인정보">
          <p>
            앱은 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를
            의도적으로 수집하지 않습니다.
          </p>
        </Section>

        <Section title="6. 의료 관련 고지">
          <p>
            앱이 제공하는 정보는 참고용이며 의학적 진단을 대체하지 않습니다. 정확한
            진단과 치료는 반드시 의료진의 진료를 받으시기 바랍니다. 증상이 심하거나
            응급상황이 의심되면 즉시 119에 신고하거나 응급실을 방문하십시오.
          </p>
        </Section>

        <Section title="7. 변경 고지">
          <p>본 방침이 변경되는 경우 이 페이지에 수정일과 함께 게시합니다.</p>
        </Section>

        <Section title="8. 문의">
          <p>
            개인정보 처리에 관한 문의는 아래로 연락해 주시기 바랍니다.
            <br />
            <a href={`mailto:${CONTACT}`} className="text-blue-600">
              {CONTACT}
            </a>
          </p>
        </Section>
      </section>

      <hr className="my-10 border-gray-200" />

      <h2 className="text-xl font-extrabold text-gray-900">
        Privacy Policy (English)
      </h2>
      <section className="mt-5 flex flex-col gap-5 text-[15px] leading-relaxed text-gray-700">
        <p>
          MediBridge (&ldquo;the app&rdquo;) can be used without creating an account and
          does not collect personally identifying information such as your name or
          contact details. It uses only two kinds of information, solely to provide its
          features.
        </p>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>
            <strong>Location (coordinates)</strong> — used to find nearby clinics and
            emergency facilities. Collected only if you grant permission.
          </li>
          <li>
            <strong>Symptom text</strong> — what you type into the consultation screen,
            used to generate a response.
          </li>
        </ul>
        <p>
          <strong>Neither is stored on our servers.</strong> Both are used only while
          the request is processed and then discarded; there is no retention period.
          Only your chosen display language is kept in on-device storage, and it is
          removed when you uninstall the app.
        </p>
        <p>
          Coordinates are sent to Korea&rsquo;s National Medical Center open data API to
          look up nearby facilities, and symptom text is sent to an AI processing
          service to generate the response. No identifying information accompanies
          either request, and all traffic is encrypted over HTTPS. We do not sell data
          or use it for advertising, and the app contains no ads or analytics trackers.
        </p>
        <p>
          Location permission is used only for finding nearby facilities; other features
          work without it, and you may revoke it at any time in device settings.
        </p>
        <p>
          Information in the app is for reference only and does not replace a medical
          diagnosis. For accurate diagnosis and treatment, consult a medical
          professional. In an emergency, call 119 or go to an emergency room
          immediately.
        </p>
        <p>
          Questions:{" "}
          <a href={`mailto:${CONTACT}`} className="text-blue-600">
            {CONTACT}
          </a>
        </p>
      </section>
    </div>
  );
}
