"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  const usesTransparentTop = isHome || transparentOnTop;
  const navClassName = [
    usesTransparentTop && !scrolled ? `on-hero${hovered ? " hovered" : ""}` : "scrolled",
    menuOpen ? "menu-open" : ""
  ]
    .filter(Boolean)
    .join(" ");

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }

      const nav = navRef.current;
      const drawer = nav?.querySelector(".nav-links");
      const menuButton = nav?.querySelector(".nav-menu-button");

      if (drawer?.contains(target) || menuButton?.contains(target)) {
        return;
      }

      setMenuOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen]);

  return (
    <nav ref={navRef} className={navClassName}>
      <div className="nav-in">
        <Link href="/" className="logo">
          <span className="logo-mark" aria-hidden="true" />
          <span>{landingContent.nav.logo}</span>
        </Link>
        <button
          className="nav-menu-button"
          type="button"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          {menuOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
        </button>
        <button
          className={`nav-drawer-backdrop${menuOpen ? " is-open" : ""}`}
          type="button"
          aria-label="메뉴 닫기"
          tabIndex={menuOpen ? 0 : -1}
          onClick={() => setMenuOpen(false)}
        />
        <div
          id="primary-navigation"
          className={`nav-links${menuOpen ? " is-open" : ""}`}
          aria-label="Primary navigation"
        >
          <Link href="/who-we-are" onClick={() => setMenuOpen(false)}>
            Who we are
          </Link>
          <Link href={ctaHref} className="nav-cta" onClick={() => setMenuOpen(false)}>
            {landingContent.nav.cta}
          </Link>
        </div>
      </div>
    </nav>
  );
}
