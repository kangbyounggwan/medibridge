// 지원 언어. 국내 체류 외국인 규모가 큰 순서로 둔다.
// (2025.12 법무부 기준: 중국 > 베트남 > 미국 > 태국 순)
export const LOCALES = [
  { code: "ko", label: "한국어", english: "Korean", dir: "ltr" },
  { code: "en", label: "English", english: "English", dir: "ltr" },
  { code: "zh", label: "中文", english: "Chinese", dir: "ltr" },
  { code: "vi", label: "Tiếng Việt", english: "Vietnamese", dir: "ltr" },
  { code: "th", label: "ไทย", english: "Thai", dir: "ltr" },
  { code: "ja", label: "日本語", english: "Japanese", dir: "ltr" },
  { code: "id", label: "Bahasa Indonesia", english: "Indonesian", dir: "ltr" },
  { code: "ar", label: "العربية", english: "Arabic", dir: "rtl" },
];

export const DEFAULT_LOCALE = "ko";

export const LOCALE_CODES = LOCALES.map((l) => l.code);

export const getLocaleMeta = (code) =>
  LOCALES.find((l) => l.code === code) ?? LOCALES[0];

export const isRtl = (code) => getLocaleMeta(code).dir === "rtl";

/**
 * 기기/브라우저 언어를 지원 목록에 맞춘다.
 * navigator.language는 "zh-CN", "ar-SA"처럼 지역까지 오므로 앞부분만 본다.
 * 중국어 번체(zh-TW/zh-HK)도 일단 zh로 묶는다.
 */
export function matchLocale(preferred) {
  if (!preferred) return null;

  const candidates = Array.isArray(preferred) ? preferred : [preferred];

  for (const raw of candidates) {
    if (!raw) continue;
    const base = String(raw).toLowerCase().split("-")[0];
    if (LOCALE_CODES.includes(base)) return base;
    // 인도네시아어 구 코드
    if (base === "in") return "id";
  }

  return null;
}
