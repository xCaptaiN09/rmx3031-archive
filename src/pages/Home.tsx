import Navbar from "../sections/Navbar";
import HeroSection from "../sections/HeroSection";
import BentoBrowser from "../sections/BentoBrowser";
import TransmissionFeed from "../sections/TransmissionFeed";
import FileBrowserSection from "../sections/FileBrowserSection";
import CommunitySection from "../sections/CommunitySection";
import Footer from "../sections/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Grain texture overlay */}
      <div className="grain-overlay" />

      {/* Fixed aurora background */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-black" />
        <div
          className="absolute inset-0 animate-aurora-premium opacity-[0.12]"
          style={{
            background: `radial-gradient(ellipse 80% 60% at 50% 40%, rgba(39,243,169,0.1) 0%, transparent 70%)`,
          }}
        />
        <div
          className="absolute top-0 left-1/4 w-1/2 h-1/2 animate-aurora-secondary opacity-[0.06]"
          style={{
            background: `radial-gradient(circle at 30% 20%, rgba(39,243,169,0.15) 0%, transparent 60%)`,
          }}
        />
      </div>

      {/* Content */}
      <Navbar />
      <HeroSection />

      <div className="section-divider" />
      <BentoBrowser />

      <div className="section-divider" />
      <TransmissionFeed />

      <div className="section-divider" />
      <FileBrowserSection />

      <div className="section-divider" />
      <CommunitySection />

      <Footer />

      {/* Animation keyframes */}
      <style>{`
        @keyframes aurora-premium {
          0% { transform: scale(1) rotate(0deg); opacity: 0.12; }
          50% { transform: scale(1.1) rotate(1deg); opacity: 0.2; }
          100% { transform: scale(1) rotate(0deg); opacity: 0.12; }
        }
        @keyframes aurora-secondary {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -20px) scale(1.05); }
          66% { transform: translate(-20px, 10px) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        .animate-aurora-premium {
          animation: aurora-premium 14s ease-in-out infinite;
        }
        .animate-aurora-secondary {
          animation: aurora-secondary 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
