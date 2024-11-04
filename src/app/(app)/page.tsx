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

export default function IndexPage() {
  return (
    <div className="container relative">
      <Hero2 />
      <div className="md:grids-col-2 grid md:gap-4 lg:grid-cols-10 xl:grid-cols-11 xl:gap-4 mb-4">
        <div className="space-y-4 lg:col-span-6 xl:col-span-5 xl:space-y-4">
          <AnimateBeamMultipleInputTest />
        </div>

        <div className="space-y-4 lg:col-span-4 xl:col-span-6 xl:space-y-4">
          <AnimatedListTest />
        </div>
      </div>
      <ExamplesNav className="[&>a:first-child]:text-primary" />
      <section className="overflow-hidden rounded-lg border bg-background shadow-md md:hidden md:shadow-xl">
        <Image
          src="/examples/cards-light.png"
          width={1280}
          height={1214}
          alt="Cards"
          className="block dark:hidden"
        />
        <Image
          src="/examples/cards-dark.png"
          width={1280}
          height={1214}
          alt="Cards"
          className="hidden dark:block"
        />
      </section>
      <section className="hidden md:block [&>div]:p-0">
        <CardsNewYork />
      </section>
    </div>
  )
}
