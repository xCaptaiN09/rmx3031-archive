import { useState } from "react";
import { useData } from "../hooks/use-data";

const LOGO_MAP: Record<string, string> = {
  axion: "/images/axion.png",
  lineage: "/images/lineage.png",
  lunaris: "/images/lunaris.png",
  rising: "/images/rising.png",
  evolution: "/images/evolution.png",
  pixelos: "/images/pixelos.png",
  oxygenos: "/images/oxygenos.png",
  coloros: "/images/coloros.png",
};

const getLogoPath = (romName: string) => {
  const lower = romName.toLowerCase();
  for (const [key, path] of Object.entries(LOGO_MAP)) {
    if (lower.includes(key)) return path;
  }
  return null;
};

function RomCell({ rom }: { rom: any }) {
  const [copied, setCopied] = useState(false);
  const logoPath = getLogoPath(rom.name);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rom.url);
    } catch {
      const input = document.createElement("input");
      input.value = rom.url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-coal p-6 md:p-8 hover:bg-soot transition-colors group">
      <div className="flex items-start justify-between">
        {logoPath ? (
          <img
            src={logoPath}
            alt={rom.name}
            className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-line bg-soot"
          />
        ) : (
          <span className="font-mono text-[10px] text-dim border border-line px-2 py-1">
            IMG
          </span>
        )}
        {rom.version && (
          <span className="font-mono text-[10px] text-flame">
            v{rom.version}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-grotesk text-lg md:text-xl font-medium text-ink tracking-tight leading-tight">
        {rom.name}
      </h3>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.15em] text-dim">
        {rom.android && <span>A{rom.android}</span>}
        <span>{rom.date}</span>
        {rom.size && <span>{rom.size}</span>}
      </div>

      <div className="mt-6 flex items-center gap-6">
        <a
          href={rom.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink underline underline-offset-4 decoration-line hover:text-flame hover:decoration-flame transition-colors"
        >
          Download ↗
        </a>
        <button
          onClick={handleCopy}
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-dim hover:text-ink transition-colors"
        >
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>
    </div>
  );
}

export default function LatestSection() {
  const { data } = useData();
  if (!data || !data.roms) return null;

  const latestROMs = [...data.roms]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 8);

  return (
    <section id="latest" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-dim mb-10">
          <span>
            <span className="text-flame">( 02 )</span> Latest
          </span>
          <span>Last 8 builds</span>
        </div>

        <div className="grid md:grid-cols-2 gap-px bg-line border border-line">
          {latestROMs.map((rom, idx) => (
            <RomCell key={idx} rom={rom} />
          ))}
        </div>
      </div>
    </section>
  );
}
