'use client'

import { useState } from 'react'
import { InvestmentProcessForm } from '@/components/beq-dynamic-fund/InvestmentProcessForm'
import { ProfitTable } from '@/components/beq-dynamic-fund/ProfitTable'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import ReportBack from '@/components/beq-dynamic-fund/ReportBack'
import { Term } from '@/lib/investment-products/dynamicFund'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfitChart } from '@/components/ProfitChart'
import { useTranslation } from 'react-i18next';
import { DataDynamicFundProvider } from '@/components/beq-dynamic-fund/DataProvider'

interface ProfitItem {
  fromDate: Date
  balance: number
}

export default function InvestmentProcessPage() {
  const { t } = useTranslation();
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('investment_process_title')}</h1>
        <DataDynamicFundProvider>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/3">
              <InvestmentProcessForm />
            </div>
            <div className="w-full md:w-2/3">
              <ReportBack />
              <ProfitTable />
            </div>
          </div>
        </DataDynamicFundProvider>

      </div>
      <SiteFooter />
    </>
  )
}