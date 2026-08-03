import { useEffect, useRef } from "react";

interface DotMatrixProps {
  text: string;
  spacing?: number;
  maxDot?: number;
  color?: string;
  y?: number;
  maxHeight?: number;
  className?: string;
}

export default function DotMatrix({
  text,
  spacing = 5,
  maxDot = 1.6,
  color = "232, 230, 224",
  y = 0.5,
  maxHeight = 0.72,
  className = "",
}: DotMatrixProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let frame = 0;
    let cancelled = false;

    const render = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w === 0 || h === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      const src = document.createElement("canvas");
      src.width = w;
      src.height = h;
      const sctx = src.getContext("2d", { willReadFrequently: true });
      const ctx = canvas.getContext("2d");
      if (!sctx || !ctx) return;

      const base = 100;
      sctx.font = `700 ${base}px "Space Grotesk", sans-serif`;
      const mw = sctx.measureText(text).width || 1;
      const size = Math.min(((w * 0.88) / mw) * base, h * maxHeight);
      sctx.font = `700 ${Math.round(size)}px "Space Grotesk", sans-serif`;
      sctx.fillStyle = "#fff";
      sctx.textAlign = "center";
      sctx.textBaseline = "middle";
      sctx.fillText(text, w / 2, h * y);

      const pixels = sctx.getImageData(0, 0, w, h).data;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      for (let yPix = 0; yPix < h; yPix += spacing) {
        for (let x = 0; x < w; x += spacing) {
          const a = pixels[(yPix * w + x) * 4 + 3] / 255;
          if (a <= 0.1) continue;
          ctx.fillStyle = `rgba(${color}, ${(0.3 + a * 0.7).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(x, yPix, maxDot * a, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    render();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) render();
      });
    }
    const onResize = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(render);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
    };
  }, [text, spacing, maxDot, color, y, maxHeight]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
