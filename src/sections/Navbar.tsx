import { HardDrive, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() => {
    if (typeof window !== "undefined") {
      return (
        localStorage.getItem("theme") === "dark" ||
        !localStorage.getItem("theme")
      );
    }
    return true;
  });

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  if (typeof window !== "undefined") {
    document.documentElement.classList.toggle("dark", dark);
  }

  const navLinks = [
    { label: "Browse", href: "#browse" },
    { label: "Featured", href: "#roms" },
    { label: "Archive", href: "#full-archive" },
    { label: "Contribute", href: "#contribute" },
  ];

  return (
    <nav
      className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-2xl border border-white/10 px-5 py-3"
      style={{
        background: "rgba(245, 245, 240, 0.08)",
        backdropFilter: "blur(40px) saturate(140%)",
        WebkitBackdropFilter: "blur(40px) saturate(140%)",
        boxShadow:
          "inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.15)",
      }}
    >
      <div className="flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <HardDrive className="h-5 w-5 text-offwhite dark:text-[#e8f0eb]" />
          <span className="text-sm font-semibold tracking-tight text-offwhite dark:text-[#e8f0eb]">
            RMX3031
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-offwhite dark:text-[#e8f0eb]/70 transition-colors duration-200 hover:text-offwhite dark:text-[#e8f0eb]"
            >
              {link.label}
            </a>
          ))}
        </div>

        <button
          onClick={toggleDark}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-lg border border-offwhite/20 text-offwhite/70 transition-colors hover:border-offwhite/40 hover:text-offwhite"
          aria-label="Toggle dark mode"
        >
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
        <a
          href="https://archive.org/details/rmx3031-community"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg bg-forest dark:bg-[#152b23] px-4 py-1.5 text-xs font-semibold text-offwhite dark:text-[#e8f0eb] transition-colors duration-200 hover:bg-sage dark:hover:bg-sage/80 hover:text-forest dark:hover:text-[#e8f0eb] md:inline-block"
        >
          Internet Archive
        </a>

        <button
          className="text-offwhite dark:text-[#e8f0eb] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-offwhite dark:text-[#e8f0eb]/70 transition-colors hover:text-offwhite dark:text-[#e8f0eb]"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          {/* Dark mode toggle inside mobile menu */}
          <button
            onClick={() => {
              toggleDark();
              setMobileOpen(false);
            }}
            className="flex items-center gap-2 text-sm font-medium text-offwhite dark:text-[#e8f0eb]/70 transition-colors hover:text-offwhite dark:text-[#e8f0eb]"
            aria-label="Toggle dark mode"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span>Toggle theme</span>
          </button>
          <a
            href="https://archive.org/details/rmx3031-community"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-lg bg-forest dark:bg-[#152b23] px-4 py-2 text-center text-xs font-semibold text-offwhite dark:text-[#e8f0eb]"
          >
            Internet Archive
          </a>
        </div>
      )}
    </nav>
  );
}
