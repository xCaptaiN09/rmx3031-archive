import { useEffect, useRef, useState } from "react";

export function TextHoverEffect({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(0);
  const [hovered, setHovered] = useState(false);
  const hoveredRef = useRef(false);
  const target = useRef({ x: 0, y: 0 });
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const measure = () => setW(wrapRef.current?.clientWidth ?? 0);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      setPos((p) => {
        const nx = p.x + (target.current.x - p.x) * 0.12;
        const ny = p.y + (target.current.y - p.y) * 0.12;
        if (
          !hoveredRef.current &&
          Math.abs(nx - p.x) < 0.5 &&
          Math.abs(ny - p.y) < 0.5
        )
          return p;
        return { x: nx, y: ny };
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const setHover = (v: boolean) => {
    hoveredRef.current = v;
    setHovered(v);
  };

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    target.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  if (w === 0) return <div ref={wrapRef} className="w-full" />;

  const fontSize = w * 0.17;
  const height = fontSize * 0.78;

  const textStyle: React.CSSProperties = {
    fontFamily: "'Space Grotesk', sans-serif",
    fontWeight: 700,
    fontSize,
    letterSpacing: "-0.02em",
    fill: "transparent",
  };

  return (
    <div ref={wrapRef} className="w-full">
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onMouseMove={onMove}
        className="block select-none"
      >
        <defs>
          <radialGradient
            id="footerReveal"
            gradientUnits="userSpaceOnUse"
            cx={pos.x}
            cy={pos.y}
            r={w * 0.18}
          >
            <stop offset="0%" stopColor="#fff" />
            <stop offset="100%" stopColor="#000" />
          </radialGradient>
          <mask id="footerMask">
            <rect width={w} height={height} fill="url(#footerReveal)" />
          </mask>
          <linearGradient id="footerFlame" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4d00" />
            <stop offset="50%" stopColor="#ff6b35" />
            <stop offset="100%" stopColor="#ff4d00" />
          </linearGradient>
        </defs>

        {/* Base hairline outline */}
        <text
          x="50%"
          y={fontSize * 0.02}
          textAnchor="middle"
          dominantBaseline="hanging"
          strokeWidth={1}
          stroke="rgba(232, 230, 224, 0.22)"
          style={{
            ...textStyle,
            opacity: hovered ? 0.35 : 1,
            transition: "opacity 0.3s ease",
          }}
        >
          {text}
        </text>

        {/* Cursor-following flame reveal */}
        <text
          x="50%"
          y={fontSize * 0.02}
          textAnchor="middle"
          dominantBaseline="hanging"
          strokeWidth={1}
          stroke="url(#footerFlame)"
          mask="url(#footerMask)"
          style={{
            ...textStyle,
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            filter: "drop-shadow(0 0 18px rgba(255, 77, 0, 0.35))",
          }}
        >
          {text}
        </text>
      </svg>
    </div>
  );
}
