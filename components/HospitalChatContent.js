"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import icoKakao from "@/public/ico-kakao.png";
import Image from "next/image";
import { Send } from "lucide-react";
import { useT } from "@/lib/i18n";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function HospitalChatContent() {
  const searchParams = useSearchParams();
  const t = useT();
  const [hospitalId, setHospitalId] = useState(null);
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalType, setHospitalType] = useState("");
  const [hospitalHours, setHospitalHours] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showReservationButton, setShowReservationButton] = useState(false);
  const [showKakaoButton, setShowKakaoButton] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showReservationUI, setShowReservationUI] = useState(false);

  // searchParams를 state에 세팅
  useEffect(() => {
    setHospitalId(searchParams.get("hospitalId"));
    setHospitalName(searchParams.get("hospitalName") || "");
    setHospitalType(searchParams.get("hospitalType") || "");
    setHospitalHours(searchParams.get("hospitalHours") || "");
    setSymptoms(searchParams.get("symptoms") || "");
  }, [searchParams]);

  // 병원 정보
  const hospitalInfo = {
    1: {
      name: "아늑한의원",
      doctor: "차정훈 원장",
      specialties: ["약침", "침치료", "추나"],
      workingHours: "월-금 09:00-18:00, 토 09:00-13:00",
    },
    2: {
      name: "튼튼정형외과",
      doctor: "박정형 원장",
      specialties: ["도수치료", "물리치료", "관절염"],
      workingHours: "월-금 08:30-17:30, 토 08:30-12:30",
    },
    3: {
      name: "충남대학교병원",
      doctor: "종합진료팀",
      specialties: ["MRI 검사", "CT 촬영", "전문의 진료"],
      workingHours: "24시간 응급실 운영",
    },
  };

  // 심평원 데이터로 넘어온 병원은 위 데모 테이블에 없다.
  // 목록에서 전달된 값을 우선 쓰고, 데모 병원일 때만 상세 정보를 채운다.
  const demo = hospitalInfo[hospitalId];
  const currentHospital = {
    name: hospitalName || demo?.name || "병원",
    type: hospitalType || "",
    doctor: demo?.doctor ?? null,
    specialties: demo?.specialties ?? [],
    workingHours: hospitalHours || demo?.workingHours || null,
  };

  // FAQ 응답
  const faqResponses = {
    약침: `안녕하세요 ${currentHospital.name} 입니다.

문의주신 약침은 아늑한의원에서 3000회 이상 시술된 안전한 시술로 발목 주위 염증을 빠르게 잡아주는데 아주 효과적인 시술입니다.

시술 가격은 회당 15,000원이며 10회 패키지 결제시 10만원에 치료 가능합니다.

지금 예약 도와드릴까요?`,
  };

  // 초기 메시지
  useEffect(() => {
    if (!hospitalId) return;

    const lines = [t("hospitalChat.greeting", { name: currentHospital.name })];

    if (currentHospital.specialties.length > 0) {
      lines.push(
        t("hospitalChat.specialties", {
          list: currentHospital.specialties.join(", "),
        })
      );
    } else if (currentHospital.type) {
      lines.push(t("hospitalChat.typeIs", { type: currentHospital.type }));
    }

    if (currentHospital.doctor) {
      lines.push(t("hospitalChat.doctor", { doctor: currentHospital.doctor }));
    }
    if (currentHospital.workingHours) {
      lines.push(t("hospitalChat.hours", { hours: currentHospital.workingHours }));
    }
    if (symptoms) {
      lines.push(t("hospitalChat.symptomNote", { symptoms }));
    }
    lines.push(t("hospitalChat.askAnything"));

    const welcomeMessage = {
      type: "hospital",
      content: lines.join("\n\n"),
      timestamp: new Date(),
    };

    setMessages([welcomeMessage]);
    // currentHospital은 아래 값들에서 파생되므로 이 넷이 실제 의존성이다.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hospitalId, hospitalName, hospitalType, hospitalHours, symptoms, t]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setLoading(true);

    setTimeout(() => {
      const responseKey = Object.keys(faqResponses).find((key) =>
        inputMessage.includes(key)
      );

      const hospitalMessage = {
        type: "hospital",
        content: responseKey
          ? faqResponses[responseKey]
          : t("hospitalChat.fallback"),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, hospitalMessage]);
      setLoading(false);
    }, 800);
  };


  const bottomRef = useRef(null);

  // 예약 카드가 대화 흐름 안에 들어가므로, 새 내용이 화면 밖에 생기지 않게 맞춰준다.
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading, showReservationUI, showKakaoButton]);

  const formatTime = (date) =
    date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });

  // 실제 심평원 병원은 위 데모 테이블에 없으므로 id만 있으면 화면을 그린다.
  if (!hospitalId) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6 text-center text-sm text-gray-500">
        {t("hospitalChat.loadingHospital")}
      </div>
    );
  }

  const subtitle = [
    currentHospital.type,
    currentHospital.workingHours || currentHospital.doctor,
  ]
    .filter(Boolean)
    .join(" · ");

  const lastMessage = messages[messages.length - 1];
  const offersReservation =
    lastMessage?.type === "hospital" &&
    lastMessage.content.includes("예약 도와드릴까요") &&
    !showReservationButton;

  return (
    <div className="screen-fill mx-auto flex w-full max-w-2xl flex-col">
      {/* 병원 요약 */}
      <header className="border-b border-gray-200 bg-white px-5 py-3">
        <h2 className="font-bold text-gray-800">{currentHospital.name}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-gray-500">{subtitle}</p>}
        {currentHospital.specialties.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {currentHospital.specialties.map((item) => (
              <span
                key={item}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600"
              >
                {item}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* 대화 */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-4 py-4">
        <ul className="flex flex-col gap-3">
          {messages.map((message, idx) => {
            const mine = message.type === "user";
            return (
              <li
                key={idx}
                className={`flex ${mine ? "justify-end" : "justify-start"}`}
              >
                <div className={`max-w-[80%] ${mine ? "items-end" : "items-start"} flex flex-col gap-1`}>
                  <div
                    className={`whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                      mine
                        ? "rounded-br-md bg-blue-500 text-white"
                        : "rounded-bl-md border border-gray-200 bg-white text-gray-800"
                    }`}
                  >
                    {message.content}
                  </div>
                  <time className="px-1 text-[11px] text-gray-400">
                    {formatTime(message.timestamp)}
                  </time>
                </div>
              </li>
            );
          })}
        </ul>

        {loading && (
          <div className="mt-3 flex justify-start">
            <div className="flex gap-1 rounded-2xl rounded-bl-md border border-gray-200 bg-white px-4 py-3">
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:150ms]" />
              <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:300ms]" />
            </div>
          </div>
        )}

        {offersReservation && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => setShowReservationUI(true)}
              className="rounded-xl bg-blue-500 px-5 py-2.5 text-sm font-bold text-white active:scale-[0.99]"
            >
              {t("hospitalChat.reserve")}
            </button>
          </div>
        )}

        {showReservationUI && (
          <div className="mt-4 rounded-2xl border border-gray-200 bg-white p-4">
            <h3 className="text-center text-sm font-bold text-gray-800">
              {t("hospitalChat.reserveTitle")}
            </h3>

            <div className="mt-3">
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                  label={t("hospitalChat.datetime")}
                  value={selectedDate}
                  onChange={(newValue) => setSelectedDate(newValue)}
                  minDate={new Date()}
                  format="yyyy/MM/dd hh:mm a"
                  slotProps={{
                    textField: { fullWidth: true, variant: "outlined", size: "small" },
                  }}
                />
              </LocalizationProvider>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowReservationUI(false);
                  setSelectedDate(null);
                }}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-700 active:bg-gray-50"
              >
                {t("hospitalChat.cancel")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowReservationUI(false);
                  setShowKakaoButton(true);
                }}
                disabled={!selectedDate}
                className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white ${
                  selectedDate ? "bg-blue-500 active:scale-[0.99]" : "bg-gray-300"
                }`}
              >
                {t("hospitalChat.confirm")}
              </button>
            </div>
          </div>
        )}

        {showKakaoButton && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => alert(t("hospitalChat.kakaoDone"))}
              className="flex items-center gap-1.5 rounded-xl bg-[#fee500] px-5 py-2.5 text-sm font-bold text-black active:scale-[0.99]"
            >
              <Image src={icoKakao} width={18} height={18} alt="" aria-hidden="true" />
              {t("hospitalChat.kakao")}
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* 입력 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex gap-2 border-t border-gray-200 bg-white p-3"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={t("hospitalChat.placeholder")}
          aria-label={t("hospitalChat.inputLabel")}
          className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          aria-label={t("hospitalChat.send")}
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-white transition ${
            loading || !inputMessage.trim()
              ? "bg-gray-300"
              : "bg-blue-500 active:scale-[0.97]"
          }`}
        >
          <Send size={18} aria-hidden="true" />
        </button>
      </form>

    </div>
  );
}
