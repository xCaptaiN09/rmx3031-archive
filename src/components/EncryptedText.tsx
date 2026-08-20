import { useEffect, useRef, useState } from "react";

interface EncryptedTextProps {
  text: string;
  revealDelayMs?: number;
  flipDelayMs?: number;
  charset?: string;
  className?: string;
  encryptedClassName?: string;
  revealedClassName?: string;
}

const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-={}[];:,.<>/?";

function randomChar(charset: string): string {
  return charset[Math.floor(Math.random() * charset.length)];
}

export function EncryptedText({
  text,
  revealDelayMs = 40,
  flipDelayMs = 60,
  charset = DEFAULT_CHARSET,
  className,
  encryptedClassName,
  revealedClassName,
}: EncryptedTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [inView, setInView] = useState(false);
  const [revealCount, setRevealCount] = useState(0);
  const [scramble, setScramble] = useState<string[]>([]);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealCount(text.length);
      setScramble(text.split(""));
      return;
    }

    const initial = text
      .split("")
      .map((char) => char === " " ? " " : randomChar(charset));
    setScramble(initial);
    setRevealCount(0);

    const start = performance.now();
    let lastFlip = start;

    const tick = (now: number) => {
      const elapsed = now - start;
      const revealed = Math.min(
        text.length,
        Math.floor(elapsed / revealDelayMs),
      );
      setRevealCount(revealed);

      if (now - lastFlip >= flipDelayMs && revealed < text.length) {
        setScramble((prev) =>
          prev.map((ch, i) =>
            i < revealed
              ? text[i]
              : text[i] === " "
                ? " "
                : randomChar(charset),
          ),
        );
        lastFlip = now;
      }

      if (revealed < text.length) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, text, revealDelayMs, flipDelayMs, charset]);

  return (
    <span ref={ref} className={className} aria-label={text} role="text">
      {text.split("").map((char, i) => {
        const revealed = i < revealCount;
        const display = revealed ? char : scramble[i] || " ";
        return (
          <span
            key={i}
            className={revealed ? revealedClassName : encryptedClassName}
          >
            {display}
          </span>
        );
      })}
    </span>
  );
}
