import { useId } from "react";

const CONTACTS = Array.from({ length: 10 }, (_, index) => index);
const TRACES = CONTACTS.flatMap((index) => {
  const x = 197 + index * 14;
  const y = 132 + index * 14;
  const outerX = 90 + index * 38;
  const outerY = 66 + index * 28;
  return [
    {
      path: `M${x} 101V78L${outerX} 48V28`,
      x: outerX,
      y: 28,
      active: index === 2,
    },
    {
      path: `M${x} 289V312L${outerX} 342V362`,
      x: outerX,
      y: 362,
      active: index === 7,
    },
    {
      path: `M166 ${y}H143L113 ${outerY}H38`,
      x: 38,
      y: outerY,
      active: index === 7,
    },
    {
      path: `M354 ${y}H377L407 ${outerY}H482`,
      x: 482,
      y: outerY,
      active: index === 2,
    },
  ];
});

export default function ChipIllustration() {
  const id = useId();

  return (
    <figure className="chip-figure">
      <div className="border border-line p-3 transition-colors duration-500 hover:border-flame/30">
        <svg
          viewBox="0 0 520 390"
          className="block w-full h-auto"
          role="img"
          aria-labelledby={`${id}-title ${id}-description`}
        >
          <title id={`${id}-title`}>
            MT6893 — shared silicon, continued life
          </title>
          <desc id={`${id}-description`}>
            An etched MediaTek chip with fine copper circuit traces,
            representing the hardware shared by Cupida and Denniz.
          </desc>
          <defs>
            <pattern
              id={`${id}-grid`}
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 2V0H2"
                fill="none"
                stroke="#e8e6e0"
                strokeOpacity=".07"
                strokeWidth=".7"
              />
            </pattern>
            <linearGradient id={`${id}-silicon`} x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#1c1b18" />
              <stop offset=".55" stopColor="#10100f" />
              <stop offset="1" stopColor="#18130f" />
            </linearGradient>
          </defs>

          <rect width="520" height="390" fill={`url(#${id}-grid)`} />
          <g fill="none" stroke="#e8e6e0" strokeOpacity=".22" strokeWidth=".8">
            <path d="M17 30V17H30M490 17H503V30M503 360V373H490M30 373H17V360" />
            <rect
              x="153"
              y="88"
              width="214"
              height="214"
              rx="2"
              strokeDasharray="2 6"
              strokeOpacity=".1"
            />
          </g>

          {TRACES.map((trace) => (
            <g key={trace.path}>
              <path
                d={trace.path}
                fill="none"
                className={
                  trace.active ? "chip-trace chip-trace-active" : "chip-trace"
                }
                strokeWidth=".8"
                vectorEffect="non-scaling-stroke"
              />
              <circle
                cx={trace.x}
                cy={trace.y}
                r="2"
                fill="#0a0a0a"
                stroke={trace.active ? "#ff4d00" : "#57554f"}
                strokeWidth=".8"
              />
              {trace.active && (
                <path
                  d={trace.path}
                  pathLength="100"
                  className="chip-signal"
                  fill="none"
                  stroke="#ff8754"
                  strokeWidth="1.2"
                  strokeDasharray="4 96"
                  vectorEffect="non-scaling-stroke"
                />
              )}
            </g>
          ))}

          <g fill="#38352e">
            {CONTACTS.map((index) => (
              <g key={index}>
                <rect x={195 + index * 14} y="95" width="4" height="12" />
                <rect x={195 + index * 14} y="283" width="4" height="12" />
                <rect x="160" y={130 + index * 14} width="12" height="4" />
                <rect x="348" y={130 + index * 14} width="12" height="4" />
              </g>
            ))}
          </g>

          <rect
            x="166"
            y="101"
            width="188"
            height="188"
            rx="4"
            fill={`url(#${id}-silicon)`}
            stroke="#625848"
            strokeWidth=".9"
          />
          <rect
            x="173"
            y="108"
            width="174"
            height="174"
            rx="1"
            fill="none"
            stroke="#e8e6e0"
            strokeOpacity=".08"
          />
          <path
            d="M183 130V119H194M326 119H337V130M337 260V271H326M194 271H183V260"
            fill="none"
            stroke="#ff4d00"
            strokeOpacity=".55"
            strokeWidth=".8"
          />
          <circle cx="184" cy="119" r="1.5" fill="#ff4d00" />

          <text
            x="260"
            y="150"
            textAnchor="middle"
            className="font-mono"
            fill="#8a8880"
            fontSize="9"
            letterSpacing="3"
          >
            MEDIATEK
          </text>
          <text
            x="260"
            y="197"
            textAnchor="middle"
            className="font-grotesk"
            fill="#e8e6e0"
            fontSize="36"
            fontWeight="500"
            letterSpacing="-1.5"
          >
            MT6893
          </text>
          <path
            d="M203 214H317"
            stroke="#e8e6e0"
            strokeOpacity=".14"
            strokeWidth=".8"
          />
          <text
            x="260"
            y="235"
            textAnchor="middle"
            className="font-mono"
            fill="#ff6b2c"
            fontSize="8"
            letterSpacing="2.1"
          >
            CUPIDA / DENNIZ
          </text>
          <text
            x="260"
            y="257"
            textAnchor="middle"
            className="font-mono"
            fill="#8a8880"
            fontSize="7"
            letterSpacing="1.5"
          >
            PRESERVED. NOT FORGOTTEN.
          </text>
        </svg>
      </div>
      <figcaption className="flex flex-wrap justify-between gap-2 mt-3 font-mono text-[9px] uppercase tracking-[0.2em] text-mute">
        <span>Fig. 01 — Shared silicon</span>
        <span>MT6893 / OP6893</span>
      </figcaption>
    </figure>
  );
}
