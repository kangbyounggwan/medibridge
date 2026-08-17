"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { isClinicRoute } from "@/lib/mode";

// 각 모드의 시작 화면. 여기서 뒤로가기를 또 누르면 앱을 종료한다.
const PATIENT_ROOT = "/";
const CLINIC_ROOT = "/clinic";

// 한 번 더 누르면 종료 — 실수로 앱이 꺼지는 걸 막는다.
const EXIT_CONFIRM_MS = 2000;

/**
 * 안드로이드 하드웨어/제스처 뒤로가기 처리.
 *
 * Capacitor 기본 동작은 히스토리가 없으면 바로 앱을 종료하는 것이라,
 * 탭을 눌러 이동한 뒤 뒤로가기를 누르면 앱이 꺼져버린다.
 * 화면 위치에 맞게 뒤로 → 시작 화면 → 종료 순으로 단계를 둔다.
 */
export default function BackButtonHandler() {
  const router = useRouter();
  const pathname = usePathname();
  const [exitHint, setExitHint] = useState(false);

  // 리스너를 매번 새로 붙이지 않도록 최신 경로만 ref로 넘긴다.
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    let armedAt = 0;
    let hintTimer;
    let listener;
    let cancelled = false;

    const handle = ({ canGoBack }) => {
      const current = pathnameRef.current;
      const root = isClinicRoute(current) ? CLINIC_ROOT : PATIENT_ROOT;

      if (current !== root) {
        // 스택이 있으면 뒤로, 탭으로 바로 진입해 스택이 없으면 시작 화면으로.
        if (canGoBack) router.back();
        else router.push(root);
        return;
      }

      // 시작 화면에서는 두 번 눌러야 종료된다.
      const now = Date.now();
      if (now - armedAt < EXIT_CONFIRM_MS) {
        App.exitApp();
        return;
      }

      armedAt = now;
      setExitHint(true);
      clearTimeout(hintTimer);
      hintTimer = setTimeout(() => setExitHint(false), EXIT_CONFIRM_MS);
    };

    App.addListener("backButton", handle).then((registered) => {
      if (cancelled) registered.remove();
      else listener = registered;
    });

    return () => {
      cancelled = true;
      clearTimeout(hintTimer);
      listener?.remove();
    };
  }, [router]);

  if (!exitHint) return null;

  return (
    <div
      role="status"
      className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-6"
      style={{ bottom: "calc(var(--tabbar-h) + var(--safe-bottom) + 1rem)" }}
    >
      <span className="rounded-full bg-gray-900/85 px-4 py-2.5 text-sm font-medium text-white">
        한 번 더 누르면 앱이 종료됩니다
      </span>
    </div>
  );
}
