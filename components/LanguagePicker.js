"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Globe } from "lucide-react";
import { useLocale } from "@/lib/i18n";
import { LOCALES } from "@/lib/i18n/locales";

export default function LanguagePicker() {
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);

  // 바깥을 누르거나 ESC를 누르면 닫는다.
  useEffect(() => {
    if (!open) return;

    const onPointerDown = (e) => {
      if (!boxRef.current?.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={boxRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={t("language.title")}
        className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 active:bg-gray-100"
      >
        <Globe size={21} aria-hidden="true" />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t("language.title")}
          // RTL에서도 화면 안쪽으로 열리도록 논리 속성을 쓴다.
          className="absolute end-0 top-[calc(100%+.35rem)] z-50 max-h-[60vh] w-52 overflow-y-auto rounded-2xl border border-gray-200 bg-white py-1.5 shadow-xl"
        >
          {LOCALES.map(({ code, label, english }) => {
            const active = code === locale;
            return (
              <li key={code}>
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    setLocale(code);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 px-4 py-2.5 text-start ${
                    active ? "text-blue-600" : "text-gray-700"
                  } active:bg-gray-50`}
                >
                  <span className="flex-1">
                    <span
                      className={`block text-sm ${
                        active ? "font-bold" : "font-medium"
                      }`}
                    >
                      {label}
                    </span>
                    <span className="block text-xs text-gray-400">{english}</span>
                  </span>
                  {active && <Check size={16} aria-hidden="true" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
