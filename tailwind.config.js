/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        grotesk: ['"Space Grotesk"', "sans-serif"],
        mono: ['"Space Mono"', "monospace"],
        serif: ['"Instrument Serif"', "serif"],
      },
      colors: {
        coal: "#0A0A0A",
        soot: "#121211",
        ink: "#E8E6E0",
        mute: "#8A8880",
        dim: "#57554F",
        flame: "#FF4D00",
        line: "rgba(232, 230, 224, 0.14)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        cue: {
          "0%, 100%": { transform: "translateY(0)", opacity: "1" },
          "50%": { transform: "translateY(6px)", opacity: "0.3" },
        },
        pulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        cue: "cue 2s ease-in-out infinite",
        pulse: "pulse 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
