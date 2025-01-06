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

interface ProfitItem {
  date: Date
  balance: number
}

export default function InvestmentProcessPage() {
  const [profitData, setProfitData] = useState([])
  const [requestFormData, setRequestFormData] = useState({})

  const formattedProfitData = Object.entries(profitData).flatMap(([year, items]) =>
    items.map((item: ProfitItem) => ({
      time: item.date,
      balance: item.balance,
    })),
  )
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold mb-6 text-center">Giả Lập Kế Hoạch Tài Chính</h1>
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
                  <TabsTrigger value="table">Bảng Lãi</TabsTrigger>
                  <TabsTrigger value="chart">Biểu Đồ</TabsTrigger>
                </TabsList>
                <TabsContent value="table" className="space-y-4">
                  {Object.entries(profitData).map(([year, item]) => {
                    return (
                      <div key={year} className="mb-10">
                        <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                          {`Year ${year}`}
                        </h2>
                        <ProfitTable data={item} />
                      </div>
                    )
                  })}
                </TabsContent>
                <TabsContent value="chart">
                  <Card>
                    <CardHeader>
                      <CardTitle>Biểu Đồ Lợi Nhuận</CardTitle>
                      <CardDescription>Biểu diễn số dư theo thời gian</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-2">
                      <ProfitChart profitData={formattedProfitData} />
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
