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

export default function IndexPage() {
  return (
    <div className="container relative">
      <Hero2 />
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
