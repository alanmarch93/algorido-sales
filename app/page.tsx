"use client";

import { useCallback, useEffect, useState } from "react";

const SLIDES = [
  { id: 1, title: "Title Slide" },
  { id: 2, title: "What is AI?" },
  { id: 3, title: "Chatbots vs. Agentic AI" },
  { id: 4, title: "The Core Problem" },
  { id: 5, title: "The Solution" },
  { id: 6, title: "Partnership" },
  { id: 7, title: "Everyday Benefits" },
  { id: 8, title: "Security" },
  { id: 9, title: "Conclusion" },
];

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  const prev = useCallback(() => setCurrent((c) => Math.max(0, c - 1)), []);
  const next = useCallback(
    () => setCurrent((c) => Math.min(SLIDES.length - 1, c + 1)),
    []
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ")
        next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  return (
    <div className="relative w-screen h-screen bg-[#020f1d] overflow-hidden">
      {/* Slide iframe — full viewport minus nav bar */}
      <div className="absolute inset-0 bottom-[52px]">
        <iframe
          key={current}
          src={`/slides/slide-${current + 1}.html`}
          className="w-full h-full border-0"
          title={SLIDES[current].title}
        />
      </div>

      {/* Navigation bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[52px] flex items-center justify-between px-6 bg-black/70 backdrop-blur-md border-t border-white/10 z-50">
        {/* Prev */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-[#b8c4ff] border border-[#434655]/50 hover:border-[#b8c4ff]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          ← Prev
        </button>

        {/* Center: slide picker */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-mono text-[#c4c5d7] hover:text-[#b8c4ff] transition-colors"
          >
            <span className="text-[#7df4ff] font-bold">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-[#434655]">/</span>
            <span>{SLIDES.length}</span>
            <span className="mx-1 text-[#434655]">·</span>
            <span className="tracking-wide uppercase text-xs">
              {SLIDES[current].title}
            </span>
            <span className="ml-1 text-[#434655] text-xs">▲</span>
          </button>

          {menuOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0e1d2b] border border-[#434655]/50 rounded-xl overflow-hidden shadow-2xl w-64 z-50">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => {
                    setCurrent(i);
                    setMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-left transition-colors ${
                    i === current
                      ? "bg-[#3c63ee]/20 text-[#b8c4ff]"
                      : "text-[#c4c5d7] hover:bg-white/5"
                  }`}
                >
                  <span className="font-mono text-xs text-[#7df4ff] w-6">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>{slide.title}</span>
                  {i === current && (
                    <span className="ml-auto text-[#7df4ff] text-xs">●</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Progress dots */}
        <div className="hidden sm:flex items-center gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === current
                  ? "w-6 bg-[#b8c4ff]"
                  : "w-1.5 bg-[#434655] hover:bg-[#8e90a0]"
              }`}
            />
          ))}
        </div>

        {/* Next */}
        <button
          onClick={next}
          disabled={current === SLIDES.length - 1}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-medium text-[#b8c4ff] border border-[#434655]/50 hover:border-[#b8c4ff]/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
