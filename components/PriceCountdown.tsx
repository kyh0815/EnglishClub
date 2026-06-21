"use client";

import { useEffect, useRef, useState } from "react";

type PriceCountdownProps = {
  from: number;
  to: number;
  suffix?: string;
};

const formatter = new Intl.NumberFormat("ko-KR");

export default function PriceCountdown({ from, to, suffix = "" }: PriceCountdownProps) {
  const [value, setValue] = useState(from);
  const rootRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let frame = 0;
    let timeout = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) {
      frame = window.requestAnimationFrame(() => setValue(to));
      return () => window.cancelAnimationFrame(frame);
    }

    let hasPlayed = false;

    const animate = () => {
      const duration = 950;
      const start = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setValue(Math.round(from + (to - from) * eased));

        if (progress < 1) {
          frame = window.requestAnimationFrame(tick);
        } else {
          setValue(to);
        }
      };

      frame = window.requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayed) return;
        hasPlayed = true;
        setValue(from);
        timeout = window.setTimeout(animate, 220);
      },
      { threshold: 0.55 }
    );

    observer.observe(root);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
    };
  }, [from, to]);

  return (
    <span ref={rootRef} className="price-countdown" aria-label={`${formatter.format(to)}${suffix}`}>
      <span aria-hidden="true">{formatter.format(value)}</span>
      <span aria-hidden="true">{suffix}</span>
    </span>
  );
}
