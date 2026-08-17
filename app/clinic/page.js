"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  FileText,
  TrendingUp,
} from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

// 네이버 폼. 병원 도입 상담 신청 창구다.
const CONSULT_FORM_URL = "https://naver.me/G8hId90X";

export default function ClinicPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 pt-6 pb-10 md:px-6 md:pt-12">
      <motion.div {...fadeUp} transition={{ duration: 0.45 }}>
        <h2 className="text-2xl font-extrabold leading-snug text-gray-800 md:text-4xl">
          남들보다 앞서나가는
          <br />
          <span className="text-blue-500">병원 만들기</span>
        </h2>
        <p className="mt-2 text-sm text-gray-500 md:text-lg">
          MediBridge는 외국인 환자를 병원으로 연결하고,
          <br className="hidden md:block" /> 병원 운영에 필요한 분석을
          제공합니다.
        </p>
      </motion.div>

      {/* 주 액션 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-7"
      >
        <Link
          href="/analysis"
          className="flex items-center gap-4 rounded-2xl bg-blue-500 p-5 text-white shadow-lg shadow-blue-500/20 transition active:scale-[0.99]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <FileText size={26} aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-lg font-bold">월간 리포트 확인</span>
            <span className="mt-0.5 block text-sm text-blue-50">
              우리 병원 분석 레포트 받아보기
            </span>
          </span>
          <ArrowRight size={20} aria-hidden="true" className="shrink-0" />
        </Link>
      </motion.div>

      {/* 제공 내용 */}
      <motion.ul
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="mt-3 flex flex-col gap-3"
      >
        <li className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <TrendingUp size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block font-bold text-gray-800">지역 상권 분석</span>
            <span className="mt-0.5 block text-sm text-gray-500">
              질병관리청 지역건강통계와 주변 경쟁 의원 현황을 함께 봅니다.
            </span>
          </span>
        </li>

        <li className="flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <ClipboardCheck size={20} aria-hidden="true" />
          </span>
          <span>
            <span className="block font-bold text-gray-800">
              외국인 환자 연결
            </span>
            <span className="mt-0.5 block text-sm text-gray-500">
              AI 상담을 거친 환자가 증상에 맞는 병원으로 연결됩니다.
            </span>
          </span>
        </li>
      </motion.ul>

      {/* 상담 신청 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.25 }}
        className="mt-8 rounded-2xl bg-blue-400 p-5 text-center md:p-8"
      >
        <p className="text-base font-bold leading-relaxed text-white md:text-xl">
          5분 상담을 통해 지금 바로 시작해보세요!
        </p>
        <a
          href={CONSULT_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-block rounded-xl bg-white px-6 py-3 font-semibold text-blue-500 transition active:scale-[0.99]"
        >
          병원 등록 상담 신청 &#8640;
        </a>
      </motion.div>

      {/* 환자용으로 돌아가는 길 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="mt-6 text-center"
      >
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-400 active:text-gray-600"
        >
          <ArrowLeft size={15} aria-hidden="true" />
          환자 서비스로 돌아가기
        </Link>
      </motion.div>
    </div>
  );
}
