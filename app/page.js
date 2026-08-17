"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Hospital, Siren, Stethoscope } from "lucide-react";
import mainImg from "@/public/service_sample.png";
import { useT } from "@/lib/i18n";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
};

export default function Home() {
  const t = useT();

  return (
    <div className="mx-auto w-full max-w-4xl px-5 pt-6 pb-10 md:px-6 md:pt-12">
      {/* 타이틀 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45 }}
        className="md:text-center"
      >
        <h2 className="text-2xl font-extrabold leading-snug text-gray-800 md:text-5xl">
          {t("home.heroA")}
          <br />
          <span className="text-blue-500">{t("home.heroHighlight")}</span>{" "}
          {t("home.heroB")}
        </h2>
        <p className="mt-2 text-sm text-gray-500 md:mt-4 md:text-xl">
          {t("home.subtitle")}
        </p>
      </motion.div>

      {/* 주 액션 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.1 }}
        className="mt-7 md:mt-10"
      >
        <Link
          href="/chat"
          className="flex items-center gap-4 rounded-2xl bg-blue-500 p-5 text-white shadow-lg shadow-blue-500/20 transition active:scale-[0.99] md:justify-center"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/20">
            <Stethoscope size={26} aria-hidden="true" />
          </span>
          <span className="flex-1 md:flex-none">
            <span className="block text-lg font-bold">{t("home.consultTitle")}</span>
            <span className="mt-0.5 block text-sm text-blue-50">
              {t("home.consultDesc")}
            </span>
          </span>
          <ArrowRight size={20} aria-hidden="true" className="shrink-0 rtl:rotate-180" />
        </Link>
      </motion.div>

      {/* 보조 액션 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.18 }}
        className="mt-3 grid grid-cols-2 gap-3"
      >
        <Link
          href="/hospitalList"
          className="rounded-2xl border border-gray-200 bg-white p-4 transition active:scale-[0.99] active:bg-gray-50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
            <Hospital size={22} aria-hidden="true" />
          </span>
          <span className="mt-3 block font-bold text-gray-800">{t("home.hospitalTitle")}</span>
          <span className="mt-0.5 block text-xs text-gray-500">
            {t("home.hospitalDesc")}
          </span>
        </Link>

        <Link
          href="/emergency"
          className="rounded-2xl border border-gray-200 bg-white p-4 transition active:scale-[0.99] active:bg-gray-50"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
            <Siren size={22} aria-hidden="true" />
          </span>
          <span className="mt-3 block font-bold text-gray-800">{t("home.emergencyTitle")}</span>
          <span className="mt-0.5 block text-xs text-gray-500">
            {t("home.emergencyDesc")}
          </span>
        </Link>
      </motion.div>

      {/* 서비스 소개 이미지 — 앱 안에서 앱 스크린샷은 군더더기라 데스크톱에서만 */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-12 hidden md:block"
      >
        <Image src={mainImg} alt="메디브릿지 서비스 소개" className="w-full" />
      </motion.div>

      {/*
        병원 관계자 진입점. 환자용 앱이라 눈에 띄되 주 흐름을 가리지 않도록
        하단에 절제된 톤으로 둔다.
      */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.45, delay: 0.3 }}
        className="mt-8 md:mt-14"
      >
        <Link
          href="/clinic"
          className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 p-4 transition active:scale-[0.99] active:bg-gray-100"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-gray-500">
            <Building2 size={20} aria-hidden="true" />
          </span>
          <span className="flex-1">
            <span className="block text-sm font-bold text-gray-800">
              {t("home.clinicTitle")}
            </span>
            <span className="mt-0.5 block text-xs text-gray-500">
              {t("home.clinicDesc")}
            </span>
          </span>
          <ArrowRight
            size={16}
            aria-hidden="true"
            className="shrink-0 text-gray-400 rtl:rotate-180"
          />
        </Link>
      </motion.div>
    </div>
  );
}
