import { useEffect, useRef } from "react";

const SPACING = 28;
const RADIUS = 240;
const PULL = 20;
const BASE_R = 1;
const MAX_R = 2.4;
const BASE_ALPHA = 0.09;

interface Dot {
  hx: number;
  hy: number;
  x: number;
  y: number;
}

export default function DotField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasPointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const interactive = !reduce && hasPointer;

    let w = 0;
    let h = 0;
    let dpr = 1;
    let raf = 0;
    let inView = true;
    let active = false;
    let energy = 0;
    let dots: Dot[] = [];
    const mouse = { x: -9999, y: -9999 };
    const ease = { x: -9999, y: -9999 };

    const build = () => {
      dots = [];
      for (let y = SPACING / 2; y < h; y += SPACING) {
        for (let x = SPACING / 2; x < w; x += SPACING) {
          dots.push({ hx: x, hy: y, x, y });
        }
      }
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      w = parent.clientWidth;
      h = parent.clientHeight;
      if (w === 0 || h === 0) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      build();
      if (!interactive) drawStatic();
    };

    const drawStatic = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = `rgba(232, 230, 224, ${BASE_ALPHA})`;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.hx, d.hy, BASE_R, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!inView || w === 0) return;

      ease.x += (mouse.x - ease.x) * 0.02;
      ease.y += (mouse.y - ease.y) * 0.02;
      const scrollFade = Math.max(0, 1 - window.scrollY / (h * 0.5));
      energy += ((active ? scrollFade : 0) - energy) * 0.03;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      if (energy > 0.02) {
        const glow = ctx.createRadialGradient(ease.x, ease.y, 0, ease.x, ease.y, RADIUS * 1.15);
        glow.addColorStop(0, `rgba(255, 77, 0, ${0.06 * energy})`);
        glow.addColorStop(1, "rgba(255, 77, 0, 0)");
        ctx.fillStyle = glow;
        ctx.fillRect(ease.x - RADIUS * 1.2, ease.y - RADIUS * 1.2, RADIUS * 2.4, RADIUS * 2.4);
      }

      const t0 = now * 0.001;
      for (const d of dots) {
        const ax = d.hx + Math.sin(t0 * 0.25 + d.hx * 0.013 + d.hy * 0.007) * 1.4;
        const ay = d.hy + Math.cos(t0 * 0.21 + d.hy * 0.011) * 1.4;

        let tx = ax;
        let ty = ay;
        let t = 0;

        if (energy > 0.02) {
          const dx = ease.x - ax;
          const dy = ease.y - ay;
          const dist = Math.hypot(dx, dy);
          if (dist < RADIUS && dist > 0.001) {
            const raw = 1 - dist / RADIUS;
            t = raw * raw * energy;
            tx += (dx / dist) * PULL * t;
            ty += (dy / dist) * PULL * t;
          }
        }

        d.x += (tx - d.x) * 0.06;
        d.y += (ty - d.y) * 0.06;

        if (t > 0.01) {
          const r = Math.round(232 + (255 - 232) * t);
          const g = Math.round(230 + (77 - 230) * t);
          const b = Math.round(224 + (0 - 224) * t);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${(BASE_ALPHA + t * 0.9).toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, BASE_R + (MAX_R - BASE_R) * t, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(232, 230, 224, ${BASE_ALPHA})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, BASE_R, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      active = true;
    };
    const onLeave = () => {
      active = false;
    };

    resize();
    window.addEventListener("resize", resize);
    if (interactive) {
      window.addEventListener("mousemove", onMove, { passive: true });
      document.documentElement.addEventListener("mouseleave", onLeave);
      raf = requestAnimationFrame(frame);
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
    });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      io.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="absolute inset-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
