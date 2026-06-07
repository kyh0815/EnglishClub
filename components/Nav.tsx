"use client";

import { useEffect, useState } from "react";
import { landingContent } from "@/lib/content";

export default function Nav() {
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
        <div className="logo">{landingContent.nav.logo}</div>
        <a href="#apply" className="nav-cta">
          {landingContent.nav.cta}
        </a>
      </div>
    </nav>
  );
}
