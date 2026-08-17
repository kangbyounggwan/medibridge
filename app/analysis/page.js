"use client";

import { useState } from "react";
import { FileDown, FileText, Search } from "lucide-react";
import AnalysisLoading from "@/components/AnalysisLoading";

const SAMPLE_REPORT_URL = "/sample_analysis.pdf";

const AnalysisPage = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportFor, setReportFor] = useState("");

  const handleAnalyze = (e) => {
    e.preventDefault();

    if (!hospitalName.trim()) {
      setError("병원명을 입력해주세요.");
      return;
    }

    setError("");
    setReportFor("");
    setLoading(true);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4 px-5 py-5">
      <p className="text-sm text-gray-500">
        병원명을 입력하면 해당 병원의 월간 분석 레포트를 확인할 수 있습니다.
      </p>

      <form onSubmit={handleAnalyze} className="flex flex-col gap-3">
        <label htmlFor="hospitalName" className="text-sm font-bold text-gray-800">
          병원명
        </label>

        <input
          id="hospitalName"
          value={hospitalName}
          onChange={(e) => {
            setHospitalName(e.target.value);
            if (error) setError("");
          }}
          placeholder="예: 아늑한의원"
          aria-invalid={error ? "true" : undefined}
          className={`w-full rounded-2xl border bg-white p-4 text-base outline-none transition focus:ring-2 ${
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
          }`}
        />

        {error && <p className="-mt-1 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 py-4 text-base font-bold text-white transition active:scale-[0.99]"
        >
          <Search size={18} aria-hidden="true" />
          분석하기
        </button>
      </form>

      {reportFor && (
        <section className="flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FileText size={22} aria-hidden="true" />
            </span>
            <div>
              <h2 className="font-bold text-gray-800">분석 레포트 준비 완료</h2>
              <p className="mt-0.5 text-sm text-gray-500">{reportFor}</p>
            </div>
          </div>

          <a
            href={SAMPLE_REPORT_URL}
            download
            className="flex items-center justify-center gap-2 rounded-xl bg-green-500 py-3.5 text-base font-bold text-white transition active:scale-[0.99]"
          >
            <FileDown size={18} aria-hidden="true" />
            PDF 다운로드
          </a>

          <p className="text-center text-xs text-gray-400">
            지금은 샘플 레포트가 내려받아집니다.
          </p>
        </section>
      )}

      {loading && (
        <AnalysisLoading
          onFinish={() => {
            setLoading(false);
            setReportFor(hospitalName.trim());
          }}
        />
      )}
    </div>
  );
};

export default AnalysisPage;
