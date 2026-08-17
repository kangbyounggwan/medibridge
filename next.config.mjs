/** @type {import('next').NextConfig} */

// 모바일(Capacitor) 빌드는 정적 export(out-mobile)를 만든다.
// 정적 export에는 서버 라우트를 포함할 수 없으므로, pageExtensions에서 "api.js"를 빼서
// app/api/**/route.api.js 를 라우트로 인식시키지 않는다. 웹 빌드에서는 그대로 포함된다.
const isMobileBuild = process.env.MOBILE_BUILD === "1";

// 앱은 서버 없이 동작해야 하므로 공공데이터 키를 앱 번들에 넣는다.
// 공개 웹사이트 번들에는 절대 넣지 않는다 — 웹 JS가 APK보다 긁어가기 쉽다.
// (OpenAI 키는 과금 계정이라 어느 쪽에도 넣지 않고 서버에만 둔다.)
const mobileClientEnv = process.env.DATA_GO_KR_SERVICE_KEY
  ? { NEXT_PUBLIC_DATA_GO_KR_SERVICE_KEY: process.env.DATA_GO_KR_SERVICE_KEY }
  : {};

const nextConfig = {
  pageExtensions: isMobileBuild ? ["js", "jsx"] : ["api.js", "js", "jsx"],
  ...(isMobileBuild && {
    output: "export",
    // dev 서버가 쓰는 .next를 모바일 빌드가 덮어써서 깨뜨리는 걸 막는다.
    // output: "export"에서는 이 디렉터리에 정적 결과물이 그대로 떨어지므로
    // capacitor.config.json의 webDir와 반드시 같은 값이어야 한다.
    distDir: "out-mobile",
    images: { unoptimized: true },
    env: mobileClientEnv,
  }),
};

export default nextConfig;
