import { HardDrive, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Browse', href: '#browse' },
    { label: 'Featured', href: '#roms' },
    { label: 'Archive', href: '#full-archive' },
    { label: 'Contribute', href: '#contribute' },
  ]

  return (
    <nav
      className="fixed top-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 rounded-2xl border border-white/10 px-5 py-3"
      style={{
        background: 'rgba(245, 245, 240, 0.08)',
        backdropFilter: 'blur(40px) saturate(140%)',
        WebkitBackdropFilter: 'blur(40px) saturate(140%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.15)',
      }}
    >
      <div className="flex items-center justify-between">
        <a href="#" className="flex items-center gap-2.5">
          <HardDrive className="h-5 w-5 text-offwhite" />
          <span className="text-sm font-semibold tracking-tight text-offwhite">
            RMX3031
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-offwhite/70 transition-colors duration-200 hover:text-offwhite"
            >
              {link.label}
            </a>
          ))}
        </div>

        <a
          href="https://archive.org"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded-lg bg-forest px-4 py-1.5 text-xs font-semibold text-offwhite transition-colors duration-200 hover:bg-sage hover:text-forest md:inline-block"
        >
          Internet Archive
        </a>

        <button
          className="text-offwhite md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4 md:hidden">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-offwhite/70 transition-colors hover:text-offwhite"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://archive.org"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-lg bg-forest px-4 py-2 text-center text-xs font-semibold text-offwhite"
          >
            Internet Archive
          </a>
        </div>
      )}
    </nav>
  )
}
