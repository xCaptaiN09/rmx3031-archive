import { HardDrive, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const navLinks = [
    { label: "Browse", href: "#browse" },
    { label: "Featured", href: "#featured" },
    { label: "Archive", href: "#full-archive" },
    { label: "Contribute", href: "#contribute" },
  ];

  // Track which section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-80px 0px -50% 0px" },
    );

    navLinks.forEach((link) => {
      const el = document.querySelector(link.href);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <nav className="fixed top-5 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-2xl border border-white/[0.06] bg-black/50 backdrop-blur-2xl px-6 py-3 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2.5 group">
          <HardDrive className="h-5 w-5 text-[#27F3A9] transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(39,243,169,0.4)]" />
          <span className="text-sm font-semibold tracking-tight text-white heading-section">
            RMX3031
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`relative text-[13px] font-medium transition-colors duration-200 py-1 ${
                  isActive ? "text-white" : "text-white/40 hover:text-white"
                }`}
              >
                {link.label}
                {/* Active indicator dot */}
                <span
                  className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#27F3A9] transition-all duration-300 ${
                    isActive ? "opacity-100 scale-100" : "opacity-0 scale-0"
                  }`}
                />
              </a>
            );
          })}
        </div>

        {/* Internet Archive — Pill Shape */}
        <a
          href="https://archive.org/details/rmx3031-community"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 text-[12px] font-medium text-[#27F3A9]/70 border border-[#27F3A9]/15 rounded-full hover:text-[#27F3A9] hover:border-[#27F3A9]/30 hover:bg-[#27F3A9]/5 transition-all duration-300"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
            <path d="M14 2v4a2 2 0 0 0 2 2h4" />
            <path d="M10 9H8" />
            <path d="M16 13H8" />
            <path d="M16 17H8" />
          </svg>
          Internet Archive
        </a>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 text-white/50 hover:text-white transition-colors"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-3 pt-3 border-t border-white/[0.04] flex flex-col gap-1">
          {navLinks.map((link) => {
            const sectionId = link.href.replace("#", "");
            const isActive = activeSection === sectionId;
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`px-4 py-2.5 text-[13px] font-medium transition-colors rounded-lg ${
                  isActive
                    ? "text-[#27F3A9] bg-[#27F3A9]/5"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {link.label}
              </a>
            );
          })}
          <a
            href="https://archive.org/details/rmx3031-community"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 text-[13px] font-medium text-[#27F3A9]/70 hover:text-[#27F3A9] transition-colors"
          >
            Internet Archive →
          </a>
        </div>
      )}
    </nav>
  );
}
