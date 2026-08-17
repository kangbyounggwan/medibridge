import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AppBar from "@/components/AppBar";
import BackButtonHandler from "@/components/BackButtonHandler";
import TabBar from "@/components/TabBar";
import { LocaleProvider } from "@/lib/i18n";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MEDIBRIDGE",
  description: "한국 거주 외국인을 위한 AI 병원 연결 플랫폼",
};

// viewportFit: cover 라야 앱에서 env(safe-area-inset-*)에 실제 값이 들어온다.
export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col bg-white`}
      >
        <LocaleProvider>
          <AppBar />

          {/* 모바일에서는 하단 탭바에 가리지 않도록 그만큼 비워둔다. */}
          <main className="flex-1 pb-[calc(var(--tabbar-h)+var(--safe-bottom))] md:pb-0">
            {children}
          </main>

          {/* 웹 푸터. 앱에서는 탭바가 그 역할을 하므로 데스크톱에서만 보인다. */}
          <footer className="hidden border-t border-gray-300 md:block">
            <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-500">
              <p className="mb-1">
                © 2025 AI Medical Consultation Service | MEDIBRIDGE
              </p>
              <p className="text-xs text-gray-400">
                🌍 Korean · English · 中文 · Tiếng Việt · ไทย · 日本語 · Bahasa
                Indonesia · العربية
              </p>
            </div>
          </footer>

          <TabBar />
          <BackButtonHandler />
        </LocaleProvider>
      </body>
    </html>
  );
}
