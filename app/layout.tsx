import type { Metadata } from "next";
import "./globals.css";

const siteDescription =
  "떠들다 보면, 영어가 트입니다. 비슷한 레벨의 멤버들과 편하게 영어로 수다 떠는 소셜 클럽, The Round.";

export const metadata: Metadata = {
  metadataBase: new URL("https://english-club-vert.vercel.app"),
  title: "The Round — 떠들다 보면, 영어가 트입니다",
  description: siteDescription,
  openGraph: {
    title: "The Round — 떠들다 보면, 영어가 트입니다",
    description: siteDescription,
    images: [
      {
        url: "/images/the-round-hero.png",
        width: 1200,
        height: 630,
        alt: "The Round"
      }
    ],
    type: "website",
    locale: "ko_KR"
  },
  twitter: {
    card: "summary_large_image",
    title: "The Round — 떠들다 보면, 영어가 트입니다",
    description: siteDescription,
    images: ["/images/the-round-hero.png"]
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
