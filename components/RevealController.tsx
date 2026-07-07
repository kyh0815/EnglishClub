"use client";

import { useEffect } from "react";

export default function RevealController() {
  useEffect(() => {
    document.querySelectorAll(".rv").forEach((element) => element.classList.add("in"));
  }, []);

  return null;
}
