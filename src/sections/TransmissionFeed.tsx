import { useEffect, useRef, useState } from "react";
import { useData } from "../hooks/use-data";
import type { Entry } from "../hooks/use-data";
import {
  formatArchiveDate,
  formatVersion,
  normalizeSearch,
} from "../lib/archive";

const LOGO_MAP: Record<string, string> = {
  axion: "/images/axion.png",
  lineage: "/images/lineage.png",
  lunaris: "/images/lunaris.png",
  rising: "/images/rising.png",
  evolution: "/images/evolution.png",
  pixelos: "/images/pixelos.png",
  oxygenos: "/images/oxygenos.png",
  coloros: "/images/coloros.png",
  infinityx: "/images/InfinityX.png",
};

const getLogoPath = (rom: Entry) => {
  const lower = normalizeSearch(rom.name);
  if (
    lower.includes("coloros17") ||
    (lower.includes("coloros") && /^v?17$/i.test(rom.version?.trim() || ""))
  ) {
    return "/images/coloros17.svg";
  }
  for (const [key, path] of Object.entries(LOGO_MAP)) {
    if (lower.includes(key)) return path;
  }
  return null;
};

function RomCell({ rom }: { rom: Entry }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const logoPath = getLogoPath(rom);

  useEffect(
    () => () => {
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    },
    [],
  );

  const handleCopy = async () => {
    setCopyError(false);
    try {
      await navigator.clipboard.writeText(rom.url);
      setCopied(true);
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
      setCopyError(true);
    }
  };

  return (
    <div className="bg-coal p-6 md:p-8 hover:bg-soot transition-colors group">
      <div className="flex items-start justify-between">
        {logoPath ? (
          <img
            src={logoPath}
            alt={rom.name}
            width={40}
            height={40}
            loading="lazy"
            className="w-10 h-10 object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-line bg-soot"
          />
        ) : (
          <span className="font-mono text-[10px] text-dim border border-line px-2 py-1">
            IMG
          </span>
        )}
        {rom.version && (
          <span className="font-mono text-[10px] text-flame">
            {formatVersion(rom.version)}
          </span>
        )}
      </div>

      <h3 className="mt-5 font-grotesk text-lg md:text-xl font-medium text-ink tracking-tight leading-tight">
        {rom.name}
      </h3>

      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[10px] uppercase tracking-[0.15em] text-mute">
        {rom.android && <span>A{rom.android}</span>}
        <time dateTime={rom.date}>{formatArchiveDate(rom.date)}</time>
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
          type="button"
          onClick={handleCopy}
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute hover:text-ink transition-colors"
        >
          {copied ? "Copied ✓" : "Copy link"}
        </button>
      </div>
      {copyError && (
        <p role="status" className="mt-3 font-mono text-[11px] text-flame">
          Could not copy. Use the download link to copy its address.
        </p>
      )}
    </div>
  );
}

export default function LatestSection() {
  const { data } = useData();
  if (!data || !data.roms) return null;

  const latestROMs = [...data.roms]
    .sort((a, b) => b.date.localeCompare(a.date))
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
            <RomCell key={`${rom.url}:${idx}`} rom={rom} />
          ))}
        </div>
      </div>
    </section>
  );
}
