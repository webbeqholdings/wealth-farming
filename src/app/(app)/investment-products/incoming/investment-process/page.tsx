'use client'

import { useState } from 'react'
import { InvestmentProcessForm } from '@/components/beq-dynamic-fund/InvestmentProcessForm'
import { ProfitTable } from '@/components/beq-dynamic-fund/ProfitTable'

export default function InvestmentProcessPage() {
  const [profitData, setProfitData] = useState([])

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Investment Process</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <InvestmentProcessForm onCalculate={setProfitData} />
        </div>
        <div className="w-full md:w-2/3">
          {Object.entries(profitData).map(([year, item]) => {
            console.log('item', item)
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
  )
}
