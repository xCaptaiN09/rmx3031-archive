import { HardDrive, ExternalLink } from 'lucide-react'
import { useData } from '../hooks/use-data'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const { data, loading } = useData();

  if (loading || !data) return null;

  return (
    <footer className="relative z-10 bg-forest px-6 py-16 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5">
              <HardDrive className="h-5 w-5 text-sage" />
              <span className="text-sm font-semibold text-offwhite">
                {data.codename} Archive
              </span>
            </div>
            <p className="mt-3 max-w-xs text-xs leading-relaxed text-offwhite/40">
              A community-driven archive for {data.device} development files.
              Preserved on the Internet Archive for permanent access.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-offwhite/60">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="#browse"
                  className="text-sm text-offwhite/50 transition-colors hover:text-offwhite"
                >
                  Browse Categories
                </a>
              </li>
              <li>
                <a
                  href="#roms"
                  className="text-sm text-offwhite/50 transition-colors hover:text-offwhite"
                >
                  Featured ROMs
                </a>
              </li>
              <li>
                <a
                  href="#full-archive"
                  className="text-sm text-offwhite/50 transition-colors hover:text-offwhite"
                >
                  Full Archive
                </a>
              </li>
            </ul>
          </div>

          {/* External */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-offwhite/60">
              Resources
            </h4>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="https://archive.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-offwhite/50 transition-colors hover:text-offwhite"
                >
                  Internet Archive
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/xCaptaiN09/rmx3031-archive"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-offwhite/50 transition-colors hover:text-offwhite"
                >
                  GitHub Repository
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                <a
                  href="/admin"
                  className="inline-flex items-center gap-1.5 text-sm text-offwhite/50 transition-colors hover:text-offwhite"
                >
                  Admin Panel
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-offwhite/10 pt-8 md:flex-row">
          <p className="font-mono text-[11px] text-offwhite/30">
            &copy; {currentYear} {data.device} Archive. Maintained by {data.maintainer}.
          </p>
          <p className="font-mono text-[11px] text-offwhite/30">
            Project Codename: {data.codename}
          </p>
        </div>
      </div>
    </footer>
  )
}
