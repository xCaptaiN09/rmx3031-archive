import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Upload, ShieldCheck, Globe, Heart } from 'lucide-react'
import { useData } from '../hooks/use-data'

gsap.registerPlugin(ScrollTrigger)

export default function CommunitySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const lettersRef = useRef<HTMLDivElement>(null)
  const { data, loading } = useData();

  useEffect(() => {
    if (!lettersRef.current || !sectionRef.current) return

    const letters = lettersRef.current.querySelectorAll('.wave-letter')

    gsap.from(letters, {
      y: 50,
      opacity: 0,
      rotation: -5,
      scaleY: 1.5,
      duration: 0.8,
      ease: 'back.out(1.7)',
      stagger: { each: 0.05, from: 'start' },
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 80%',
      },
    })

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  if (loading || !data) return null;

  const totalFiles = Object.values(data)
    .filter(Array.isArray)
    .reduce((acc, curr) => acc + curr.length, 0);

  const communityLetters = 'COMMUNITY'.split('')

  const features = [
    {
      icon: <Upload className="h-5 w-5" />,
      title: 'Upload Files',
      description:
        'Have a custom ROM or kernel? Upload it to the Internet Archive and share the link with us.',
    },
    {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: 'Verify Builds',
      description:
        'Test ROMs and kernels on the RMX3031 and report issues to help the community.',
    },
    {
      icon: <Globe className="h-5 w-5" />,
      title: 'Preserve History',
      description:
        'Every file uploaded to the Internet Archive is preserved forever. No more dead links.',
    },
    {
      icon: <Heart className="h-5 w-5" />,
      title: 'Support Developers',
      description:
        'Credit and link back to original developers. This archive is a mirror, not a replacement.',
    },
  ]

  return (
    <section
      id="contribute"
      ref={sectionRef}
      className="community-section relative z-10 bg-offwhite px-6 py-24 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        {/* Wave Text */}
        <div ref={lettersRef} className="mb-16 overflow-hidden">
          <div
            className="flex tracking-tighter text-forest"
            style={{
              fontSize: 'clamp(2rem, 8vw, 8rem)',
              fontWeight: 800,
              lineHeight: 1,
            }}
          >
            {communityLetters.map((letter, i) => (
              <span
                key={i}
                className="wave-letter inline-block origin-bottom"
                style={{ display: 'inline-block' }}
              >
                {letter}
              </span>
            ))}
          </div>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-forest/60">
            The {data.codename} Archive is built by the community, for the community.
            Every contribution helps keep this resource alive.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          {/* Left: How to Contribute */}
          <div>
            <h3 className="text-2xl font-semibold text-forest">
              How to Contribute
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-forest/60">
              Contributing is simple. Upload your files to the Internet Archive, then share the link with us.

            </p>
            <div className="mt-8 space-y-4">
              {features.map((feat) => (
                <div
                  key={feat.title}
                  className="group flex gap-4 rounded-2xl border border-sage/20 bg-white/50 p-5 transition-all duration-200 hover:border-sage/40 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sage/15 text-sage transition-colors group-hover:bg-sage group-hover:text-offwhite">
                    {feat.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-forest">
                      {feat.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-forest/50">
                      {feat.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Stats & CTA */}
          <div className="flex flex-col justify-center">
            <div className="rounded-3xl border border-sage/20 bg-white/50 p-8">
              <h3 className="text-xl font-semibold text-forest">
                Archive Stats
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-6">
                <div>
                  <p
                    className="font-mono text-3xl font-bold text-forest"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {totalFiles}+
                  </p>
                  <p className="mt-1 text-xs text-forest/50">Files Preserved</p>
                </div>
                <div>
                  <p
                    className="font-mono text-3xl font-bold text-forest"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {data.roms?.length || 0}
                  </p>
                  <p className="mt-1 text-xs text-forest/50">Custom ROMs</p>
                </div>
                <div>
                  <p
                    className="font-mono text-3xl font-bold text-forest"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {data.kernels?.length || 0}
                  </p>
                  <p className="mt-1 text-xs text-forest/50">Kernels</p>
                </div>
                <div>
                  <p
                    className="font-mono text-3xl font-bold text-forest"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {data.recovery?.length || 0}
                  </p>
                  <p className="mt-1 text-xs text-forest/50">Recoveries</p>
                </div>
              </div>

              <div className="mt-8 border-t border-sage/10 pt-6">
                <p className="text-sm text-forest/60">
                  Want to add your files?
                </p>
                <a
                  href="https://archive.org/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-offwhite transition-colors duration-200 hover:bg-sage hover:text-forest"
                >
                  <Upload className="h-4 w-4" />
                  Upload to Archive
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
