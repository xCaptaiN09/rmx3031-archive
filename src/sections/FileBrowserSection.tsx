import { useEffect, useRef, useState } from "react";
import { useData } from "../hooks/use-data";

const TABS = [
  { key: "roms", label: "ROMs" },
  { key: "kernels", label: "Kernels" },
  { key: "modules", label: "Modules" },
  { key: "ota", label: "X7 Max" },
  { key: "ota_cn", label: "GT Neo" },
  { key: "ota_cnf", label: "GT Neo Flash" },
  { key: "firmware", label: "Firmware" },
  { key: "sptool", label: "SP Tool" },
  { key: "recovery", label: "Recovery" },
  { key: "other", label: "Other" },
];

const normalize = (s: string) => s.toLowerCase().replace(/[\s._-]/g, "");

interface FileRowProps {
  file: any;
  num: number;
  openKey: string;
  isOpen: boolean;
  onToggle: () => void;
  onCopy: () => void;
  copied: boolean;
  tabLabel?: string;
}

function FileRow({
  file,
  num,
  openKey,
  isOpen,
  onToggle,
  onCopy,
  copied,
  tabLabel,
}: FileRowProps) {
  void openKey;
  return (
    <div className="border-b border-line">
      <button
        onClick={onToggle}
        className="w-full grid grid-cols-[2.5rem_1fr_2rem] md:grid-cols-[3rem_1fr_5rem_7rem_5rem_2rem] items-center gap-3 px-2 py-4 text-left hover:bg-soot transition-colors"
      >
        <span className="font-mono text-[10px] text-dim">
          {String(num).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span className="flex items-center gap-2 min-w-0">
            {tabLabel && (
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-flame border border-flame/20 px-1.5 py-0.5">
                {tabLabel}
              </span>
            )}
            <span className="font-grotesk text-sm font-medium text-ink truncate">
              {file.name}
            </span>
          </span>
          <span className="md:hidden block mt-0.5 font-mono text-[10px] text-dim">
            {[
              file.version && `v${file.version}`,
              file.android && `A${file.android}`,
              file.date,
              file.size,
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </span>
        {file.android && (
          <span className="hidden md:block font-mono text-[10px] text-mute">
            {file.android}
          </span>
        )}
        <span className="hidden md:block font-mono text-[10px] text-dim">
          {file.date}
        </span>
        <span className="hidden md:block font-mono text-[10px] text-dim">
          {file.size}
        </span>
        <span
          className={`font-mono text-base text-dim justify-self-end transition-transform duration-300 ${
            isOpen ? "rotate-45 text-flame" : ""
          }`}
        >
          +
        </span>
      </button>

      {isOpen && (
        <div className="px-2 pb-6 md:pl-[3.5rem]">
          {file.changelog && (
            <div className="border-l border-flame/40 pl-4 py-1 max-h-48 overflow-y-auto custom-scrollbar">
              <p className="font-mono text-[11px] leading-relaxed text-mute whitespace-pre-line">
                {file.changelog}
              </p>
            </div>
          )}
          <div className="flex flex-wrap gap-3 mt-4">
            <a
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.25em] border border-line px-4 py-2 text-ink hover:bg-ink hover:text-coal transition-colors"
            >
              Download ↗
            </a>
            <button
              onClick={onCopy}
              className="font-mono text-[10px] uppercase tracking-[0.25em] border border-line px-4 py-2 text-mute hover:text-ink hover:border-ink transition-colors"
            >
              {copied ? "Copied ✓" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ArchiveSection() {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState("roms");
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";
      if (e.key === "/" && !typing) {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === "Escape" && target === searchRef.current) {
        setQuery("");
        (target as HTMLInputElement).blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");
      if (TABS.some((t) => t.key === hash)) {
        setQuery("");
        setActiveTab(hash);
        setOpenRow(null);
      }
    };
    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && TABS.some((t) => t.key === detail)) {
        setQuery("");
        setActiveTab(detail);
        setOpenRow(null);
      }
    };
    window.addEventListener("setFullArchiveTab", handler);
    return () => window.removeEventListener("setFullArchiveTab", handler);
  }, []);

  const handleCopy = async (url: string, key: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const input = document.createElement("input");
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!data) return null;

  const q = normalize(query.trim());
  const searching = q.length > 0;

  const results: Array<{ file: any; tab: (typeof TABS)[number]; idx: number }> =
    [];
  if (searching) {
    for (const tab of TABS) {
      const list = (data[tab.key] || []) as any[];
      list.forEach((file, idx) => {
        if (normalize(file.name || "").includes(q))
          results.push({ file, tab, idx });
      });
    }
  }

  const SORTED = new Set(["roms", "kernels", "modules", "recovery", "other"]);
  const files = SORTED.has(activeTab)
    ? [...(data[activeTab] || [])].sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      )
    : ((data[activeTab] || []) as any[]);

  return (
    <section id="archive" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-dim mb-10">
          <span>
            <span className="text-flame">( 03 )</span> Archive
          </span>
          <span>
            {searching ? `${results.length} results` : `${files.length} files`}
          </span>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3 border border-line px-4 py-3 mb-8 focus-within:border-flame/40 transition-colors">
          <span className="font-mono text-[11px] text-flame">&gt;</span>
          <input
            ref={searchRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setOpenRow(null);
            }}
            placeholder="SEARCH THE ARCHIVE"
            aria-label="Search archive"
            className="flex-1 bg-transparent outline-none border-none font-mono text-[12px] tracking-[0.15em] text-ink placeholder:text-dim"
          />
          {query ? (
            <button
              onClick={() => setQuery("")}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-dim hover:text-flame transition-colors"
            >
              Clear
            </button>
          ) : (
            <kbd className="font-mono text-[10px] text-dim border border-line px-1.5 py-0.5">
              /
            </kbd>
          )}
        </div>

        {searching ? (
          <>
            <div className="hidden md:grid grid-cols-[3rem_1fr_5rem_7rem_5rem_2rem] gap-3 px-2 py-3 border-b border-line font-mono text-[9px] uppercase tracking-[0.25em] text-dim">
              <span>N°</span>
              <span>File</span>
              <span>Android</span>
              <span>Date</span>
              <span>Size</span>
              <span />
            </div>
            <div>
              {results.map(({ file, tab, idx }, pos) => {
                const key = `${tab.key}-${idx}`;
                return (
                  <FileRow
                    key={key}
                    file={file}
                    num={pos + 1}
                    openKey={key}
                    isOpen={openRow === key}
                    onToggle={() => setOpenRow(openRow === key ? null : key)}
                    onCopy={() => handleCopy(file.url, key)}
                    copied={copiedKey === key}
                    tabLabel={tab.label}
                  />
                );
              })}
            </div>
            {results.length === 0 && (
              <div className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-dim">
                No matches for "{query.trim()}"
              </div>
            )}
          </>
        ) : (
          <>
            {/* Tabs */}
            <div className="flex gap-8 overflow-x-auto hide-scrollbar border-b border-line mb-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => {
                    setActiveTab(tab.key);
                    setOpenRow(null);
                  }}
                  className={`shrink-0 pb-3 pt-1 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors border-b-2 -mb-px ${
                    activeTab === tab.key
                      ? "text-flame border-flame"
                      : "text-mute border-transparent hover:text-ink"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Column header */}
            <div className="hidden md:grid grid-cols-[3rem_1fr_5rem_7rem_5rem_2rem] gap-3 px-2 py-3 border-b border-line font-mono text-[9px] uppercase tracking-[0.25em] text-dim">
              <span>N°</span>
              <span>File</span>
              <span>Android</span>
              <span>Date</span>
              <span>Size</span>
              <span />
            </div>

            {/* Rows */}
            <div>
              {files.map((file: any, idx: number) => {
                const key = `${activeTab}-${idx}`;
                return (
                  <FileRow
                    key={key}
                    file={file}
                    num={idx + 1}
                    openKey={key}
                    isOpen={openRow === key}
                    onToggle={() => setOpenRow(openRow === key ? null : key)}
                    onCopy={() => handleCopy(file.url, key)}
                    copied={copiedKey === key}
                  />
                );
              })}
            </div>

            {files.length === 0 && (
              <div className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.25em] text-dim">
                No files in this category yet
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
