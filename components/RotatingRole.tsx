"use client";

import { useEffect, useState } from "react";

const ROLES = [
  "Data Science Developer",
  "Full Stack Developer",
  "AI and ML Developer",
];

const TYPE_MS = 78;
const DELETE_MS = 42;
const HOLD_MS = 1400;

export default function RotatingRole() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const full = ROLES[roleIndex];
    const atEnd = text === full;
    const delay = deleting ? DELETE_MS : atEnd ? HOLD_MS : TYPE_MS;

    const id = window.setTimeout(() => {
      if (!deleting) {
        if (text.length < full.length) {
          setText(full.slice(0, text.length + 1));
          return;
        }
        setDeleting(true);
        return;
      }

      if (text.length > 0) {
        setText(text.slice(0, -1));
        return;
      }

      setDeleting(false);
      setRoleIndex((index) => (index + 1) % ROLES.length);
    }, delay);

    return () => window.clearTimeout(id);
  }, [text, deleting, roleIndex, reduceMotion]);

  const shown = reduceMotion ? ROLES[0] : text;

  return (
    <p
      className="mt-3 min-h-[2.4em] text-center font-[family-name:var(--font-mono)] text-sm uppercase tracking-[0.14em] text-red md:text-base"
      aria-live="polite"
    >
      <span>{shown || "\u00a0"}</span>
      <span className="role-caret" aria-hidden="true" />
    </p>
  );
}
