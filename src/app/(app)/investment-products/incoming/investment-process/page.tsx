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
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { request } from 'http'
import { ProfitChart } from '@/components/ProfitChart'
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns'

interface ProfitItem {
  date: Date
  balance: number
}

export default function InvestmentProcessPage() {
  const { t } = useTranslation(); 
  const [profitData, setProfitData] = useState([])
  const [requestFormData, setRequestFormData] = useState({})

  // const formattedProfitData = Object.entries(profitData).flatMap(([year, items]) =>
  //   items.map((item: ProfitItem) => ({
  //     time: item.date,
  //     balance: item.balance,
  //   })),
  // )
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">{t('investment_process_title')}</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <InvestmentProcessForm onCalculate={setProfitData} onRequest={setRequestFormData} />
          </div>
          <div className="w-full md:w-2/3">
            {requestFormData && (
              <ReportBack
                amount={(requestFormData as { amount: number }).amount}
                term={(requestFormData as { term: Term }).term}
                startDate={(requestFormData as { startDate: Date }).startDate}
                endDate={(requestFormData as { endDate: Date }).endDate}
                periods={(requestFormData as { periods: number }).periods}
                dataExtra={(requestFormData as { dataExtra: object }).dataExtra}
              />
            )}
            {Object.keys(profitData).length > 0 && (
              <Tabs defaultValue="table" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="table">{t('investment_process_table')}</TabsTrigger>
                  <TabsTrigger value="chart">{t('chart')}</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="space-y-4">
                {profitData?.map((entry, index) => (
                    <div key={index}>
                      <ProfitTable data={entry.profitLogs}/>
                    </div>
                  ))}
                </TabsContent>
                <TabsContent value="chart">
                  <Card>
                    <CardHeader>
                      <CardTitle className="capitalize">{t('chart')+' '+t('profit')}</CardTitle>
                      <CardDescription>{t('investment_process_chart_decs')}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      {/* <ProfitChart profitData={formattedProfitData} /> */}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
