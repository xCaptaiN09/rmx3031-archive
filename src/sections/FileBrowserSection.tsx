import { useEffect, useId, useRef, useState } from "react";
import { useData } from "../hooks/use-data";
import type { Entry } from "../hooks/use-data";
import {
  ARCHIVE_CATEGORIES,
  formatArchiveDate,
  formatVersion,
  normalizeSearch,
} from "../lib/archive";
import type { ArchiveCategory, CategoryKey } from "../lib/archive";

const SORTED_CATEGORIES = new Set<CategoryKey>([
  "roms",
  "kernels",
  "modules",
  "recovery",
  "other",
]);

interface FileRowProps {
  file: Entry;
  num: number;
  isRom: boolean;
  showAndroid: boolean;
  isOpen: boolean;
  onToggle: () => void;
  onCopy: () => void;
  copied: boolean;
  tabLabel?: string;
}

function FileRow({
  file,
  num,
  isRom,
  showAndroid,
  isOpen,
  onToggle,
  onCopy,
  copied,
  tabLabel,
}: FileRowProps) {
  const detailsId = useId();
  const version = formatVersion(file.version);
  const date = formatArchiveDate(file.date);

  return (
    <div className="border-b border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={detailsId}
        data-android={showAndroid}
        className="archive-row-grid w-full items-center px-2 py-4 text-left hover:bg-soot transition-colors"
      >
        <span className="font-mono text-[10px] text-dim">
          {String(num).padStart(2, "0")}
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap md:flex-nowrap items-center gap-2 min-w-0">
            {tabLabel && (
              <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.2em] text-flame border border-flame/20 px-1.5 py-0.5">
                {tabLabel}
              </span>
            )}
            <span
              className="font-grotesk text-sm font-medium text-ink break-words md:truncate"
              title={file.name}
            >
              {file.name}
            </span>
          </span>
          <span className="md:hidden flex flex-wrap gap-x-2 gap-y-1 mt-1 font-mono text-[10px] text-mute">
            {version !== "—" && <span>{version}</span>}
            {isRom && file.android && <span>Android {file.android}</span>}
            <time dateTime={file.date}>{date}</time>
            {file.size && <span>{file.size}</span>}
          </span>
        </span>
        <span
          className="hidden md:block truncate font-mono text-[10px] text-mute"
          title={version}
        >
          <span className="sr-only">Version </span>
          {version}
        </span>
        {showAndroid && (
          <span className="hidden md:block font-mono text-[10px] text-mute">
            <span className="sr-only">Android </span>
            {isRom ? file.android || "—" : "—"}
          </span>
        )}
        <time
          dateTime={file.date}
          className="hidden md:block font-mono text-[10px] tabular-nums text-mute whitespace-nowrap"
        >
          {date}
        </time>
        <span className="hidden md:block font-mono text-[10px] text-mute whitespace-nowrap">
          {file.size || "—"}
        </span>
        <span
          aria-hidden="true"
          className={`font-mono text-base text-mute justify-self-end transition-transform duration-300 ${isOpen ? "rotate-45 text-flame" : ""}`}
        >
          +
        </span>
      </button>

      <div
        id={detailsId}
        hidden={!isOpen}
        className="px-2 pb-6 md:pl-[3.25rem]"
      >
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
            type="button"
            onClick={onCopy}
            className="font-mono text-[10px] uppercase tracking-[0.25em] border border-line px-4 py-2 text-mute hover:text-ink hover:border-ink transition-colors"
          >
            {copied ? "Copied ✓" : "Copy link"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ArchiveSection() {
  const { data, loading, error } = useData();
  const [activeTab, setActiveTab] = useState<CategoryKey>(() => {
    const hash = window.location.hash.slice(1);
    return ARCHIVE_CATEGORIES.find((tab) => tab.key === hash)?.key || "roms";
  });
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      const typing =
        target instanceof HTMLElement &&
        (target.matches("input, textarea, select") || target.isContentEditable);
      if (
        event.key === "/" &&
        !typing &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.altKey
      ) {
        event.preventDefault();
        searchRef.current?.focus();
      }
      if (event.key === "Escape" && target === searchRef.current) {
        setQuery("");
        setOpenRow(null);
        searchRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const selectTab = (key: unknown) => {
      const tab = ARCHIVE_CATEGORIES.find((item) => item.key === key);
      if (!tab) return;
      setQuery("");
      setActiveTab(tab.key);
      setOpenRow(null);
    };
    const handleHash = () => selectTab(window.location.hash.slice(1));
    const handleTab = (event: Event) =>
      selectTab((event as CustomEvent<unknown>).detail);
    window.addEventListener("hashchange", handleHash);
    window.addEventListener("setFullArchiveTab", handleTab);
    return () => {
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("setFullArchiveTab", handleTab);
    };
  }, []);

  useEffect(
    () => () => {
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    },
    [],
  );

  const handleCopy = async (url: string, key: string) => {
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(url);
      setCopiedKey(key);
      if (copyTimer.current !== null) clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      setCopiedKey(null);
      setCopyError(
        "Could not copy the link. Use the download link to copy its address.",
      );
    }
  };

  const normalizedQuery = normalizeSearch(query.trim());
  const searching = normalizedQuery.length > 0;
  const entries: Array<{ file: Entry; tab: ArchiveCategory }> = [];

  if (data) {
    for (const tab of ARCHIVE_CATEGORIES) {
      if (!searching && tab.key !== activeTab) continue;
      const category = data[tab.key];
      const files = Array.isArray(category) ? [...category] : [];
      if (!searching && SORTED_CATEGORIES.has(tab.key)) {
        files.sort((a, b) => b.date.localeCompare(a.date));
      }
      for (const file of files) {
        const searchable = [
          file.name,
          file.version || "",
          formatVersion(file.version),
          tab.key === "roms" ? file.android || "" : "",
          file.date,
          formatArchiveDate(file.date),
          tab.label,
        ];
        if (
          !searching ||
          searchable.some((value) =>
            normalizeSearch(value).includes(normalizedQuery),
          )
        ) {
          entries.push({ file, tab });
        }
      }
    }
  }

  const showAndroid = searching
    ? entries.some(({ tab }) => tab.key === "roms")
    : activeTab === "roms";

  return (
    <section id="archive" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-mute mb-10">
          <span>
            <span className="text-flame">( 03 )</span> Archive
          </span>
          <span aria-live="polite">
            {loading
              ? "Loading"
              : `${entries.length} ${searching ? "results" : "files"}`}
          </span>
        </div>

        <div className="flex items-center gap-3 border border-line px-4 py-3 mb-8 focus-within:border-flame/40 transition-colors">
          <span aria-hidden="true" className="font-mono text-[11px] text-flame">
            &gt;
          </span>
          <input
            ref={searchRef}
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setOpenRow(null);
            }}
            placeholder="SEARCH THE ARCHIVE"
            aria-label="Search archive"
            type="search"
            className="min-w-0 flex-1 bg-transparent outline-none border-none font-mono text-[12px] tracking-[0.15em] text-ink placeholder:text-mute"
          />
          {query ? (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setOpenRow(null);
                searchRef.current?.focus();
              }}
              className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute hover:text-flame transition-colors"
            >
              Clear
            </button>
          ) : (
            <kbd
              aria-hidden="true"
              className="font-mono text-[10px] text-mute border border-line px-1.5 py-0.5"
            >
              /
            </kbd>
          )}
        </div>

        {!searching && (
          <div
            className="flex gap-8 overflow-x-auto hide-scrollbar border-b border-line mb-2"
            aria-label="Archive categories"
          >
            {ARCHIVE_CATEGORIES.map((tab) => (
              <button
                key={tab.key}
                type="button"
                aria-pressed={activeTab === tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setOpenRow(null);
                }}
                className={`shrink-0 pb-3 pt-1 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors border-b-2 -mb-px ${activeTab === tab.key ? "text-flame border-flame" : "text-mute border-transparent hover:text-ink"}`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {error ? (
          <div role="alert" className="py-12 font-mono text-sm text-mute">
            <p>Archive unavailable. {error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 text-flame underline underline-offset-4"
            >
              Reload archive
            </button>
          </div>
        ) : loading ? (
          <p role="status" className="py-12 font-mono text-sm text-mute">
            Loading preserved files…
          </p>
        ) : (
          <>
            <div
              data-android={showAndroid}
              className="archive-row-grid archive-column-header px-2 py-3 border-b border-line font-mono text-[9px] uppercase tracking-[0.2em] text-mute"
              aria-hidden="true"
            >
              <span>N°</span>
              <span>File</span>
              <span>Version</span>
              {showAndroid && <span>Android</span>}
              <span>Date</span>
              <span>Size</span>
              <span />
            </div>
            {entries.map(({ file, tab }, index) => {
              const key = `${tab.key}:${file.url}`;
              return (
                <FileRow
                  key={key}
                  file={file}
                  num={index + 1}
                  isRom={tab.key === "roms"}
                  showAndroid={showAndroid}
                  isOpen={openRow === key}
                  onToggle={() => setOpenRow(openRow === key ? null : key)}
                  onCopy={() => handleCopy(file.url, key)}
                  copied={copiedKey === key}
                  tabLabel={searching ? tab.label : undefined}
                />
              );
            })}
            {entries.length === 0 && (
              <p className="py-16 text-center font-mono text-[11px] uppercase tracking-[0.15em] text-mute">
                {searching
                  ? `No matches for “${query.trim()}”`
                  : "No files in this category yet"}
              </p>
            )}
          </>
        )}
        <p role="status" className="mt-3 font-mono text-[11px] text-flame">
          {copyError}
        </p>
      </div>
    </section>
  );
}
