import { useEffect, useState, useRef, useCallback } from "react";
import {
  ChevronDown,
  Download,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useData } from "../hooks/use-data";

const TABS = [
  { key: "roms", label: "ROMs" },
  { key: "kernels", label: "Kernels" },
  { key: "modules", label: "Modules" },
  { key: "ota", label: "X7 MAX" },
  { key: "ota_cn", label: "GT Neo" },
  { key: "ota_cnf", label: "GT Neo Flash" },
  { key: "firmware", label: "Firmware" },
  { key: "sptool", label: "SP Tool" },
  { key: "recovery", label: "Recovery" },
  { key: "other", label: "Other" },
];

export default function FileBrowserSection() {
  const { data } = useData();
  const [activeTab, setActiveTab] = useState("roms");
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  // Tab scroll state
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = tabContainerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [checkScroll]);

  useEffect(() => {
    // Recheck when active tab changes (tab might scroll)
    const timer = setTimeout(checkScroll, 50);
    return () => clearTimeout(timer);
  }, [activeTab, checkScroll]);

  const scrollTabs = (direction: "left" | "right") => {
    const el = tabContainerRef.current;
    if (!el) return;
    const scrollAmount = el.clientWidth * 0.6;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      if (TABS.some((tab) => tab.key === hash)) {
        setActiveTab(hash);
        setOpenAccordion(null);
      }
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && TABS.some((tab) => tab.key === detail)) {
        setActiveTab(detail);
        setOpenAccordion(null);
      }
    };
    window.addEventListener("setFullArchiveTab", handler);
    return () => window.removeEventListener("setFullArchiveTab", handler);
  }, []);

  const handleCopy = async (url: string, idx: number) => {
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
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  if (!data) return null;

  const currentFiles = (data[activeTab] || []) as any[];

  return (
    <section id="full-archive" className="py-28 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16 animate-fade-up-once">
          <span className="inline-block text-[11px] font-medium tracking-[0.2em] uppercase text-[#27F3A9]/60 mb-4 text-mono">
            Archive
          </span>
          <h2 className="heading-section text-3xl md:text-4xl text-white tracking-tight">
            Full Archive
          </h2>
          <p className="mt-3 text-[15px] text-white/30 max-w-md mx-auto">
            Every file preserved for the RMX3031 community
          </p>
        </div>

        {/* Tab pills with scroll arrows */}
        <div className="relative flex items-center mb-6">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollTabs("left")}
              className="absolute -left-1 z-10 flex items-center justify-center w-8 h-8 bg-black/80 backdrop-blur-sm border border-white/[0.06] text-white/40 hover:text-[#27F3A9] hover:border-[#27F3A9]/20 transition-all duration-200 shrink-0"
              style={{ borderRadius: "8px" }}
            >
              <ChevronLeft size="14" />
            </button>
          )}

          {/* Scrollable tab container */}
          <div
            ref={tabContainerRef}
            onScroll={checkScroll}
            className={`flex gap-2 overflow-x-auto hide-scrollbar flex-1 px-1 ${
              !canScrollLeft && !canScrollRight ? "justify-center" : ""
            }`}
          >
            {TABS.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setOpenAccordion(null);
                }}
                className={`tab-pill shrink-0 ${activeTab === tab.key ? "tab-pill-active" : ""}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollTabs("right")}
              className="absolute -right-1 z-10 flex items-center justify-center w-8 h-8 bg-black/80 backdrop-blur-sm border border-white/[0.06] text-white/40 hover:text-[#27F3A9] hover:border-[#27F3A9]/20 transition-all duration-200 shrink-0"
              style={{ borderRadius: "8px" }}
            >
              <ChevronRight size="14" />
            </button>
          )}
        </div>

        {/* File count indicator */}
        <div className="flex items-center justify-between mb-4 px-1">
          <span className="text-mono text-[11px] text-white/20 tracking-wider uppercase">
            {currentFiles.length} {currentFiles.length === 1 ? "file" : "files"}
          </span>
          <span className="text-mono text-[11px] text-white/10">
            {activeTab}
          </span>
        </div>

        {/* File list */}
        <div className="space-y-2">
          {currentFiles.map((file: any, idx: number) => {
            const isOpen = openAccordion === `${activeTab}-${idx}`;
            return (
              <div
                key={idx}
                className={`file-row overflow-hidden transition-all duration-300 ${
                  isOpen ? "border-[#27F3A9]/15" : ""
                }`}
                style={{
                  background: isOpen
                    ? "linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)"
                    : undefined,
                }}
              >
                <button
                  onClick={() =>
                    setOpenAccordion(isOpen ? null : `${activeTab}-${idx}`)
                  }
                  className="w-full px-5 py-4 flex items-center justify-between text-left group/row"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-mono text-[10px] text-white/15 w-6 shrink-0">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="min-w-0">
                      <span className="text-white text-[13px] font-medium block truncate">
                        {file.name}
                      </span>
                      <div className="flex items-center gap-3 mt-0.5">
                        {file.version && (
                          <span className="text-mono text-[10px] text-[#27F3A9]/50">
                            {file.version}
                          </span>
                        )}
                        {file.android && (
                          <span className="text-mono text-[10px] text-white/15">
                            Android {file.android}
                          </span>
                        )}
                        {file.date && (
                          <span className="text-mono text-[10px] text-white/15">
                            {file.date}
                          </span>
                        )}
                        {file.size && (
                          <span className="text-mono text-[10px] text-white/10">
                            {file.size}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-white/20 shrink-0 ml-3 transition-all duration-300 ${
                      isOpen
                        ? "rotate-180 text-[#27F3A9]/60"
                        : "group-hover/row:text-white/40"
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 animate-fade-up-once">
                    <div className="pl-9 pt-3 border-t border-white/[0.04] border-l-[2px] border-l-[#27F3A9]/30 space-y-3">
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[12px]">
                        {file.size && (
                          <div>
                            <span className="text-white/20 block text-[10px] text-mono uppercase tracking-wider mb-0.5">
                              Size
                            </span>
                            <span className="text-white/60">{file.size}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-white/20 block text-[10px] text-mono uppercase tracking-wider mb-0.5">
                            Date
                          </span>
                          <span className="text-white/60">{file.date}</span>
                        </div>
                        {file.android && (
                          <div>
                            <span className="text-white/20 block text-[10px] text-mono uppercase tracking-wider mb-0.5">
                              Android
                            </span>
                            <span className="text-white/60">
                              {file.android}
                            </span>
                          </div>
                        )}
                      </div>

                      {file.changelog && (
                        <div>
                          <span className="text-white/20 block text-[10px] text-mono uppercase tracking-wider mb-1.5">
                            Changelog
                          </span>
                          <div
                            className="text-[12px] leading-relaxed whitespace-pre-line text-white/30 bg-white/[0.02] p-3 max-h-40 overflow-y-auto custom-scrollbar"
                            style={{
                              borderRadius: "10px",
                              border: "1px solid rgba(255,255,255,0.04)",
                            }}
                          >
                            {file.changelog}
                          </div>
                        </div>
                      )}

                      <div className="flex items-center gap-2 pt-2">
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 border border-[#27F3A9]/20 px-4 py-2.5 text-[12px] font-medium text-[#27F3A9] transition-all duration-300 hover:bg-[#27F3A9]/8 hover:border-[#27F3A9]/35 hover:shadow-[0_0_16px_rgba(39,243,169,0.1)]"
                          style={{ borderRadius: "10px" }}
                        >
                          <Download size="13" />
                          Download
                        </a>
                        <button
                          onClick={() => handleCopy(file.url, idx)}
                          className="inline-flex items-center gap-1.5 border border-white/[0.06] px-3 py-2.5 text-[12px] text-white/30 transition-all duration-200 hover:border-[#27F3A9]/25 hover:text-[#27F3A9] hover:bg-[#27F3A9]/5"
                          style={{ borderRadius: "10px" }}
                          title={copiedIdx === idx ? "Copied!" : "Copy link"}
                        >
                          {copiedIdx === idx ? (
                            <Check size="13" />
                          ) : (
                            <Copy size="13" />
                          )}
                          {copiedIdx === idx ? "Copied" : "Copy"}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {currentFiles.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/20 text-sm">
              No files in this category yet
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
