// 앱은 두 사업을 담는다.
//   환자 모드(B2C) — 한국 거주 외국인이 증상을 상담하고 병원을 찾는다
//   병원 모드(B2B) — 병원 관계자가 월간 리포트를 받고 상담을 신청한다
//
// 역할을 별도 상태로 저장하지 않고 경로로만 판단한다. 저장된 역할과 실제 화면이
// 어긋나는 경우가 없고, 딥링크로 어느 화면에 떨어져도 모드가 맞는다.

export const CLINIC_ROUTES = ["/clinic", "/analysis"];

export const isClinicRoute = (pathname) => CLINIC_ROUTES.includes(pathname);
