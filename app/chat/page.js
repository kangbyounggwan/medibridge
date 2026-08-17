"use client";

import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  ExternalLink,
  Globe,
  Hospital,
  Loader2,
  MessageSquare,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { apiUrl } from "@/lib/api";

export default function ChatPage() {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [sources, setSources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [detectedLanguage, setDetectedLanguage] = useState("");

  function filterResponse(response) {
    return response.replaceAll("**", "");
  }

  const detectLanguage = (text) => {
    const koreanRegex = /[가-힣]/;
    const chineseRegex = /[一-龯]/;
    const japaneseRegex = /[ぁ-んァ-ン]/;
    const arabicRegex = /[ء-ي]/;
    const russianRegex = /[а-я]/i;

    if (koreanRegex.test(text)) return "Korean";
    if (chineseRegex.test(text)) return "Chinese";
    if (japaneseRegex.test(text)) return "Japanese";
    if (arabicRegex.test(text)) return "Arabic";
    if (russianRegex.test(text)) return "Russian";
    return "English";
  };

  const getUIText = (lang) => {
    const texts = {
      Korean: {
        subtitle: "증상을 입력하시면 AI가 상담을 도와드립니다.",
        disclaimer:
          "정확한 진단을 위해서는 반드시 의료진의 진료를 받으시기 바랍니다.",
        label: "증상을 자세히 설명해주세요",
        placeholder: "예: 어제부터 머리가 아프고 열이 나며, 기침도 심해요...",
        submitBtn: "AI 상담 받기",
        loadingBtn: "상담 중...",
        clearBtn: "초기화",
        errorTitle: "오류",
        resultTitle: "AI 상담 결과",
        warningTitle: "중요한 안내",
        warningItems: [
          "이 상담은 참고용이며 의학적 진단을 대체할 수 없습니다.",
          "심각한 증상이거나 응급상황이 의심되면 즉시 119에 신고하거나 응급실을 방문하세요.",
          "정확한 진단과 치료를 위해 반드시 의료진의 진료를 받으시기 바랍니다.",
        ],
        emptyError: "증상을 입력해주세요.",
        HospitalText: "당신의 주변의 병원을 추천해드릴까요?",
        HospitalLink: "네! 추천해주세요",
        sourceTitle: "참고 자료",
      },
      English: {
        subtitle: "Enter your symptoms and AI will help with consultation.",
        disclaimer:
          "For accurate diagnosis, you must seek direct medical care from healthcare professionals.",
        label: "Please describe your symptoms in detail",
        placeholder:
          "e.g., I have been experiencing headaches and fever since yesterday, and severe coughing...",
        submitBtn: "Get AI Consultation",
        loadingBtn: "Consulting...",
        clearBtn: "Clear",
        errorTitle: "Error",
        resultTitle: "AI Consultation Result",
        warningTitle: "Important Notice",
        warningItems: [
          "This consultation is for reference only and cannot replace medical diagnosis.",
          "If you have serious symptoms or suspect an emergency, call emergency services immediately.",
          "For accurate diagnosis and treatment, you must seek direct medical care from healthcare professionals.",
        ],
        emptyError: "Please enter your symptoms.",
        HospitalText: "Would you like me to recommend hospitals near you?",
        HospitalLink: "Yes, please recommend.",
        sourceTitle: "References",
      },
    };

    return texts[lang] || texts.English;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentLang = detectLanguage(symptoms);
    setDetectedLanguage(currentLang);
    const uiText = getUIText(currentLang);

    if (!symptoms.trim()) {
      setError(uiText.emptyError);
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
        body: JSON.stringify({ symptoms, language: currentLang }),
      });

      if (!res.ok) throw new Error("Server error");

      const data = await res.json();
      setResponse(filterResponse(data.response));
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
    setDetectedLanguage("");
    setSources([]);
  };

  const currentUILang =
    detectedLanguage || (symptoms ? detectLanguage(symptoms) : "Korean");
  const uiText = getUIText(currentUILang);
  const hasContent = symptoms.length > 0 || response.length > 0;

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 py-5">
      {/* 안내 */}
      <div className="flex flex-col gap-2.5">
        <p className="text-sm text-gray-500">{uiText.subtitle}</p>

        <p className="flex items-start gap-2 rounded-xl bg-amber-50 px-3.5 py-3 text-xs leading-relaxed text-amber-800">
          <AlertTriangle size={15} className="mt-0.5 shrink-0" aria-hidden="true" />
          {uiText.disclaimer}
        </p>

        {detectedLanguage && (
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
            <Globe size={13} aria-hidden="true" />
            Detected: {detectedLanguage}
          </span>
        )}
      </div>

      {/* 입력 */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label htmlFor="symptoms" className="text-sm font-bold text-gray-800">
          {uiText.label}
        </label>

        <textarea
          id="symptoms"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder={uiText.placeholder}
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
          {loading ? uiText.loadingBtn : uiText.submitBtn}
        </button>

        {hasContent && (
          <button
            type="button"
            onClick={clearForm}
            className="self-center px-4 py-2 text-sm font-medium text-gray-400 active:text-gray-600"
          >
            {uiText.clearBtn}
          </button>
        )}
      </form>

      {/* 오류 */}
      {error && (
        <div className="flex items-start gap-2.5 rounded-2xl border border-red-100 bg-red-50 p-4">
          <XCircle size={17} className="mt-0.5 shrink-0 text-red-500" aria-hidden="true" />
          <div>
            <h2 className="text-sm font-bold text-red-600">{uiText.errorTitle}</h2>
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
              {uiText.resultTitle}
            </h2>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {response}
            </p>

            {sources.length > 0 && (
              <div className="mt-5 border-t border-gray-100 pt-4">
                <h3 className="flex items-center gap-1.5 text-sm font-bold text-gray-700">
                  <BookOpen size={15} className="text-gray-400" aria-hidden="true" />
                  {uiText.sourceTitle}
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
              {uiText.warningTitle}
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5 text-sm leading-relaxed text-amber-800">
              {uiText.warningItems.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span aria-hidden="true">·</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* 다음 단계 */}
          <section className="rounded-2xl bg-blue-500 p-5 text-white">
            <p className="text-sm font-medium text-blue-50">
              {uiText.HospitalText}
            </p>
            <Link
              href="/hospitalList"
              className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-base font-bold text-blue-600 transition active:scale-[0.99]"
            >
              <Hospital size={18} aria-hidden="true" />
              {uiText.HospitalLink}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </section>
        </>
      )}
    </div>
  );
}
