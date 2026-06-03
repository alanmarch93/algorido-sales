"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

const NAV_H = 60;
const SLIDE_W = 1280;
const SLIDE_H = 720;

export default function Presentation() {
  const [current, setCurrent] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scale, setScale] = useState(1);
  const touchStartX = useRef<number | null>(null);

  const prev = useCallback(() => {
    setCurrent((c) => Math.max(0, c - 1));
    setMenuOpen(false);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => Math.min(SLIDES.length - 1, c + 1));
    setMenuOpen(false);
  }, []);

  // Recalculate scale on resize
  useEffect(() => {
    const calc = () => {
      const availH = window.innerHeight - NAV_H;
      setScale(Math.min(window.innerWidth / SLIDE_W, availH / SLIDE_H));
    };
    calc();
    window.addEventListener("resize", calc);
    return () => window.removeEventListener("resize", calc);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === " ") next();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") prev();
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  // Swipe gestures — handled on the overlay div (not the iframe, which swallows touch events)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  };

  const scaledW = SLIDE_W * scale;
  const scaledH = SLIDE_H * scale;

  return (
    <div className="relative w-screen h-screen bg-[#020f1d] overflow-hidden">
      {/* Scaled slide area */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ bottom: NAV_H }}
      >
        {/* Fixed-size iframe scaled to fit */}
        <div
          style={{
            width: scaledW,
            height: scaledH,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <iframe
            key={current}
            src={`/slides/slide-${current + 1}.html`}
            title={SLIDES[current].title}
            style={{
              width: SLIDE_W,
              height: SLIDE_H,
              border: "none",
              transformOrigin: "top left",
              transform: `scale(${scale})`,
            }}
          />
          {/* Transparent overlay to capture swipe touches that the iframe would otherwise swallow */}
          <div
            className="absolute inset-0"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          />
        </div>
      </div>

      {/* Navigation bar */}
      <div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 sm:px-6 bg-black/75 backdrop-blur-md border-t border-white/10 z-50"
        style={{ height: NAV_H }}
      >
        {/* Prev */}
        <button
          onClick={prev}
          disabled={current === 0}
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-[#b8c4ff] border border-[#434655]/50 hover:border-[#b8c4ff]/50 active:bg-[#b8c4ff]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all touch-manipulation min-w-[44px] min-h-[44px] justify-center"
        >
          <span className="hidden sm:inline">←</span>
          <span className="sm:hidden">‹</span>
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Center: slide picker */}
        <div className="relative flex-1 flex justify-center">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-lg text-xs sm:text-sm font-mono text-[#c4c5d7] hover:text-[#b8c4ff] active:bg-white/5 transition-colors touch-manipulation min-h-[44px]"
          >
            <span className="text-[#7df4ff] font-bold">
              {String(current + 1).padStart(2, "0")}
            </span>
            <span className="text-[#434655]">/</span>
            <span>{SLIDES.length}</span>
            <span className="mx-1 text-[#434655] hidden sm:inline">·</span>
            <span className="tracking-wide uppercase text-xs hidden sm:inline">
              {SLIDES[current].title}
            </span>
            <span className="ml-1 text-[#434655] text-xs">▲</span>
          </button>

          {menuOpen && (
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#0e1d2b] border border-[#434655]/50 rounded-xl overflow-hidden shadow-2xl w-64 z-50">
              {SLIDES.map((slide, i) => (
                <button
                  key={slide.id}
                  onClick={() => { setCurrent(i); setMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-sm text-left transition-colors touch-manipulation ${
                    i === current
                      ? "bg-[#3c63ee]/20 text-[#b8c4ff]"
                      : "text-[#c4c5d7] hover:bg-white/5 active:bg-white/10"
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

        {/* Progress dots — hidden on small phones, visible on tablets+ */}
        <div className="hidden md:flex items-center gap-1.5 mr-4">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all touch-manipulation ${
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
          className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium text-[#b8c4ff] border border-[#434655]/50 hover:border-[#b8c4ff]/50 active:bg-[#b8c4ff]/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all touch-manipulation min-w-[44px] min-h-[44px] justify-center"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="hidden sm:inline">→</span>
          <span className="sm:hidden">›</span>
        </button>
      </div>
    </div>
  );
}
