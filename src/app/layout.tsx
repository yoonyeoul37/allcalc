import type { Metadata } from "next";
import "./globals.css";

// 환경변수에서 도메인 가져오기 (기본값: calculator.net)
const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN || 'calculator.net';
const BASE_URL = `https://${DOMAIN}`;

export const metadata: Metadata = {
  title: "Calculator.net - 무료 온라인 계산기",
  description: "무료 온라인 계산기 - 재무, 피트니스 및 건강, 수학, 세무, 건설 등 다양한 분야의 계산기를 제공합니다. 부가가치세, 소득세, 대출, BMI, 임신 등 모든 계산기.",
  keywords: "계산기, 온라인계산기, 과학계산기, 금융계산기, BMI계산기, 대출계산기, 부가세계산기, 소득세계산기, 프리랜서세금계산기, 4대보험계산기, 퇴직금계산기, Calculator.net",
  authors: [{ name: "Calculator.net" }],
  creator: "Calculator.net",
  publisher: "Calculator.net",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(BASE_URL),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: "Calculator.net - 무료 온라인 계산기",
    description: "무료 온라인 계산기 - 재무, 피트니스 및 건강, 수학, 세무, 건설 등 다양한 분야의 계산기를 제공합니다.",
    url: BASE_URL,
    siteName: 'Calculator.net',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Calculator.net - 무료 온라인 계산기',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Calculator.net - 무료 온라인 계산기",
    description: "무료 온라인 계산기 - 재무, 피트니스 및 건강, 수학, 세무, 건설 등 다양한 분야의 계산기를 제공합니다.",
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Google Search Console에서 받은 코드로 변경 필요
    yandex: 'your-yandex-verification-code', // Yandex Webmaster에서 받은 코드로 변경 필요
  },
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
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#276699" />
        <meta name="msapplication-TileColor" content="#276699" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
