"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Hospital,
  Loader2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { apiUrl } from "@/lib/api";
import { useLocale } from "@/lib/i18n";

export default function ChatPage() {
  const { locale, t } = useLocale();

  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!symptoms.trim()) {
      setError(t("chat.emptyError"));
      return;
    }

    setLoading(true);
    setError("");
    setResponse("");
    setSources([]);

    try {
      const res = await fetch(apiUrl("/api/medical-consultation"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // 사용자가 고른 앱 언어로 답하게 한다.
        // 입력 텍스트를 추측하면 화면 언어와 답변 언어가 어긋날 수 있다.
        body: JSON.stringify({ symptoms, language: locale }),
      });

      if (!res.ok) throw new Error(t("chat.errorTitle"));

      const data = await res.json();
      setResponse((data.response ?? "").replaceAll("**", ""));
      setSources(data.sources || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSymptoms("");
    setResponse("");
    setError("");
    setSources([]);
  };

  const hasContent = symptoms.length > 0 || response.length > 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 py-5">
      {/* 안내 */}
      <div className="flex flex-col gap-2.5">
        <p className="text-sm text-gray-500">{t("chat.subtitle")}</p>

        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          {t("chat.disclaimer")}
        </p>
      </div>

      {/* 입력 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="symptoms" className="text-sm font-bold text-gray-800">
          {t("chat.label")}
        </label>

        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder={t("chat.placeholder")}
          rows={5}
          className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-4 text-base leading-relaxed outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 rounded-2xl py-4 text-base font-bold text-white transition ${
            loading ? "bg-gray-400" : "bg-blue-500 active:scale-[0.99]"
          }`}
        >
          {loading && <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
          {loading ? t("chat.submitting") : t("chat.submit")}
        </button>

        {hasContent && (
          <button
            type="button"
            onClick={clearForm}
            className="self-center px-4 py-2 text-sm font-medium text-gray-400 active:text-gray-600"
          >
            {t("chat.clear")}
          </button>
        )}
      </form>

      {/* 오류 */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 p-4">
          <XCircle size={17} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-bold text-red-600">
              {t("chat.errorTitle")}
            </h2>
            <p className="mt-0.5 text-sm text-red-500">{error}</p>
          </div>
        </div>
      )}

      {/* 결과 */}
      {response && (
        <>
          <section className="rounded-2xl border border-gray-200 bg-white p-5">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
              <MessageSquare size={17} className="text-blue-500" aria-hidden="true" />
              {t("chat.resultTitle")}
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {response}
            </p>

            {sources.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                  <BookOpen size={15} className="text-gray-400" aria-hidden="true" />
                  {t("chat.sourceTitle")}
                </h3>
                <ul className="mt-2 flex flex-col gap-1.5">
                  {sources.map((src, i) => (
                    <li key={i}>
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-blue-600"
                      >
                        {src.title || src.url}
                        <ExternalLink size={12} className="shrink-0" aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-amber-100 bg-amber-50 p-5">
            <h2 className="flex items-center gap-2 text-sm font-bold text-amber-800">
              <AlertTriangle size={16} aria-hidden="true" />
              {t("chat.warningTitle")}
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-amber-800">
              {["chat.warning1", "chat.warning2", "chat.warning3"].map((key) => (
                <li key={key} className="flex gap-2">
                  <span aria-hidden="true">·</span>
                  {t(key)}
                </li>
              ))}
            </ul>
          </section>

          {/* 다음 단계 */}
          <section className="rounded-2xl bg-blue-500 p-5 text-white">
            <p className="text-sm font-medium text-blue-50">
              {t("chat.nextTitle")}
            </p>
            <Link
              href="/hospitalList"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-base font-bold text-blue-600 transition active:scale-[0.99]"
            >
              <Hospital size={18} aria-hidden="true" />
              {t("chat.nextLink")}
              <ArrowRight size={16} aria-hidden="true" className="shrink-0 rtl:rotate-180" />
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
