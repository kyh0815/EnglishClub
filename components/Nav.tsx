"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { landingContent } from "@/lib/content";

type NavProps = {
  ctaHref?: string;
};

export default function Nav({ ctaHref = "/apply" }: NavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const navClassName = isHome && !scrolled ? `on-hero${hovered ? " hovered" : ""}` : "scrolled";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const hoverZone = 0;
    const onPointerMove = (event: PointerEvent) => {
      const nav = navRef.current;
      if (!nav) return;

      const rect = nav.getBoundingClientRect();
      const isInsideHoverZone =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top - hoverZone &&
        event.clientY <= rect.bottom + hoverZone;

      setHovered((current) => (current === isInsideHoverZone ? current : isInsideHoverZone));
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [isHome]);

  return (
    <nav ref={navRef} className={navClassName}>
      <div className="nav-in">
        <Link href="/" className="logo">
          <Image
            src="/images/the-round-logo.svg"
            alt=""
            width={24}
            height={24}
            className="logo-mark"
            aria-hidden="true"
            priority
          />
          <span>{landingContent.nav.logo}</span>
        </Link>
        <div className="nav-links" aria-label="Primary navigation">
          <Link href="/who-we-are">Who we are</Link>
          <Link href={ctaHref} className="nav-cta">
            {landingContent.nav.cta}
          </Link>
        </div>
      </div>
    </nav>
  );
}
