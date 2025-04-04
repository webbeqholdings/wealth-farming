'use client'

import { useState } from 'react'
import { Download, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import CardOverview from '@/components/high-light/card-overview'
import TableUsers from '@/components/high-light/table-users'
import TableContracts from '@/components/high-light/table-contracts'
import TableTransactions from '@/components/high-light/table-transactions'
import EquityChart from '@/components/high-light/equity-chart'
import PasswordOverlay, { LogoutButton } from '@/components/high-light/password-overlay'
import type { DashboardData } from '@/lib/high-light-hooks'

interface DashboardShellProps {
  data: DashboardData
}

export default function DashboardShell({ data }: DashboardShellProps) {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <PasswordOverlay>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold tracking-tight">High Light</h1>
            <div className="flex items-center gap-2">
              <LogoutButton />
            </div>
          </div>

          {/* Metrics Cards */}
          <CardOverview metrics={data.metrics} />

          {/* Data Tables */}
          <Tabs defaultValue="users" className="w-full" onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="contracts">Contracts</TabsTrigger>
              </TabsList>
              <div className="relative w-full max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={`Search ${activeTab}...`}
                  className="w-full pl-8"
                />
              </div>
            </div>

            <TabsContent value="users" className="space-y-4">
              <TableUsers users={data.users} />
            </TabsContent>

            <TabsContent value="contracts" className="space-y-4">
              <TableContracts contracts={data.contracts} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </PasswordOverlay>
  )
}
