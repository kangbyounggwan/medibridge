"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import logo from "@/public/logo.png";
import LanguagePicker from "@/components/LanguagePicker";
import { useT } from "@/lib/i18n";
import { isClinicRoute } from "@/lib/mode";

// 화면 경로 → 번역 키. 병원용 화면은 운영자가 한국인이라 번역하지 않는다.
const TITLE_KEYS = {
  "/": "title.home",
  "/chat": "title.chat",
  "/hospitalList": "title.hospitalList",
  "/hospitalChat": "title.hospitalChat",
  "/emergency": "title.emergency",
};

const CLINIC_TITLES = {
  "/clinic": "병원 서비스",
  "/analysis": "월간 리포트",
};

// 탭으로 바로 갈 수 있는 화면은 스택의 뿌리라 뒤로가기를 두지 않는다.
// /clinic은 환자 홈에서 들어오는 진입점이라 뒤로가기를 남긴다.
const TAB_ROUTES = new Set([
  "/",
  "/chat",
  "/hospitalList",
  "/emergency",
  "/analysis",
]);

// 웹 사이트용 메뉴. 아직 대상 페이지가 없어 데스크톱에서만 노출한다.
const SITE_LINKS = ["회사소개", "서비스소개", "성과", "인스타그램", "QNA"];

export default function AppBar() {
  const pathname = usePathname();
  const router = useRouter();
  const t = useT();

  const clinic = isClinicRoute(pathname);
  const title = clinic
    ? CLINIC_TITLES[pathname] ?? "MediBridge"
    : t(TITLE_KEYS[pathname] ?? "title.home");

  const canGoBack = !TAB_ROUTES.has(pathname);

  return (
    <>
      {/* 모바일: 컴팩트 앱바 */}
      <header
        className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur md:hidden"
        style={{ paddingTop: "var(--safe-top)" }}
      >
        <div className="relative flex h-[var(--appbar-h)] items-center justify-center px-2">
          {canGoBack && (
            <button
              type="button"
              onClick={() => router.back()}
              aria-label={t("common.back")}
              // RTL에서는 반대쪽에 붙고 아이콘도 뒤집혀야 한다.
              className="absolute start-1 flex h-11 w-11 items-center justify-center rounded-full text-gray-700 active:bg-gray-100 rtl:rotate-180"
            >
              <ChevronLeft size={24} aria-hidden="true" />
            </button>
          )}

          {pathname === "/" ? (
            <Image src={logo} width={104} height={44} alt="MediBridge" priority />
          ) : (
            <h1 className="text-base font-bold text-gray-800">{title}</h1>
          )}

          {/* 병원용 화면은 한국어 고정이라 언어 선택을 노출하지 않는다. */}
          {!clinic && (
            <div className="absolute end-1">
              <LanguagePicker />
            </div>
          )}
        </div>
      </header>

      {/* 데스크톱: 기존 웹 헤더 */}
      <header className="hidden h-[80px] border-b border-gray-300 bg-white px-6 shadow-md md:block">
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between">
          <Link href="/" aria-label={t("nav.home")}>
            <Image src={logo} width={120} height={50} alt="MediBridge" />
          </Link>
          <nav className="flex items-center gap-6 font-medium">
            {SITE_LINKS.map((label) => (
              <span key={label} className="text-gray-400" aria-disabled="true">
                {label}
              </span>
            ))}
            {!clinic && <LanguagePicker />}
          </nav>
        </div>
      </header>
    </>
  );
}
