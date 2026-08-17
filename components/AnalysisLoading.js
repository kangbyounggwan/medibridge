"use client";

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

const MESSAGES = [
  "질병관리청 지역건강통계 데이터를 분석중입니다...",
  "주변 지역 상권 및 경쟁의원을 분석중입니다...",
];

const STEP_MS = 3000;

const AnalysisLoading = ({ onFinish }) => {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // 마지막 메시지까지 보여준 뒤 부모에게 완료를 알린다.
    if (step >= MESSAGES.length) {
      const done = setTimeout(() => onFinish?.(), 800);
      return () => clearTimeout(done);
    }

    const next = setTimeout(() => setStep((prev) => prev + 1), STEP_MS);
    return () => clearTimeout(next);
  }, [step, onFinish]);

  const current = Math.min(step, MESSAGES.length - 1);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
    >
      <div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-2xl bg-white p-7">
        <Loader2 size={36} className="animate-spin text-blue-500" aria-hidden="true" />

        <p className="text-center text-sm font-medium leading-relaxed text-gray-700">
          {MESSAGES[current]}
        </p>

        {/* 단계 표시 */}
        <div className="flex gap-1.5" aria-hidden="true">
          {MESSAGES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= current ? "w-6 bg-blue-500" : "w-1.5 bg-gray-200"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisLoading;
