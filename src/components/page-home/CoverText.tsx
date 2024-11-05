import React from 'react'
import { Cover } from '@/components/ui/cover'
import { Button } from '../ui/button'
import Link from 'next/link'

export function CoverText() {
  return (
    <div className="text-center">
      <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto text-center mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white">
        Make smarter decisions with
        <br /> <Cover>WEALTH FARMING</Cover>
      </h1>
      <Button variant="outline" asChild size="lg">
        <Link href="/join">Open Account Now</Link>
      </Button>
    </div>
  )
}
