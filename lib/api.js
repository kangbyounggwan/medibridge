// 상담 API의 기준 주소.
//
// 웹(next dev / next start)에서는 빈 문자열이라 "/api/..." 상대경로가 그대로 쓰인다.
// 모바일(Capacitor) 빌드에서는 앱 안에 서버가 없으므로 빌드 시점에
// NEXT_PUBLIC_API_BASE_URL 로 원격 서버를 주입한다.
//   - 안드로이드 에뮬레이터 → 개발 PC : http://10.0.2.2:3000
//   - 배포 후                        : https://<배포주소>
//
// NEXT_PUBLIC_ 접두사가 붙은 값은 빌드 시 번들에 인라인되므로 정적 export에서도 동작한다.
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export const apiUrl = (path) => `${API_BASE_URL}${path}`;
