'use client'

import React, { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import dynamic from 'next/dynamic'
import createGlobe from 'cobe'
import { GlobeGithub } from '@/components/GlobeGithub'
import { useTranslation } from 'react-i18next';

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
              <PageHeaderHeading>Your wealth, our mission</PageHeaderHeading>
              <PageHeaderDescription>
                {t('Customized investment solutions to optimize your cash flow. Transparent and secure programs delivering steady monthly returns.')}
              </PageHeaderDescription>
              <PageActions>
                <Button asChild size="sm">
                  <Link href="/investment-products/incoming/investment-process">{t('How it works')}</Link>
                </Button>
                {/* <Link href="/docs/components/chart">Documentation</Link> */}
              </PageActions>
            </PageHeader>
          </div>
          <div className="mx-auto lg:mx-0 aspect-video overflow-hidden rounded-xl order-1 lg:order-2">
            <GlobeGithub />
          </div>
        </div>
      </div>
    </section>
  )
}
