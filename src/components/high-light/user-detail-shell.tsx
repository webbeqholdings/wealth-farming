'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import UserDetailHeader from '@/components/high-light/user-detail-header'
import UserFinancialOverview from '@/components/high-light/user-financial-overview'
import UserContractsList from '@/components/high-light/user-contracts-list'
import UserEquityChart from '@/components/high-light/user-equity-chart'
import UserTransactionsTable from '@/components/high-light/user-transactions-table'
import PasswordOverlay, { LogoutButton } from '@/components/high-light/password-overlay'
import type { User } from '@/lib/high-light-hooks'

interface UserDetailShellProps {
  user: User
  allUsers: User[]
}

export default function UserDetailShell({ user, allUsers }: UserDetailShellProps) {
  const router = useRouter()

  const handleUserChange = (userId: string) => {
    router.push(`/high-light/users/${userId}`)
  }

  return (
    <PasswordOverlay>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/high-light">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to High Light
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            </div>

            <div className="flex items-center gap-3">
              <Select value={user.id} onValueChange={handleUserChange}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select a user" />
                </SelectTrigger>
                <SelectContent>
                  {allUsers.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <LogoutButton />
            </div>
          </div>

          {/* User Information */}
          <UserDetailHeader user={user} />

          {/* Financial Overview */}
          <UserFinancialOverview userId={user.id} />

          {/* User Contracts */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Contracts</h2>
            <UserContractsList userId={user.id} />
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Transactions</h2>
            <UserTransactionsTable userId={Number(user.id)} />
          </div>

          {/* Equity Chart */}
          {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Equity Performance</h2>
            <UserEquityChart userId={user.id} />
          </div> */}
        </main>
      </div>
    </PasswordOverlay>
  )
}
