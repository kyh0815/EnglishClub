import type { Metadata } from "next";
import "./globals.css";

const siteDescription =
  "영어 실력이 부족한 게 아니에요. 마음 편히 말할 기회가 없었을 뿐. The Round는 영어가 자연스럽게 오가는 순간을 만드는 소셜 클럽입니다.";
const siteUrl = "https://english-club-vert.vercel.app";
const ogImageUrl = "/images/the-round-og-20260706.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "The Round — 떠들다 보면, 영어가 트입니다",
  description: siteDescription,
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "The Round — 떠들다 보면, 영어가 트입니다",
    description: siteDescription,
    url: "/",
    siteName: "The Round",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "The Round - 떠들다 보면, 영어가 트입니다"
      }
    ],
    type: "website",
    locale: "ko_KR"
  },
  twitter: {
    card: "summary_large_image",
    title: "The Round — 떠들다 보면, 영어가 트입니다",
    description: siteDescription,
    images: [ogImageUrl]
  }
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
