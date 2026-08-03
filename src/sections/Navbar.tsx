import { useState } from "react";

const NAV_LINKS = [
  { label: "Index", href: "#index", num: "01" },
  { label: "Latest", href: "#latest", num: "02" },
  { label: "Archive", href: "#archive", num: "03" },
  { label: "About", href: "#about", num: "04" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 inset-x-0 z-50 border-b border-line bg-coal/90 backdrop-blur-md">
        <div className="relative flex items-center justify-between h-12 px-5">
          <a
            href="#"
            className="nav-link font-mono text-[11px] font-bold tracking-[0.2em] text-ink"
          >
            OP6893<sup className="text-[8px] text-mute">®</sup>
          </a>

          <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="nav-link font-mono text-[10px] uppercase tracking-[0.3em] text-mute"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a
              href="https://archive.org/details/rmx3031-community"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-block font-mono text-[10px] uppercase tracking-[0.25em] text-mute border border-line px-3 py-1.5 hover:text-flame hover:border-flame hover:shadow-[0_0_14px_rgba(255,77,0,0.25)] transition-all"
            >
              Internet Archive ↗
            </a>
            <button
              onClick={() => setOpen(!open)}
              className="nav-link font-mono text-[10px] uppercase tracking-[0.3em] text-ink"
            >
              {open ? "Close" : "Menu"}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-coal flex flex-col justify-center px-8 md:px-16">
          <div className="dot-grid absolute inset-0 opacity-40 pointer-events-none" />
          <nav className="relative flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="group flex items-baseline gap-4 py-2"
              >
                <span className="font-mono text-[10px] text-dim">
                  ({link.num})
                </span>
                <span className="font-serif italic text-5xl md:text-7xl text-ink group-hover:text-flame group-hover:[text-shadow:0_0_28px_rgba(255,77,0,0.4)] transition-all">
                  {link.label}
                </span>
              </a>
            ))}
            <a
              href="https://archive.org/details/rmx3031-community"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 font-mono text-[11px] uppercase tracking-[0.3em] text-mute hover:text-flame transition-colors"
            >
              Internet Archive ↗
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
