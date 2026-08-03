import { useEffect, useRef, useState } from "react";
import Navbar from "../sections/Navbar";
import HeroSection from "../sections/HeroSection";
import IndexSection from "../sections/BentoBrowser";
import LatestSection from "../sections/TransmissionFeed";
import ArchiveSection from "../sections/FileBrowserSection";
import AboutSection from "../sections/CommunitySection";
import Footer from "../sections/Footer";

const MARQUEE_ITEMS = [
  "CUSTOM ROMS",
  "KERNELS",
  "RECOVERIES",
  "FIRMWARE",
  "OTA",
  "MODULES",
  "SP TOOL",
  "ALWAYS PRESERVED",
];

function Marquee() {
  const row = (
    <>
      {MARQUEE_ITEMS.map((item) => (
        <span key={item} className="flex items-center shrink-0">
          <span className="px-6 text-[11px] uppercase tracking-[0.35em] text-mute">
            {item}
          </span>
          <span className="text-flame text-[10px]">✦</span>
        </span>
      ))}
    </>
  );

  return (
    <div className="border-y border-line bg-coal overflow-hidden py-3">
      <div className="flex w-max animate-marquee">
        {row}
        {row}
      </div>
    </div>
  );
}

function Reveal({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      {children}
    </div>
  );
}

function Crosshairs() {
  const cls =
    "hidden md:block fixed z-10 font-mono text-dim text-sm pointer-events-none select-none";
  return (
    <>
      <span className={`${cls} top-16 left-5`}>+</span>
      <span className={`${cls} top-16 right-5`}>+</span>
      <span className={`${cls} bottom-5 left-5`}>+</span>
      <span className={`${cls} bottom-5 right-5`}>+</span>
    </>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-coal text-ink relative">
      <div className="noise-overlay" />
      <Crosshairs />
      <Navbar />
      <main>
        <HeroSection />
        <Marquee />
        <Reveal>
          <IndexSection />
        </Reveal>
        <Reveal>
          <LatestSection />
        </Reveal>
        <Reveal>
          <ArchiveSection />
        </Reveal>
        <Reveal>
          <AboutSection />
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
