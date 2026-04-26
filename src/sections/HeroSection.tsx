import { useRef, useEffect } from "react";

type VideoIconProps = {
  src: string;
  size?: number;
};

const VideoIcon = ({ src, size = 72 }: VideoIconProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <span
      className="inline-block align-middle rounded-full overflow-hidden"
      style={{
        width: `clamp(48px, 10vw, ${size}px)`,
        height: `clamp(48px, 10vw, ${size}px)`,
      }}
    >
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        src={src}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />
    </span>
  );
};

const VIDEO_COMMUNITY =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_090051_64ea5059-da6b-492b-a171-aa7ecc767dc3.mp4";
const VIDEO_ARCHIVE =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260424_093237_ff0ddc63-c068-4e29-96da-fdd0e40af133.mp4";

const GRADIENT_STYLE = {
  background: "linear-gradient(90deg, #333333 0%, #878787 50%, #333333 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  lineHeight: 1.1,
};

// Consistent spacing between all lines
const LINE_GAP = "0.15em";

// Consistent spacing between elements on Line 3
const ELEMENT_GAP = "0.25em";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full bg-black overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 bg-black/90" />

      <div className="relative z-10 flex flex-col items-center text-center px-4 max-w-5xl mx-auto">
        <h1
          className="font-light tracking-[-0.01em] text-white"
          style={{
            fontFamily: "'YDYoonche L', 'YDYoonche M', sans-serif",
            fontSize: "clamp(2.2rem, 7vw, 6.5rem)",
          }}
        >
          {/* Line 1: The vision */}
          <span className="block" style={{ ...GRADIENT_STYLE }}>
            The vision
          </span>

          {/* Line 2: of RMX3031 — EQUAL gap below Line 1 */}
          <span
            className="block"
            style={{ ...GRADIENT_STYLE, marginTop: LINE_GAP }}
          >
            of RMX3031
          </span>

          {/* Line 3: is + VIDEO + Community + + + VIDEO + Archive — EQUAL gap below Line 2 */}
          <span
            className="block text-center"
            style={{ marginTop: LINE_GAP, lineHeight: "normal" }}
          >
            <span
              className="inline-block align-middle"
              style={{ color: "#555", marginRight: ELEMENT_GAP }}
            >
              is
            </span>

            <span
              className="inline-block align-middle"
              style={{ marginRight: ELEMENT_GAP }}
            >
              <VideoIcon src={VIDEO_COMMUNITY} size={110} />
            </span>

            <span
              className="inline-block align-middle"
              style={{ marginRight: ELEMENT_GAP }}
            >
              Community
            </span>

            <span
              className="inline-block align-middle"
              style={{ color: "#555", marginRight: ELEMENT_GAP }}
            >
              +
            </span>

            <span
              className="inline-block align-middle"
              style={{ marginRight: ELEMENT_GAP }}
            >
              <VideoIcon src={VIDEO_ARCHIVE} size={110} />
            </span>

            <span className="inline-block align-middle">Archive</span>
          </span>
        </h1>

        <p
          className="mt-4 max-w-xl text-center px-2"
          style={{
            fontSize: "clamp(0.95rem, 2.2vw, 1.2rem)",
            color: "#888",
            lineHeight: 1.4,
            fontWeight: 400,
          }}
        >
          We preserve custom ROMs, kernels, recoveries, and mods for the
          RMX3031, ensuring the community always has access.
        </p>

        <button
          onClick={() =>
            document
              .getElementById("full-archive")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="mt-6 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0px_6px_32px_8px_rgba(39,243,169,0.22)] active:scale-[0.98]"
          style={{
            padding: "12px 28px",
            background: "#000",
            boxShadow: "0px 6px 24px 6px rgba(39, 243, 169, 0.15)",
            borderRadius: 8,
            outline: "1px solid #30463C",
            outlineOffset: -1,
            border: "none",
            cursor: "pointer",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
          }}
        >
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 400 }}>
            Browse Full Archive
          </span>
        </button>
      </div>

      <style>{`
        @font-face {
          font-family: 'YDYoonche L';
          src: local('Apple SD Gothic Neo Light'), local('Noto Sans KR Light'), local('Malgun Gothic Light');
          font-weight: 300;
          font-style: normal;
        }
        @font-face {
          font-family: 'YDYoonche M';
          src: local('Apple SD Gothic Neo Medium'), local('Noto Sans KR Medium'), local('Malgun Gothic');
          font-weight: 500;
          font-style: normal;
        }
      `}</style>
    </section>
  );
}
