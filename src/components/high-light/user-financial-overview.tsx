'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, DollarSign, TrendingUp } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getUserFinancialData, type FinancialData } from '@/lib/high-light-hooks'

interface UserFinancialOverviewProps {
  userId: string
}

export default function UserFinancialOverview({ userId }: UserFinancialOverviewProps) {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchFinancialData() {
      try {
        const data = await getUserFinancialData(userId)
        setFinancialData(data)
      } catch (error) {
        console.error('Error fetching financial data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchFinancialData()
  }, [userId])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Loading...</CardTitle>
                <div className="h-4 w-4 animate-pulse bg-muted rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="h-8 w-24 animate-pulse bg-muted rounded-md mb-2" />
                <div className="h-4 w-32 animate-pulse bg-muted rounded-md" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (!financialData) {
    return (
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No financial data available for this user.
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-3 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Investment</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            ${financialData.totalInvestment.toLocaleString()}
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            {financialData.investmentChange > 0 ? (
              <>
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+{financialData.investmentChange}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{financialData.investmentChange}%</span>
              </>
            )}
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Withdraw</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${financialData.totalWithdraw.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {financialData.withdrawChange > 0 ? (
              <>
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+{financialData.withdrawChange}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{financialData.withdrawChange}%</span>
              </>
            )}
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${financialData.totalEarnings.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {financialData.earningsChange > 0 ? (
              <>
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+{financialData.earningsChange}%</span>
              </>
            ) : (
              <>
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{financialData.earningsChange}%</span>
              </>
            )}
            <span className="ml-1">from last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
