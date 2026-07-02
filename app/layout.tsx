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
      <body>{children}</body>
    </html>
  );
}
