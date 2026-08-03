export default function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="max-w-6xl mx-auto px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.25em] text-dim">
        <span>© {new Date().getFullYear()} OP6893 Archive</span>
        <span className="hidden md:inline">Powered by community</span>
        <span className="flex items-center gap-6">
          <a
            href="https://archive.org/details/rmx3031-community"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            Internet Archive ↗
          </a>
          <a
            href="https://github.com/xCaptaiN09/rmx3031-archive"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link"
          >
            GitHub ↗
          </a>
        </span>
      </div>

      <div className="overflow-hidden select-none" aria-hidden>
        <div className="font-grotesk font-bold text-stroke stroke-hover text-[17vw] leading-[0.8] text-center -mb-[3vw] tracking-tight">
          OP6893
        </div>
      </div>
    </footer>
  );
}
