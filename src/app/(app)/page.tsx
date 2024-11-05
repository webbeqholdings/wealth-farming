import Image from 'next/image'
import Link from 'next/link'

import { siteConfig } from '@/config/site'
import { Announcement } from '@/components/announcement'
import { ExamplesNav } from '@/components/examples-nav'
import {
  PageActions,
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from '@/components/page-header'
import CardsNewYork from '@/components/example/cards'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import Hero2 from '@/components/test/hero-2'
import { BackgroundBeams } from '@/components/ui/background-beams'
import { AnimatedListTest } from '@/components/AnimateListTest'
import { AnimateBeamMultipleInputTest } from '@/components/AnimateBeamMultipleInputTest'
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
