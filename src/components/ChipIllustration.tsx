export default function ChipIllustration() {
  return (
    <figure>
      <div className="border border-line p-3">
        <iframe
          src={`${import.meta.env.BASE_URL}art/mt6893/index.html`}
          title="MT6893 — a chip with peripheral connectors and cursor-driven signal traces"
          className="block w-full aspect-[5/4] border-0"
          loading="lazy"
          tabIndex={-1}
        />
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
        <span>Fig. 01 — Shared silicon</span>
        <span>MT6893 / OP6893</span>
      </figcaption>
    </figure>
  );
}
