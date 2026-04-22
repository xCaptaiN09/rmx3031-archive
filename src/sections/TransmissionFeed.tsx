import { Download, RefreshCw } from "lucide-react";
import { useRef, useCallback } from "react";
import gsap from "gsap";
import { useData } from "../hooks/use-data";

interface RomFile {
  name: string;
  version: string;
  android: string;
  size: string;
  url: string;
  date: string;
  changelog: string;
  color: string;
}

const colors = [
  "#8fbc8f",
  "#c8b89a",
  "#7dd3fc",
  "#fca5a5",
  "#d8b4fe",
  "#fbbf24",
];

function RomCard({ rom }: { rom: RomFile }) {
  const innerRef = useRef<HTMLDivElement>(null);

  const toggleCard = useCallback(() => {
    if (!innerRef.current) return;
    const isFlipped = innerRef.current.dataset.flipped === "true";

    if (isFlipped) {
      gsap.to(innerRef.current, {
        rotationX: 0,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      });
      innerRef.current.dataset.flipped = "false";
    } else {
      gsap.to(innerRef.current, {
        rotationX: 180,
        duration: 1,
        ease: "elastic.out(1, 0.5)",
      });
      innerRef.current.dataset.flipped = "true";
    }
  }, []);

  return (
    <div
      className="flip-card-wrapper h-72 sm:h-80 cursor-pointer"
      onClick={toggleCard}
    >
      <div
        ref={innerRef}
        className="flip-card-inner relative h-full w-full"
        data-flipped="false"
      >
        {/* Front */}
        <div className="flip-card-front absolute inset-0 flex flex-col justify-between rounded-3xl border border-sage/20 dark:border-white/10 bg-offwhite dark:bg-[#2a4a38]/60 dark:backdrop-blur-md dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] p-6 shadow-lg">
          <div>
            <div
              className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl overflow-hidden"
              style={{ backgroundColor: rom.color + "20" }}
            >
              {(() => {
                const name = rom.name.toLowerCase();
                const logo = name.includes("axion")
                  ? "/images/axion.png"
                  : name.includes("lineage")
                    ? "/images/lineage.png"
                    : name.includes("lunaris")
                      ? "/images/lunaris.png"
                      : name.includes("rising")
                        ? "/images/rising.png"
                        : name.includes("evolution")
                          ? "/images/evolution.png"
                          : null;
                return logo ? (
                  <img
                    src={logo}
                    alt={rom.name}
                    className="h-10 w-10 object-contain"
                  />
                ) : (
                  <span
                    className="text-lg font-bold"
                    style={{ color: rom.color }}
                  >
                    {rom.name.charAt(0)}
                  </span>
                );
              })()}
            </div>
            <h3 className="text-xl font-semibold text-forest dark:text-[#e8f0eb] dark:text-[#e8f0eb] line-clamp-2">
              {rom.name}
            </h3>
            <p className="mt-1 font-mono text-xs text-forest dark:text-[#e8f0eb] dark:text-[#e8f0eb]/50">
              {rom.version ? `v${rom.version}` : ""}{" "}
              {rom.android ? `— Android ${rom.android}` : ""}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between border-t border-sage/10 pt-3">
              <span className="font-mono text-xs text-forest dark:text-[#e8f0eb] dark:text-[#e8f0eb]/40">
                {rom.date}
              </span>
              <span className="font-mono text-sm font-medium text-forest dark:text-[#e8f0eb] dark:text-[#e8f0eb]">
                {rom.size}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-sage">
              <RefreshCw className="h-3.5 w-3.5" />
              <span className="text-xs font-medium">Tap for details</span>
            </div>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back absolute inset-0 flex flex-col rounded-3xl border border-sage/20 dark:border-sage/30 dark:border-sage/40 bg-forest dark:bg-[#0d2b20] p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-offwhite dark:text-[#e8f0eb] truncate">
              {rom.name}
            </h3>
            <RefreshCw className="h-4 w-4 text-sage" />
          </div>

          <div className="mt-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-sage">
              Changelog
            </p>
            <p className="text-xs leading-relaxed text-offwhite dark:text-[#e8f0eb]/70 whitespace-pre-wrap">
              {rom.changelog}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <button
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-sage py-2.5 text-sm font-semibold text-forest dark:text-[#e8f0eb] dark:text-[#e8f0eb] transition-colors duration-200 hover:bg-offwhite dark:bg-[#0d1f1a]"
              onClick={(e) => {
                e.stopPropagation();
                window.open(rom.url, "_blank");
              }}
            >
              <Download className="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransmissionFeed() {
  const { data, loading } = useData();

  if (loading || !data) return null;

  const roms: RomFile[] = (data.roms || [])
    .slice()
    .sort(
      (a: any, b: any) =>
        new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    .slice(0, 8)
    .map((rom: any, i: number) => ({
      ...rom,
      color: colors[i % colors.length],
    }));

  return (
    <section id="roms" className="relative z-10 bg-forest dark:bg-[#0f2a1f] px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-sage">
            Featured ROMs
          </span>
          <h2
            className="mt-3 text-offwhite dark:text-[#e8f0eb]"
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Latest Releases
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-offwhite dark:text-[#e8f0eb]/50">
            Popular custom ROMs ready for download. Tap any card to view
            changelog and download links.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {roms.map((rom, i) => (
            <RomCard key={i} rom={rom} />
          ))}
        </div>
      </div>
    </section>
  );
}
