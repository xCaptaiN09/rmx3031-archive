import { useState } from "react";
import { useData } from "../hooks/use-data";

const IconAndroid = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#27F3A9"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M6 12c0-3 1.5-6 6-6s6 3 6 6" />
    <line x1="9" y1="3" x2="9" y2="6" />
    <line x1="15" y1="3" x2="15" y2="6" />
    <circle cx="9" cy="9" r="1" fill="#27F3A9" stroke="none" />
    <circle cx="15" cy="9" r="1" fill="#27F3A9" stroke="none" />
    <path d="M8 12h8l-1 4H9l-1-4z" />
    <line x1="7" y1="14" x2="7" y2="10" />
    <line x1="17" y1="14" x2="17" y2="10" />
    <line x1="9" y1="16" x2="9" y2="19" />
    <line x1="15" y1="16" x2="15" y2="19" />
  </svg>
);

const IconKernel = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#27F3A9"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="8" y="8" width="8" height="8" rx="1" />
    <line x1="8" y1="12" x2="16" y2="12" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="2" x2="8" y2="4" />
    <line x1="16" y1="2" x2="16" y2="4" />
    <line x1="8" y1="20" x2="8" y2="22" />
    <line x1="16" y1="20" x2="16" y2="22" />
    <line x1="2" y1="8" x2="4" y2="8" />
    <line x1="2" y1="16" x2="4" y2="16" />
    <line x1="20" y1="8" x2="22" y2="8" />
    <line x1="20" y1="16" x2="22" y2="16" />
  </svg>
);

const IconRecovery = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#27F3A9"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    <polyline points="21 3 21 9 15 9" />
  </svg>
);

const CATEGORIES = [
  {
    key: "roms",
    label: "ROMs",
    desc: "Custom firmware builds",
    Icon: IconAndroid,
  },
  {
    key: "kernels",
    label: "Kernels",
    desc: "Performance & battery",
    Icon: IconKernel,
  },
  {
    key: "recovery",
    label: "Recoveries",
    desc: "TWRP & more",
    Icon: IconRecovery,
  },
];

export default function BentoBrowser() {
  const { data } = useData();
  const [tappedCard, setTappedCard] = useState<string | null>(null);

  if (!data) return null;

  return (
    <section id="browse" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up-once">
          <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-[#27F3A9]/60 mb-4 text-mono">
            Categories
          </span>
          <h2 className="heading-section text-3xl md:text-4xl text-white tracking-tight">
            Browse by category
          </h2>
          <p className="mt-3 text-[15px] text-white/30 max-w-md mx-auto">
            Explore our curated collection of custom software for the RMX3031
          </p>
        </div>

        {/* Category grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {CATEGORIES.map(({ key, label, desc, Icon }, idx) => {
            const count = data[key]?.length || 0;
            const isActive = tappedCard === key;

            return (
              <div
                key={key}
                className={`cat-card group relative rounded-2xl p-8 flex flex-col items-center text-center cursor-default overflow-hidden transition-all duration-300 animate-fade-up-once`}
                style={{
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                  border: "1px solid rgba(255,255,255,0.04)",
                  animationDelay: `${idx * 0.1}s`,
                }}
                onClick={() => setTappedCard(isActive ? null : key)}
              >
                {/* ── Animated SVG border — draws anti-clockwise ── */}
                <svg
                  className={`cat-border-svg absolute inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-300 ${
                    isActive ? "opacity-100 is-active" : "opacity-0"
                  }`}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ transform: "scaleX(-1)" }}
                >
                  <rect
                    x="0.5"
                    y="0.5"
                    width="99"
                    height="99"
                    rx="5"
                    ry="5"
                    fill="none"
                    stroke="#27F3A9"
                    strokeWidth="0.4"
                    strokeLinecap="round"
                    strokeDasharray="400"
                    strokeDashoffset="400"
                    className="cat-border-rect"
                  />
                </svg>

                {/* Hover background shift */}
                <div className="absolute inset-0 rounded-2xl bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Subtle corner glow */}
                <div
                  className={`absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-[#27F3A9]/[0.06] rounded-full blur-3xl transition-opacity duration-500 ${
                    isActive
                      ? "opacity-100"
                      : "opacity-0 group-hover:opacity-100"
                  }`}
                />

                {/* Icon container */}
                <div className="category-icon-wrap mb-5 relative z-10">
                  <Icon />
                </div>

                {/* Text content */}
                <h3 className="heading-section text-lg text-white mb-1.5 relative z-10">
                  {label}
                </h3>
                <p className="text-[13px] text-white/30 mb-4 leading-relaxed relative z-10">
                  {desc}
                </p>

                {/* File count badge */}
                <span className="text-mono text-[11px] font-medium text-[#27F3A9] bg-[#27F3A9]/8 border border-[#27F3A9]/15 px-3 py-1 rounded-full relative z-10">
                  {count} files
                </span>

                {/* ── Clickable Arrow / CTA ── */}
                <a
                  href="#full-archive"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    document
                      .getElementById("full-archive")
                      ?.scrollIntoView({ behavior: "smooth" });
                    window.dispatchEvent(
                      new CustomEvent("setFullArchiveTab", { detail: key }),
                    );
                  }}
                  className={`mt-4 flex items-center justify-center w-10 h-10 rounded-full border text-[#27F3A9] transition-all duration-300 relative z-30 hover:bg-[#27F3A9]/10 hover:border-[#27F3A9]/30 hover:scale-110 active:scale-95 ${
                    isActive
                      ? "opacity-100 translate-y-0 border-[#27F3A9]/30"
                      : "opacity-50 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 border-white/10"
                  }`}
                  title={`Browse ${label}`}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </a>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes draw-border-ccw {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }

        .cat-card:hover .cat-border-svg {
          opacity: 1 !important;
        }
        .cat-card:hover .cat-border-rect {
          animation: draw-border-ccw 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .cat-border-svg.is-active .cat-border-rect {
          animation: draw-border-ccw 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </section>
  );
}
