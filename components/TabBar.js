"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  FileText,
  Home,
  Hospital,
  Siren,
  Stethoscope,
} from "lucide-react";
import { isClinicRoute } from "@/lib/mode";

const PATIENT_TABS = [
  { href: "/", label: "홈", Icon: Home },
  { href: "/chat", label: "AI 상담", Icon: Stethoscope },
  {
    href: "/hospitalList",
    label: "병원",
    Icon: Hospital,
    also: ["/hospitalChat"],
  },
  { href: "/emergency", label: "응급실", Icon: Siren },
];

const CLINIC_TABS = [
  { href: "/clinic", label: "병원 홈", Icon: Building2 },
  { href: "/analysis", label: "월간 리포트", Icon: FileText },
];

export default function TabBar() {
  const pathname = usePathname();
  const clinic = isClinicRoute(pathname);
  const tabs = clinic ? CLINIC_TABS : PATIENT_TABS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label={clinic ? "병원 서비스" : "주요 화면"}
    >
      <ul className="flex h-[var(--tabbar-h)] items-stretch">
        {tabs.map(({ href, label, Icon, also = [] }) => {
          const active = pathname === href || also.includes(pathname);

          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-full flex-col items-center justify-center gap-1 transition-colors ${
                  active ? "text-blue-600" : "text-gray-400"
                }`}
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.4 : 1.8}
                  aria-hidden="true"
                />
                <span
                  className={`text-[11px] leading-none ${
                    active ? "font-bold" : "font-medium"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
