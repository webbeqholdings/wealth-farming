import { Suspense } from 'react'
import { InvestmentContractDetail } from '@/components/contracts/contract-details'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function InvestmentsPage() {
  return (
    <div>
      <SiteHeader />
      <Suspense fallback={<div className="p-6">Loading investments...</div>}>
        <InvestmentContractDetail />
      </Suspense>
      <SiteFooter />
    </div>
  )
}
