import { useState, useEffect } from 'react'
import { useData } from '../hooks/use-data'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import { Download, Info, Calendar, HardDrive } from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/ui/accordion'

const categoryNames: Record<string, string> = {
  roms: 'ROMs',
  kernels: 'Kernels',
  modules: 'Modules',
  ota: 'X7 MAX',
  ota_cn: 'GT Neo',
  ota_cnf: 'GT Neo Flash',
  firmware: 'Firmware',
  sptool: 'SP Tool FW',
  recovery: 'Recovery',
  other: 'Other',
}

export default function FileBrowserSection() {
  const { data, loading } = useData()
  const updateArrows = () => { const el = document.getElementById("tabScrollContainer"); const left = document.getElementById("tabArrowLeft"); const right = document.getElementById("tabArrowRight"); if(!el||!left||!right) return; const overflow = el.scrollWidth > el.clientWidth; left.classList.toggle("hidden", !overflow || el.scrollLeft <= 0); right.classList.toggle("hidden", !overflow || el.scrollLeft >= el.scrollWidth - el.clientWidth - 1); };
  setTimeout(updateArrows, 100);
  const [activeTab, setActiveTab] = useState('roms')

  useEffect(() => {
    const handleTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('change-archive-tab', handleTabChange);
    return () => window.removeEventListener('change-archive-tab', handleTabChange);
  }, []);

  if (loading || !data) return null

  const categories = Object.keys(data).filter((key) => Array.isArray(data[key]))

  return (
    <section id="full-archive" className="relative z-10 bg-offwhite px-6 py-24 lg:px-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-sage">
            Full Archive
          </span>
          <h2
            className="mt-3 text-forest"
            style={{
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              fontWeight: 700,
              letterSpacing: '-0.01em',
              lineHeight: 1.15,
            }}
          >
            Explore All Files
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-forest/60">
            A comprehensive list of all preserved files for the {data.device}.
            Use the tabs below to switch between categories.
          </p>
        </div>

        <Tabs value={activeTab} className="w-full" onValueChange={setActiveTab}>
          <div className="relative mb-8">
            <button
              id="tabArrowLeft"
              onClick={() => { const el = document.getElementById("tabScrollContainer"); if(el) { el.scrollBy({ left: -200, behavior: "smooth" }); updateArrows(); } }}
              className="absolute left-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg border border-sage/20 bg-offwhite text-forest/50 shadow-sm transition-all hover:border-sage hover:text-forest hidden"
            >←</button>
            <div id="tabScrollContainer" className="overflow-x-auto custom-scrollbar pb-2 px-1" onScroll={() => updateArrows()}>
              <TabsList className="inline-flex h-auto w-auto bg-sage/10 p-1">
                {categories.map((cat) => (
                  <TabsTrigger
                    key={cat}
                    value={cat}
                    className="rounded-lg px-6 py-2.5 text-sm font-medium transition-all data-[state=active]:bg-forest data-[state=active]:text-offwhite"
                  >
                    {categoryNames[cat] || cat}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <button
              id="tabArrowRight"
              onClick={() => { const el = document.getElementById("tabScrollContainer"); if(el) { el.scrollBy({ left: 200, behavior: "smooth" }); updateArrows(); } }}
              className="absolute right-0 top-1/2 z-10 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-lg border border-sage/20 bg-offwhite text-forest/50 shadow-sm transition-all hover:border-sage hover:text-forest hidden"
            >→</button>
          </div>

          {categories.map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              <div className="grid grid-cols-1 gap-4">
                {data[cat].length === 0 ? (
                  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-sage/30 py-20 text-center">
                    <HardDrive className="mb-4 h-12 w-12 text-sage/30" />
                    <p className="text-forest/40">No files found in this category.</p>
                  </div>
                ) : (
                  <Accordion type="single" collapsible className="w-full space-y-3">
                    {[...(data[cat] || [])]
                      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map((file: any, i: number) => (
                      <AccordionItem
                        key={i}
                        value={`${cat}-${i}`}
                        className="overflow-hidden rounded-2xl border border-sage/20 bg-white/50 px-6 transition-all hover:border-sage/40 hover:bg-white"
                      >
                        <div className="flex flex-col items-start justify-between py-4 sm:flex-row sm:items-center">
                          <div className="flex-1">
                            <h4 className="text-base font-semibold text-forest">
                              {file.name}
                            </h4>
                            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-forest/50">
                              {file.version && (
                                <span className="flex items-center gap-1">
                                  <Info className="h-3 w-3" />
                                  v{file.version}
                                </span>
                              )}
                              {file.android && (
                                <span className="rounded-full bg-sage/10 px-2 py-0.5 text-sage">
                                  Android {file.android}
                                </span>
                              )}
                              {file.size && (
                                <span className="flex items-center gap-1">
                                  <HardDrive className="h-3 w-3" />
                                  {file.size}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {file.date}
                              </span>
                            </div>
                          </div>

                          <div className="mt-4 flex w-full items-center gap-2 sm:mt-0 sm:w-auto">
                            <AccordionTrigger className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage/10 text-sage hover:bg-sage/20 hover:no-underline" />
                            <button
                              onClick={() => window.open(file.url, '_blank')}
                              className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-forest px-6 text-xs font-semibold text-offwhite transition-colors hover:bg-sage hover:text-forest sm:flex-none"
                            >
                              <Download className="h-3.5 w-3.5" />
                              Download
                            </button>
                          </div>
                        </div>
                        <AccordionContent className="border-t border-sage/10 py-4">
                          <div className="rounded-xl bg-sage/5 p-4">
                            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-sage">
                              Changelog / Description
                            </p>
                            <p className="text-sm leading-relaxed text-forest/70 whitespace-pre-wrap">
                              {file.changelog || 'No description provided.'}
                            </p>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </section>
  )
}
