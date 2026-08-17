"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LOCALE,
  LOCALE_CODES,
  getLocaleMeta,
  matchLocale,
} from "./locales";
import { messages } from "./messages";

const STORAGE_KEY = "medibridge.locale";

const LocaleContext = createContext(null);

/** "반경 {km}km 내 {count}곳" 같은 자리표시자를 채운다. */
function interpolate(template, values) {
  if (!values) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) =>
    values[key] == null ? match : String(values[key])
  );
}

/** "home.consultTitle" 같은 점 경로로 사전을 판다. */
function resolve(dict, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], dict);
}

export function LocaleProvider({ children }) {
  // 서버 렌더와 첫 클라이언트 렌더가 어긋나면 하이드레이션이 깨지므로
  // 기본값으로 시작하고, 마운트 후에 저장값/기기 언어를 반영한다.
  const [locale, setLocaleState] = useState(DEFAULT_LOCALE);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && LOCALE_CODES.includes(stored)) {
      setLocaleState(stored);
      return;
    }

    const detected = matchLocale(navigator.languages ?? navigator.language);
    if (detected) setLocaleState(detected);
  }, []);

  // 아랍어는 RTL이라 문서 방향까지 바꿔야 레이아웃이 뒤집힌다.
  useEffect(() => {
    const meta = getLocaleMeta(locale);
    document.documentElement.lang = locale;
    document.documentElement.dir = meta.dir;
  }, [locale]);

  const setLocale = useCallback((next) => {
    if (!LOCALE_CODES.includes(next)) return;
    window.localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }, []);

  const value = useMemo(() => {
    const dict = messages[locale] ?? messages[DEFAULT_LOCALE];
    const fallback = messages[DEFAULT_LOCALE];

    const t = (path, values) => {
      const found = resolve(dict, path) ?? resolve(fallback, path);
      if (found == null) {
        // 키 오타를 조용히 삼키면 화면에 빈칸이 남는다. 경로를 그대로 보여준다.
        if (process.env.NODE_ENV !== "production") {
          console.warn(`[i18n] 없는 키: ${path}`);
        }
        return path;
      }
      return typeof found === "string" ? interpolate(found, values) : found;
    };

    return { locale, setLocale, t, dir: getLocaleMeta(locale).dir };
  }, [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale은 LocaleProvider 안에서만 쓸 수 있습니다.");
  return ctx;
}

/** 문구만 필요한 곳을 위한 축약 훅. */
export function useT() {
  return useLocale().t;
}
