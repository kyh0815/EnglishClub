"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { landingContent } from "@/lib/content";

type NavProps = {
  ctaHref?: string;
};

export default function Nav({ ctaHref = "/apply" }: NavProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={scrolled ? "scrolled" : undefined}>
      <div className="nav-in">
        <Link href="/" className="logo">
          {landingContent.nav.logo}
        </Link>
        <div className="nav-links" aria-label="Primary navigation">
          <Link href="/who-we-are">Who we are</Link>
          <Link href="/timeslots">시간표</Link>
          <Link href={ctaHref}>{landingContent.nav.cta}</Link>
        </div>
      </div>
    </nav>
  );
}
