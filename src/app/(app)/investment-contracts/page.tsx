import { Suspense } from 'react'
import { InvestmentContracts } from '@/components/contracts/investment-contracts'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function InvestmentsPage() {
    return (
        <div>
            <SiteHeader />
            <Suspense fallback={<div className="p-6">Loading investments...</div>}>
                <InvestmentContracts />
            </Suspense>
            <SiteFooter />
        </div>
    )
}
