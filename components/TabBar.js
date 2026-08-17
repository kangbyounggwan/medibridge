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
import { useT } from "@/lib/i18n";
import { isClinicRoute } from "@/lib/mode";

const PATIENT_TABS = [
  { href: "/", key: "nav.home", Icon: Home },
  { href: "/chat", key: "nav.consult", Icon: Stethoscope },
  {
    href: "/hospitalList",
    key: "nav.hospitals",
    Icon: Hospital,
    also: ["/hospitalChat"],
  },
  { href: "/emergency", key: "nav.emergency", Icon: Siren },
];

const CLINIC_TABS = [
  { href: "/clinic", label: "병원 홈", Icon: Building2 },
  { href: "/analysis", label: "월간 리포트", Icon: FileText },
];

export default function TabBar() {
  const pathname = usePathname();
  const t = useT();
  const clinic = isClinicRoute(pathname);
  const tabs = clinic ? CLINIC_TABS : PATIENT_TABS;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white md:hidden"
      style={{ paddingBottom: "var(--safe-bottom)" }}
      aria-label={clinic ? "병원 서비스" : t("nav.home")}
    >
      <ul className="flex h-[var(--tabbar-h)] items-stretch">
        {tabs.map(({ href, label, key, Icon, also = [] }) => {
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
                  {key ? t(key) : label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
