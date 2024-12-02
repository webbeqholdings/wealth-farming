'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import createGlobe from 'cobe'
import {
  PageHeaderHeading,
  PageHeader,
  PageHeaderDescription,
  PageActions,
} from '@/components/page-header'
import Link from 'next/link'

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let phi = 0

    if (!canvasRef.current) return

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0.3,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
        { location: [10.762622, 106.660172], size: 0.03 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi
        phi += 0.01
      },
    })

    return () => {
      globe.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: '100%', aspectRatio: 1 }}
      className={className}
    />
  )
}

export function MinimalHero() {
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12 xl:grid-cols-[1fr_1fr] items-center">
          <div className="flex flex-col justify-center space-y-4 text-left order-2 lg:order-1">
            <PageHeader>
              <PageHeaderHeading>Your wealth, our mission</PageHeaderHeading>
              <PageHeaderDescription>
                Customized investment solutions to optimize your cash flow. Transparent and secure
                programs delivering steady monthly returns.
              </PageHeaderDescription>
              <PageActions>
                <Button asChild size="sm">
                  <a href="#charts">Browse Charts</a>
                </Button>
                <Link href="/docs/components/chart">Documentation</Link>
              </PageActions>
            </PageHeader>
          </div>
          <div className="mx-auto lg:mx-0 aspect-video overflow-hidden rounded-xl order-1 lg:order-2">
            <Globe />
          </div>
        </div>
      </div>
    </section>
  )
}
