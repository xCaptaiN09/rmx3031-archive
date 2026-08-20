import { useEffect, useRef, useState } from "react";

export function TextHoverEffect({ text }: { text: string }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [maskPos, setMaskPos] = useState({ cx: 50, cy: 50 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const cx = ((e.clientX - rect.left) / rect.width) * 100;
    const cy = ((e.clientY - rect.top) / rect.height) * 100;
    setMaskPos({ cx, cy });
  };

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none cursor-pointer"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff4d00" />
          <stop offset="50%" stopColor="#ff6b35" />
          <stop offset="100%" stopColor="#ff4d00" />
        </linearGradient>

        <radialGradient
          id="revealMask"
          cx={`${maskPos.cx}%`}
          cy={`${maskPos.cy}%`}
          r="30%"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>

        <mask id="textMask">
          <rect width="100%" height="100%" fill="url(#revealMask)" />
        </mask>
      </defs>

      {/* Base outline - always visible */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1"
        className="fill-transparent font-grotesk font-bold"
        style={{
          stroke: "rgba(232, 230, 224, 0.22)",
          fontSize: "80px",
          opacity: hovered ? 0.3 : 1,
          transition: "opacity 0.3s ease",
        }}
      >
        {text}
      </text>

      {/* Animated stroke draw on mount */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1"
        className="fill-transparent font-grotesk font-bold"
        style={{
          stroke: "rgba(232, 230, 224, 0.22)",
          fontSize: "80px",
          strokeDasharray: mounted ? 0 : 1000,
          strokeDashoffset: mounted ? 0 : 1000,
          transition:
            "stroke-dasharray 4s ease-in-out, stroke-dashoffset 4s ease-in-out",
        }}
      >
        {text}
      </text>

      {/* Gradient reveal on hover */}
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="1"
        stroke="url(#textGradient)"
        mask="url(#textMask)"
        className="fill-transparent font-grotesk font-bold"
        style={{
          fontSize: "80px",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        {text}
      </text>
    </svg>
  );
}
