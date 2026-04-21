import { ChevronDown } from 'lucide-react'
import { useData } from '../hooks/use-data'

export default function HeroSection() {
  const { data, loading } = useData();

  if (loading || !data) return null;

  const totalFiles = Object.values(data)
    .filter(Array.isArray)
    .reduce((acc, curr) => acc + curr.length, 0);

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-bg.mp4" type="video/mp4" />
      </video>

      {/* Overlay gradient */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(45, 74, 62, 0.5) 0%, rgba(45, 74, 62, 0.75) 100%)',
        }}
      />

      {/* Hero Content */}
      <div className="relative z-[2] flex h-full flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sage/30 bg-sage/10 px-4 py-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-sage" />
          <span className="font-mono text-xs font-medium tracking-wide text-sage">
            Community Archive — {totalFiles} Files Preserved
          </span>
        </div>

        <h1
          className="max-w-4xl text-offwhite"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            fontWeight: 800,
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            textShadow: '0px 4px 24px rgba(0,0,0,0.3)',
          }}
        >
          {data.device}
        </h1>

        <p
          className="mt-5 max-w-lg text-offwhite/80"
          style={{
            fontSize: '1.05rem',
            fontWeight: 400,
            lineHeight: 1.6,
            textShadow: '0px 2px 12px rgba(0,0,0,0.25)',
          }}
        >
          Immutable builds for the {data.codename}. Custom ROMs, kernels, recoveries,
          and mods — maintained by {data.maintainer}.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
          <a
            href="#browse"
            className="rounded-xl bg-offwhite px-7 py-3 text-sm font-semibold text-forest transition-colors duration-200 hover:bg-sage"
          >
            Browse Files
          </a>
          <a
            href="https://github.com/xCaptaiN09/RMX3031-Community-Files"
            target="_blank"
            className="rounded-xl border border-offwhite/30 bg-transparent px-7 py-3 text-sm font-semibold text-offwhite transition-colors duration-200 hover:bg-offwhite/10"
          >
            GitHub Repo
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 z-[2] -translate-x-1/2">
        <a
          href="#browse"
          className="flex flex-col items-center gap-1 text-offwhite/50 transition-colors hover:text-offwhite"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest">
            Scroll
          </span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
