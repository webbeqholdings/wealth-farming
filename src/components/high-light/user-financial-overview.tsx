import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowDown, ArrowUp, DollarSign, TrendingUp } from 'lucide-react'

interface UserFinancialOverviewProps {
  userId: number
}

export default function UserFinancialOverview({ userId }: UserFinancialOverviewProps) {
  // In a real app, you would fetch this data based on the userId
  const financialData = userFinancialData.find((data) => data.userId === userId) || {
    userId: 0,
    totalInvestment: 0,
    totalWithdraw: 0,
    totalEarnings: 0,
    investmentChange: 0,
    withdrawChange: 0,
    earningsChange: 0,
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

// Sample data - in a real app, this would come from a database
const userFinancialData = [
  {
    userId: 1,
    totalInvestment: 125000,
    totalWithdraw: 45000,
    totalEarnings: 32500,
    investmentChange: 12.5,
    withdrawChange: -5.2,
    earningsChange: 8.7,
  },
  {
    userId: 2,
    totalInvestment: 87500,
    totalWithdraw: 23000,
    totalEarnings: 18200,
    investmentChange: 5.8,
    withdrawChange: 3.2,
    earningsChange: 10.5,
  },
  // Other user financial data...
]
