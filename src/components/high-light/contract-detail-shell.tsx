'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import ContractDetailHeader from '@/components/high-light/contract-detail-header'
import ContractTransactionsTable from '@/components/high-light/contract-transactions-table'
import ContractEquityChart from '@/components/high-light/contract-equity-chart'
import PasswordOverlay, { LogoutButton } from '@/components/high-light/password-overlay'
import type { Contract, User } from '@/lib/high-light-hooks'

interface ContractDetailShellProps {
  contract: Contract
  user: User | null
}

export default function ContractDetailShell({ contract, user }: ContractDetailShellProps) {
  return (
    <PasswordOverlay>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="outline" size="sm" asChild className="mr-4">
                <Link href={user ? `/high-light/users/${user.id}` : '/dashboard'}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {user ? `Back to ${user.name}'s Profile` : 'Back to Dashboard'}
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Contract Details</h1>
            </div>
            <LogoutButton />
          </div>

          {/* Contract Information */}
          <ContractDetailHeader contract={contract} user={user} />

          {/* Transactions Table */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <ContractTransactionsTable contractId={contract.id} />
          </div>

          {/* Equity Chart */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Equity Performance</h2>
            <ContractEquityChart contractId={contract.id} />
          </div>
        </main>
      </div>
    </PasswordOverlay>
  )
}
