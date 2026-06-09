import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Round — 떠들다 보면, 영어가 트입니다",
  description: "The Round 무료 베타 1기 신청 랜딩페이지"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.2.8/400.css"
        />
        <link
          rel="stylesheet"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/npm/@fontsource/inter@5.2.8/500.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
