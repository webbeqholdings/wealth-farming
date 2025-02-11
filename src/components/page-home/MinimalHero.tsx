'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
// import { GlobeGithub } from '@/components/GlobeGithub'
import { useTranslation } from 'react-i18next';
import WorldMap from "@/components/ui/world-map";
import { motion } from "motion/react";

import {
  PageHeaderHeading,
  PageHeader,
  PageHeaderDescription,
  PageActions,
} from '@/components/page-header'
import Link from 'next/link'

export function MinimalHero() {
  const { t } = useTranslation();
  return (
    <section className="w-full">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:gap-12 xl:grid-cols-[1fr_1fr] items-center">
          <div className="flex flex-col justify-center space-y-4 text-left order-2 lg:order-1">
            <PageHeader>
              <PageHeaderHeading>{t('mission_statement')}</PageHeaderHeading>
              <PageHeaderDescription>
                {t('investment_solutions')}
              </PageHeaderDescription>
              <PageActions>
                <Button asChild size="sm">
                  <Link href="/investment-products/incoming/investment-process">{t('how_it_works')}</Link>
                </Button>
                {/* <Link href="/docs/components/chart">Documentation</Link> */}
              </PageActions>
            </PageHeader>
          </div>
          <div className="mx-auto lg:mx-0 aspect-video overflow-hidden rounded-xl order-1 lg:order-2">
            <div className="">
              <WorldMap
                dots={[
                  {
                    start: {
                      lat: 64.2008,
                      lng: -149.4937,
                    }, // Alaska (Fairbanks)
                    end: {
                      lat: 34.0522,
                      lng: -118.2437,
                    }, // Los Angeles
                  },
                  {
                    start: {
                      lat: 64.2008,
                      lng: -149.4937,
                    }, // Alaska (Fairbanks)
                    end: {
                      lat: 34.0522,
                      lng: -118.2437,
                    }, // Los Angeles
                  },
                  {
                    start: { lat: 64.2008, lng: -149.4937 }, // Alaska (Fairbanks)
                    end: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                  },
                  {
                    start: { lat: -15.7975, lng: -47.8919 }, // Brazil (Brasília)
                    end: { lat: 38.7223, lng: -9.1393 }, // Lisbon
                  },
                  {
                    start: { lat: 51.5074, lng: -0.1278 }, // London
                    end: { lat: 28.6139, lng: 77.209 }, // New Delhi
                  },
                  {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: 43.1332, lng: 131.9113 }, // Vladivostok
                  },
                  {
                    start: { lat: 28.6139, lng: 77.209 }, // New Delhi
                    end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
