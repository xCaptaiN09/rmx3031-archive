import { useEffect, useRef, useState } from "react";
import { useData } from "../hooks/use-data";
import DotMatrix from "../components/DotMatrix";

function AnimatedCounter({
  target,
  duration = 1800,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function AboutSection() {
  const { data } = useData();
  const [figHover, setFigHover] = useState(false);

  if (!data) return null;

  const totalFiles = Object.values(data)
    .filter(Array.isArray)
    .reduce((acc, curr) => acc + curr.length, 0);

  const categories = Object.keys(data).filter((k) =>
    Array.isArray((data as any)[k]),
  ).length;

  return (
    <section id="about" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-dim mb-10">
          <span className="text-flame">( 04 )</span> About
        </div>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <div>
            <h2 className="font-grotesk text-2xl md:text-4xl font-medium leading-snug text-ink tracking-tight">
              An open archive preserving custom software for the OP6893 family —
              because great hardware deserves to{" "}
              <span className="font-serif italic text-flame">outlive</span> its
              support window.
            </h2>
            <p className="mt-8 font-mono text-[11px] leading-relaxed tracking-[0.1em] text-mute uppercase">
              Maintained by{" "}
              <a
                href="https://github.com/xCaptaiN09"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink underline underline-offset-4 decoration-line hover:text-flame hover:decoration-flame transition-colors"
              >
                {data.maintainer}
              </a>{" "}
              · Hosted on Internet Archive · Rebuilt by Cloudflare in ~60s
            </p>

            <div className="mt-10 grid grid-cols-3 divide-x divide-line border border-line">
              <div className="p-4 md:p-6 text-center">
                <div className="font-grotesk text-2xl md:text-4xl font-bold text-ink">
                  <AnimatedCounter target={totalFiles} />
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-dim">
                  Files
                </div>
              </div>
              <div className="p-4 md:p-6 text-center">
                <div className="font-grotesk text-2xl md:text-4xl font-bold text-ink">
                  <AnimatedCounter target={categories} />
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-dim">
                  Categories
                </div>
              </div>
              <div className="p-4 md:p-6 text-center">
                <div className="font-grotesk text-2xl md:text-4xl font-bold text-flame">
                  ∞
                </div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.25em] text-dim">
                  Growing
                </div>
              </div>
            </div>
          </div>

          <div
            onMouseEnter={() => setFigHover(true)}
            onMouseLeave={() => setFigHover(false)}
          >
            <div className="border border-line p-3 transition-colors duration-700 hover:border-line-accent/30">
              <div className="relative aspect-[4/3] overflow-hidden bg-coal opacity-80">
                <DotMatrix text="MT6893" spacing={4} maxDot={1.5} />
                <div
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    figHover ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <DotMatrix
                    text="MT6893"
                    spacing={4}
                    maxDot={1.5}
                    color="255, 77, 0"
                    className="[filter:drop-shadow(0_0_14px_rgba(255,77,0,0.35))]"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-between mt-2 font-mono text-[9px] uppercase tracking-[0.25em] text-dim">
              <span>Fig. 01 — MT6893 · Cupida · Denniz</span>
              <span>Halftone / 1-bit</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
