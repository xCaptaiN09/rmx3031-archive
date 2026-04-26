export default function Footer() {
  return (
    <footer className="relative border-t border-white/[0.04] bg-black/40 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-[#27F3A9] animate-glow-pulse" />
          <span className="text-[13px] text-white/30">
            © {new Date().getFullYear()}{" "}
            <span className="text-white/50">RMX3031 Archive</span>
            {" · "}powered by community
          </span>
        </div>

        {/* Right */}
        <div className="flex items-center gap-6">
          <a
            href="https://archive.org/details/rmx3031-community"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-white/25 hover:text-[#27F3A9] transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(39,243,169,0.3)]"
          >
            Internet Archive
          </a>
          <a
            href="https://github.com/xCaptaiN09/rmx3031-archive"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] text-white/25 hover:text-[#27F3A9] transition-all duration-200 hover:drop-shadow-[0_0_8px_rgba(39,243,169,0.3)]"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
