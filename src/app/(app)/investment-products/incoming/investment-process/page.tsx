'use client'

import { useState } from 'react'
import { InvestmentProcessForm } from '@/components/beq-dynamic-fund/InvestmentProcessForm'
import { ProfitTable } from '@/components/beq-dynamic-fund/ProfitTable'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import ReportBack from '@/components/beq-dynamic-fund/ReportBack'
import { Term } from '@/lib/investment-products/dynamicFund'

export default function InvestmentProcessPage() {
  const [profitData, setProfitData] = useState([])
  const [requestFormData, setRequestFormData] = useState({})
  console.log('requestFormData', requestFormData)
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
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
