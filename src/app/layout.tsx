import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Calculator.net - 무료 온라인 계산기",
  description: "무료 온라인 계산기 - 재무, 피트니스 및 건강, 수학 등 다양한 분야의 계산기를 제공합니다.",
  keywords: "계산기, 온라인계산기, 과학계산기, 금융계산기, BMI계산기, 대출계산기, Calculator.net",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin=""
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
