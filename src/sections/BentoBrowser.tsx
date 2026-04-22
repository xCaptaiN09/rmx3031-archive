import { Cpu, HardDrive, ShieldCheck } from "lucide-react";
import type React from "react";
import { useData } from "../hooks/use-data";

interface CategoryCard {
  title: string;
  count: string;
  description: string;
  image: string;
  icon: React.ReactNode;
  gridClass: string;
  href: string;
}

function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * 10;
  const rotateY = ((centerX - x) / centerX) * -10; // Reversed for natural tilt

  card.style.setProperty("--rx", `${rotateX}deg`);
  card.style.setProperty("--ry", `${rotateY}deg`);
  card.style.setProperty("--mx", `${(x / rect.width) * 100}%`);
  card.style.setProperty("--my", `${(y / rect.height) * 100}%`);
}

function handleMouseLeave(e: React.MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget;
  card.style.setProperty("--rx", "0deg");
  card.style.setProperty("--ry", "0deg");
}

export default function BentoBrowser() {
  const { data, loading } = useData();

  if (loading || !data)
    return (
      <section
        id="browse"
        className="relative z-10 bg-offwhite dark:bg-[#0d1f1a] px-6 py-24 lg:px-12"
      >
        <div className="mx-auto max-w-6xl animate-pulse">
          <div className="h-8 w-48 bg-sage/20 rounded mb-4" />
          <div className="h-12 w-96 bg-sage/10 dark:bg-sage/20 rounded mb-8" />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-sage/5 rounded-3xl" />
            ))}
          </div>
        </div>
      </section>
    );

  const categories: CategoryCard[] = [
    {
      title: "Custom ROMs",
      count: `${data.roms?.length || 0} ROMs`,
      description:
        "Custom Android builds for the RMX3031. LineageOS, EvolutionX, Axion and more.",
      image: "/images/card-custom-roms.jpg",
      icon: <HardDrive className="h-5 w-5" />,
      gridClass: "md:col-span-1 md:row-span-1",
      href: "roms",
    },
    {
      title: "Kernels",
      count: `${data.kernels?.length || 0} Kernels`,
      description:
        "KernelSU, SuSFS, and custom kernels maintained for the RMX3031.",
      image: "/images/card-kernels.jpg",
      icon: <Cpu className="h-5 w-5" />,
      gridClass: "md:col-span-1 md:row-span-1",
      href: "kernels",
    },
    {
      title: "Recoveries",
      count: `${data.recovery?.length || 0} Recoveries`,
      description: "TWRP and OrangeFox recovery builds for the RMX3031.",
      image: "/images/card-recoveries.jpg",
      icon: <ShieldCheck className="h-5 w-5" />,
      gridClass: "md:col-span-1 md:row-span-1",
      href: "recovery",
    },
  ];

  return (
    <section
      id="browse"
      className="relative z-10 bg-offwhite dark:bg-[#0d1f1a] px-6 py-24 lg:px-12"
    >
      <div className="mx-auto max-w-6xl">
        <div className="mb-14">
          <span className="font-mono text-xs font-medium uppercase tracking-widest text-sage">
            File Browser
          </span>
          <h2
            className="mt-3 text-forest dark:text-[#e8f0eb] "
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              lineHeight: 1.15,
            }}
          >
            Browse the Archive
          </h2>
          <p className="mt-3 max-w-md text-base leading-relaxed text-forest/60 dark:text-[#e8f0eb]/60">
            Everything you need for your Realme X7 Max, organized and preserved.
            All files are hosted on the Internet Archive for permanent access.
          </p>
        </div>

        <div className="tilt-grid grid grid-cols-1 gap-5 md:grid-cols-3">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className={`tilt-card group overflow-hidden rounded-3xl border border-sage/30 dark:border-sage/20 bg-offwhite dark:bg-[#152b23] ${cat.gridClass}`}
              style={
                {
                  transform:
                    "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale3d(1, 1, 1)",
                  transition:
                    "transform 0.2s ease-out, box-shadow 0.2s ease-out",
                  willChange: "transform",
                } as any
              }
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseEnter={(e) => {
                const card = e.currentTarget;
                card.style.transform =
                  "perspective(1000px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) scale3d(1.02, 1.02, 1.02)";
              }}
            >
              <div
                className="glare-overlay absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={
                  {
                    background:
                      "radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255,255,255,0.3), transparent 80%)",
                  } as any
                }
              />
              <div className="relative h-full">
                {/* Image */}
                <div className="relative overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.title}
                    className="h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 md:h-56"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-offwhite via-offwhite/40 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-6 pt-2">
                  <div className="mb-3 flex items-center gap-2 text-sage">
                    {cat.icon}
                    <span className="font-mono text-xs font-medium uppercase tracking-wider">
                      {cat.count}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-forest dark:text-[#e8f0eb] ">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-forest/60 dark:text-[#e8f0eb]/60">
                    {cat.description}
                  </p>

                  {/* Hover-reveal download button */}
                  <div className="mt-4 overflow-hidden h-10">
                    <div className="translate-y-full opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      <button
                        onClick={() => {
                          const el = document.getElementById("full-archive");
                          if (el) el.scrollIntoView({ behavior: "smooth" });
                          window.dispatchEvent(
                            new CustomEvent("change-archive-tab", {
                              detail: cat.href,
                            }),
                          );
                        }}
                        className="rounded-lg bg-forest dark:bg-sage px-5 py-2.5 text-sm font-semibold text-offwhite dark:text-forest transition-colors duration-200 hover:bg-sage  hover:text-forest dark:text-[#e8f0eb] "
                      >
                        Browse Files
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
