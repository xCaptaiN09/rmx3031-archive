import Navbar from '../sections/Navbar'
import HeroSection from '../sections/HeroSection'
import BentoBrowser from '../sections/BentoBrowser'
import TransmissionFeed from '../sections/TransmissionFeed'
import FileBrowserSection from '../sections/FileBrowserSection'
import CommunitySection from '../sections/CommunitySection'
import Footer from '../sections/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-offwhite">
      <Navbar />
      <HeroSection />
      <BentoBrowser />
      <TransmissionFeed />
      <FileBrowserSection />
      <CommunitySection />
      <Footer />
    </div>
  )
}
