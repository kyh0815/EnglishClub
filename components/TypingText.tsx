"use client";

import { useEffect, useRef, useState } from "react";

type TypingTextProps = {
  text: string;
};

export default function TypingText({ text }: TypingTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [visibleText, setVisibleText] = useState("");
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const timeout = window.setTimeout(() => {
        setVisibleText(text);
        setStarted(true);
      }, 0);

      return () => window.clearTimeout(timeout);
    }

    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  useEffect(() => {
    if (!started || visibleText.length >= text.length) return;

    const timeout = window.setTimeout(() => {
      setVisibleText(text.slice(0, visibleText.length + 1));
    }, 70);

    return () => window.clearTimeout(timeout);
  }, [started, text, visibleText]);

  return (
    <span ref={ref} className="typing-text" aria-label={text}>
      <span aria-hidden="true">{visibleText}</span>
      <span className="typing-cursor" aria-hidden="true" />
    </span>
  );
}
