'use client'

import { ArrowDown, ArrowUp, BarChart3, Clock, DollarSign, Users } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CardOverviewProps {
  metrics: {
    totalRevenue: number
    activeUsers: number
    activeContracts: number
    avgResponseTime: string
    revenueChange: number
    userChange: number
    contractChange: number
    responseTimeChange: number
  }
}

export default function CardOverview({ metrics }: CardOverviewProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${metrics.totalRevenue.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500">+{metrics.revenueChange}%</span> from last month
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">+{metrics.activeUsers}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500">+{metrics.userChange}</span> new users
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Active Contracts</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.activeContracts}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            {metrics.contractChange < 0 ? (
              <>
                <ArrowDown className="mr-1 h-4 w-4 text-red-500" />
                <span className="text-red-500">{metrics.contractChange}</span>
              </>
            ) : (
              <>
                <ArrowUp className="mr-1 h-4 w-4 text-emerald-500" />
                <span className="text-emerald-500">+{metrics.contractChange}</span>
              </>
            )}
            from last week
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Avg. Response Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{metrics.avgResponseTime}</div>
          <div className="flex items-center text-xs text-muted-foreground">
            <ArrowDown className="mr-1 h-4 w-4 text-emerald-500" />
            <span className="text-emerald-500">{metrics.responseTimeChange}h</span> from last month
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
