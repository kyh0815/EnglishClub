"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { landingContent } from "@/lib/content";

type NavProps = {
  ctaHref?: string;
  transparentOnTop?: boolean;
};

export default function Nav({ ctaHref = "/apply", transparentOnTop = false }: NavProps) {
  const navRef = useRef<HTMLElement | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const usesTransparentTop = isHome || transparentOnTop;
  const navClassName =
    usesTransparentTop && !scrolled ? `on-hero${hovered ? " hovered" : ""}` : "scrolled";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!usesTransparentTop) {
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
  }, [usesTransparentTop]);

  return (
    <nav ref={navRef} className={navClassName}>
      <div className="nav-in">
        <Link href="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
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
