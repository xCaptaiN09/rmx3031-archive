import { useState, useEffect } from "react";
import { useData } from "../hooks/use-data";

const LOGO_MAP: Record<string, string> = {
  axion: "/images/axion.png",
  lineage: "/images/lineage.png",
  lunaris: "/images/lunaris.png",
  rising: "/images/rising.png",
  evolution: "/images/evolution.png",
};

const getLogoPath = (romName: string) => {
  const lower = romName.toLowerCase();
  for (const [key, path] of Object.entries(LOGO_MAP)) {
    if (lower.includes(key)) return path;
  }
  return null;
};

const CopyIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface FlipCardProps {
  rom: {
    name: string;
    version?: string;
    android?: string;
    date: string;
    url: string;
    changelog?: string;
  };
  index: number;
  isFlipped: boolean;
  onFlip: () => void;
}

const FlipCard = ({ rom, index, isFlipped, onFlip }: FlipCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(rom.url);
    } catch {
      const input = document.createElement("input");
      input.value = rom.url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const logoPath = getLogoPath(rom.name);

  return (
    <div
      className="rom-card group cursor-pointer animate-fade-up-once"
      style={{
        perspective: "800px",
        height: "304px",
        animationDelay: `${index * 0.08}s`,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onFlip();
      }}
    >
      <div className="relative w-full h-full">
        {/* ── Animated border ring ── */}
        <svg
          className={`rom-border-svg absolute -inset-[1px] w-[calc(100%+2px)] h-[calc(100%+2px)] pointer-events-none z-20 rounded-2xl overflow-visible transition-opacity duration-300 ${
            isFlipped ? "opacity-100 is-active" : "opacity-0"
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
            rx="7"
            ry="7"
            fill="none"
            stroke="#27F3A9"
            strokeWidth="0.4"
            strokeLinecap="round"
            strokeDasharray="400"
            strokeDashoffset="400"
            className="rom-border-rect"
          />
        </svg>

        {/* Flip container */}
        <div
          className={`relative w-full h-full [transform-style:preserve-3d] transition-transform ${
            isFlipped
              ? "[transform:rotateY(180deg)]"
              : "group-hover:[transform:rotateY(180deg)]"
          }`}
          style={{
            transitionDuration: "600ms",
            transitionTimingFunction: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {/* ── FRONT ── */}
          <div
            className={`absolute inset-0 rounded-2xl p-6 flex flex-col items-center justify-center [backface-visibility:hidden] transition-opacity duration-300 ${
              isFlipped
                ? "opacity-0 pointer-events-none"
                : "opacity-100 group-hover:opacity-0"
            }`}
            style={{
              background:
                "linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.008) 100%)",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            {logoPath && (
              <div className="mb-4 relative">
                <div className="absolute inset-0 bg-[#27F3A9]/[0.06] blur-2xl rounded-full scale-[2] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div
                  className="relative h-12 w-12 overflow-hidden"
                  style={{ borderRadius: "12px" }}
                >
                  <img
                    src={logoPath}
                    alt={rom.name}
                    className="h-full w-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              </div>
            )}

            <h3
              className="text-white font-medium text-sm text-center truncate w-full mb-1.5 heading-section"
              title={rom.name}
            >
              {rom.name}
            </h3>

            {rom.version && (
              <span className="text-mono text-[10px] font-medium text-[#27F3A9]/70 bg-[#27F3A9]/5 border border-[#27F3A9]/10 px-2.5 py-0.5 rounded-full mb-1.5">
                {rom.version}
              </span>
            )}

            {rom.android && (
              <span className="text-mono text-[10px] text-white/25 mb-1">
                Android {rom.android}
              </span>
            )}

            <p className="text-[11px] text-white/20 tracking-wide text-mono">
              {rom.date}
            </p>
          </div>

          {/* ── BACK ── */}
          <div
            className={`absolute inset-0 [transform:rotateY(180deg)] [backface-visibility:hidden] rounded-2xl p-5 flex flex-col transition-opacity duration-300 ${
              isFlipped
                ? "opacity-100 pointer-events-auto"
                : "opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto"
            }`}
            style={{
              background:
                "linear-gradient(145deg, rgba(10,20,14,0.95) 0%, rgba(5,10,7,0.98) 100%)",
              border: "1px solid rgba(39,243,169,0.12)",
              boxShadow:
                "0 0 30px rgba(39,243,169,0.04), inset 0 1px 0 rgba(255,255,255,0.03)",
            }}
          >
            <h3
              className="text-white font-medium text-sm mb-1 truncate heading-section"
              title={rom.name}
            >
              {rom.name}
            </h3>

            <div className="flex items-center gap-2 mb-2">
              {rom.version && (
                <span className="text-mono text-[10px] text-[#27F3A9]/60">
                  {rom.version}
                </span>
              )}
              {rom.android && (
                <span className="text-mono text-[10px] text-white/25">
                  · Android {rom.android}
                </span>
              )}
            </div>

            {rom.changelog ? (
              <div className="flex-1 overflow-y-auto text-white/35 text-xs leading-relaxed whitespace-pre-line mb-3 pr-1 custom-scrollbar">
                {rom.changelog}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/15 text-xs">
                No changelog available
              </div>
            )}

            <div className="flex items-center gap-2 mt-auto">
              <a
                href={rom.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex-1 text-center px-4 py-2.5 border border-[#27F3A9]/20 text-[#27F3A9] text-xs font-medium transition-all duration-300 hover:bg-[#27F3A9]/8 hover:border-[#27F3A9]/35 hover:shadow-[0_0_16px_rgba(39,243,169,0.12)]"
                style={{ borderRadius: "10px" }}
              >
                Download
              </a>
              <button
                onClick={handleCopy}
                className="flex items-center justify-center px-4 py-2.5 border border-white/[0.06] text-white/25 text-xs transition-all duration-200 hover:border-[#27F3A9]/25 hover:text-[#27F3A9] hover:bg-[#27F3A9]/5"
                style={{ borderRadius: "10px" }}
                title={copied ? "Copied!" : "Copy link"}
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function TransmissionFeed() {
  const { data } = useData();
  const [flippedCard, setFlippedCard] = useState<number | null>(null);

  // Un-flip when clicking outside any card
  useEffect(() => {
    const handler = (e: Event) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".rom-card")) {
        setFlippedCard(null);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  if (!data || !data.roms) return null;

  const latestROMs = [...data.roms]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <section id="featured" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up-once">
          <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-[#27F3A9]/60 mb-4 text-mono">
            Featured
          </span>
          <h2 className="heading-section text-3xl md:text-4xl text-white tracking-tight">
            Latest ROMs
          </h2>
          <p className="mt-3 text-[15px] text-white/30 max-w-md mx-auto">
            The most recent custom firmware builds, updated regularly
          </p>
        </div>

        {/* ROM grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {latestROMs.map((rom, idx) => (
            <FlipCard
              key={idx}
              rom={rom}
              index={idx}
              isFlipped={flippedCard === idx}
              onFlip={() => setFlippedCard(flippedCard === idx ? null : idx)}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes draw-rom-border {
          from { stroke-dashoffset: 400; }
          to   { stroke-dashoffset: 0; }
        }

        .rom-card:hover .rom-border-svg {
          opacity: 1 !important;
        }
        .rom-card:hover .rom-border-rect {
          animation: draw-rom-border 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .rom-border-svg.is-active .rom-border-rect {
          animation: draw-rom-border 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </section>
  );
}
