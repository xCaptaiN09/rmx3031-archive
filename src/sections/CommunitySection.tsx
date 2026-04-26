import { useEffect, useRef, useState } from "react";
import { useData } from "../hooks/use-data";

// Smooth counting animation on scroll
function AnimatedCounter({
  target,
  duration = 2000,
}: {
  target: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  return <div ref={ref}>{count}</div>;
}

export default function CommunitySection() {
  const { data } = useData();
  if (!data) return null;

  const totalFiles = Object.values(data)
    .filter(Array.isArray)
    .reduce((acc, curr) => acc + curr.length, 0);

  const tabsCount = Object.keys(data).filter((k) =>
    Array.isArray(data[k]),
  ).length;

  return (
    <section id="contribute" className="py-32 relative bg-black">
      <div className="max-w-5xl mx-auto px-6 text-center">
        {/* Muted uppercase label - matching hero's #555 aesthetic */}
        <span
          className="inline-block font-medium tracking-[0.2em] uppercase mb-12"
          style={{ fontSize: 11, color: "#555" }}
        >
          Community
        </span>

        {/* Main Stats - Apple style, huge weight-300 numbers, Hero silver gradient */}
        <div className="flex items-baseline justify-center gap-12 sm:gap-20 mb-16">
          <div className="flex flex-col items-center">
            <h3
              className="font-light tracking-[-0.01em] leading-[1.1] mb-3"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                fontFamily:
                  "'YDYoonche L', 'YDYoonche M', 'Space Grotesk', sans-serif",
                background:
                  "linear-gradient(90deg, #333333 0%, #878787 50%, #333333 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <AnimatedCounter target={totalFiles} />
            </h3>
            <span
              className="text-[11px] tracking-[0.15em] uppercase"
              style={{ color: "#555" }}
            >
              Files Preserved
            </span>
          </div>

          <div className="flex flex-col items-center">
            <h3
              className="font-light tracking-[-0.01em] leading-[1.1] mb-3"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                fontFamily:
                  "'YDYoonche L', 'YDYoonche M', 'Space Grotesk', sans-serif",
                background:
                  "linear-gradient(90deg, #333333 0%, #878787 50%, #333333 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              <AnimatedCounter target={tabsCount} />
            </h3>
            <span
              className="text-[11px] tracking-[0.15em] uppercase"
              style={{ color: "#555" }}
            >
              Categories
            </span>
          </div>
        </div>

        {/* Always Growing - Infinity symbol with the exact Hero green glow */}
        <div className="mb-20">
          <div
            className="font-light tracking-[-0.01em] leading-[1.1] inline-block mb-3"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontFamily:
                "'YDYoonche L', 'YDYoonche M', 'Space Grotesk', sans-serif",
              color: "#27F3A9",
              textShadow: "0px 6px 24px rgba(39, 243, 169, 0.15)",
            }}
          >
            ∞
          </div>
          <br />
          <span
            className="text-[11px] tracking-[0.15em] uppercase"
            style={{ color: "#555" }}
          >
            Always Growing
          </span>
        </div>

        {/* Subtext / Attribution - matching the Hero subheading style exactly */}
        <p
          style={{
            fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
            color: "#888",
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          Maintained by <span style={{ color: "#fff" }}>{data.maintainer}</span>{" "}
          · Open-source on GitHub
        </p>
      </div>
    </section>
  );
}
