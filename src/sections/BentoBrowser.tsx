import { useData } from "../hooks/use-data";

const CATEGORIES = [
  {
    key: "roms",
    num: "01",
    label: "ROMs",
    desc: "custom firmware for daily driving",
  },
  {
    key: "kernels",
    num: "02",
    label: "Kernels",
    desc: "performance, battery & tuning",
  },
  {
    key: "recovery",
    num: "03",
    label: "Recoveries",
    desc: "TWRP & custom recovery images",
  },
];

export default function IndexSection() {
  const { data } = useData();
  if (!data) return null;

  const jump = (key: string) => {
    document.getElementById("archive")?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => {
      window.dispatchEvent(
        new CustomEvent("setFullArchiveTab", { detail: key }),
      );
    }, 400);
  };

  return (
    <section id="index" className="py-24 md:py-32">
      <div className="max-w-6xl mx-auto px-5">
        <div className="flex items-baseline justify-between font-mono text-[10px] uppercase tracking-[0.3em] text-dim mb-10">
          <span>
            <span className="text-flame">( 01 )</span> Index
          </span>
          <span>03 categories</span>
        </div>

        <div>
          {CATEGORIES.map(({ key, num, label, desc }) => {
            const count = data[key]?.length || 0;
            return (
              <button
                key={key}
                onClick={() => jump(key)}
                className="group w-full text-left grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 px-2 md:px-4 py-8 md:py-10 border-t border-line last:border-b hover:bg-soot transition-colors"
              >
                <span className="font-mono text-[10px] text-dim">{num}</span>
                <span>
                  <span className="block font-grotesk text-3xl md:text-5xl font-medium tracking-tight text-ink group-hover:text-flame transition-colors">
                    {label}
                  </span>
                  <span className="block mt-1 font-serif italic text-base md:text-lg text-mute">
                    {desc}
                  </span>
                </span>
                <span className="flex items-center gap-4">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-mute">
                    {count} files
                  </span>
                  <span className="font-mono text-lg text-dim group-hover:text-flame group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform">
                    ↗
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
