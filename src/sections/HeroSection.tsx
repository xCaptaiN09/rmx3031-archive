import { useEffect, useState } from "react";
import { useData } from "../hooks/use-data";
import DotField from "../components/DotField";

function RevealLine({
  text,
  delay = 0,
  charClassName = "",
}: {
  text: string;
  delay?: number;
  charClassName?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setMounted(true);
      return;
    }
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <span className="block" aria-label={text}>
      {text.split("").map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={`inline-block transition-all duration-700 ease-out ${charClassName}`}
          style={{
            opacity: mounted ? 1 : 0,
            filter: mounted ? "blur(0px)" : "blur(10px)",
            transform: mounted ? "translateY(0)" : "translateY(0.12em)",
            transitionDelay: `${delay + i * 50}ms`,
          }}
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

export default function HeroSection() {
  const { data } = useData();

  const totalFiles = data
    ? Object.values(data)
        .filter(Array.isArray)
        .reduce((acc, curr) => acc + curr.length, 0)
    : 0;

  return (
    <section className="relative min-h-screen flex flex-col">
      <DotField />

      <div className="relative z-10 flex justify-between px-5 pt-20 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
        <span>( RMX3031 / DN2101 )</span>
        <span className="hidden sm:inline">( Community Archive )</span>
        <span>( Est. 2026 )</span>
      </div>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4">
        <div id="hero-copy" className="flex flex-col items-center text-center">
          <h1 className="font-grotesk font-bold leading-[0.9] tracking-[-0.04em] text-[clamp(3.5rem,13vw,12rem)]">
            <span className="block text-ink">
              <RevealLine text="OP6893" delay={150} />
            </span>
            <span className="block text-flame">
              <RevealLine
                text="ARCHIVE"
                delay={550}
                charClassName="glow-flame"
              />
            </span>
          </h1>
          <p className="mt-8 max-w-md font-mono text-[11px] leading-relaxed tracking-[0.15em] uppercase text-mute">
            Preserving custom ROMs, kernels & recoveries for the Realme X7 Max
            and OnePlus Nord 2 —{" "}
            <span className="font-serif italic normal-case tracking-normal text-ink text-sm">
              every file, forever.
            </span>
          </p>
          <div className="mt-10 font-mono text-[10px] uppercase tracking-[0.3em] text-dim animate-cue">
            Scroll ↓
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-line grid grid-cols-2 md:grid-cols-4 divide-x divide-line bg-coal/80 backdrop-blur-sm">
        <div className="px-5 py-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-dim mb-1">
            Device
          </div>
          <div className="font-mono text-[11px] text-ink">
            Realme X7 Max / OnePlus Nord 2
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-dim mb-1">
            Codename
          </div>
          <div className="font-mono text-[11px] text-ink">OP6893</div>
        </div>
        <div className="px-5 py-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-dim mb-1">
            Preserved
          </div>
          <div className="font-mono text-[11px] text-ink">
            {totalFiles} files
          </div>
        </div>
        <div className="px-5 py-4">
          <div className="font-mono text-[9px] uppercase tracking-[0.25em] text-dim mb-1">
            Status
          </div>
          <div className="font-mono text-[11px] text-ink flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-flame animate-pulse" />
            Active
          </div>
        </div>
      </div>
    </section>
  );
}
