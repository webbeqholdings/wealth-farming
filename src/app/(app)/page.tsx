import { CoverText } from '@/components/page-home/CoverText'
import { MarqueeClients } from '@/components/page-home/MarqueeClients'
import FeaturesSection from '@/components/page-home/FeaturesSection'

export default function IndexPage() {
  return (
    <div className="container relative">
      {/* <Hero2 /> */}
      <div className="lg:py-12">
        <CoverText />
      </div>
      <div className="lg:py-6">
        <MarqueeClients />
      </div>
      <div className="lg:py-6">
        <FeaturesSection />
      </div>
    </div>
  )
}
