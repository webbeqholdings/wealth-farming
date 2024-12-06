'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  GlobeIcon,
  DollarSignIcon,
  BarChart3Icon,
} from 'lucide-react'
import { LineChart, Line } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
  { name: 'Jul', value: 349 },
]

const IndexItem = ({ name, value, change }: { name: string; value: number; change: number }) => (
  <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
    <div className="flex items-center gap-1 overflow-hidden">
      <span className="font-medium truncate">{name}</span>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <span className="font-medium">{value.toFixed(2)}</span>
      <Badge variant={change >= 0 ? 'default' : 'destructive'} className="text-[10px] px-1 py-0">
        <span className="flex items-center">
          {change >= 0 ? (
            <ArrowUpIcon className="w-2 h-2 mr-0.5" />
          ) : (
            <ArrowDownIcon className="w-2 h-2 mr-0.5" />
          )}
          {Math.abs(change).toFixed(2)}%
        </span>
      </Badge>
    </div>
  </div>
)

export default function WorldIndicesDashboard() {
  return (
    <div className="">
      <div className="bg-background">
        <h2 className="text-3xl font-bold mb-8">World Indices</h2>
        {/* <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">World Indices</h2> */}
        <p className="text-xs sm:text-sm text-muted-foreground">
          Global market overview. Last updated: 2024-12-05 23:00:00
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* First Column - US Indices */}
        <Card className="bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">US Indices</CardTitle>
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-xs sm:text-sm">
            <IndexItem name="S&P 500" value={4783.45} change={0.46} />
            <IndexItem name="Nasdaq" value={15055.65} change={0.95} />
            <IndexItem name="Dow Jones" value={37090.24} change={0.17} />
            <IndexItem name="Russell 2000" value={1961.62} change={-0.41} />
          </CardContent>
        </Card>

        {/* Second Column - European Indices */}
        <Card className="bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">European Indices</CardTitle>
            <GlobeIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="text-xs sm:text-sm">
            <IndexItem name="FTSE 100" value={7515.38} change={-0.23} />
            <IndexItem name="DAX" value={16656.44} change={0.75} />
            <IndexItem name="CAC 40" value={7435.99} change={0.66} />
            <IndexItem name="EURO STOXX 50" value={4483.26} change={0.68} />
          </CardContent>
        </Card>

        {/* Third Column - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Global Market Cap</CardTitle>
              <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">$98.7T</div>
              <div className="text-[10px] text-green-500">+0.32%</div>
              <div className="h-[30px] mt-1">
                <LineChart width={70} height={30} data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Global Volume</CardTitle>
              <BarChart3Icon className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">$5.2T</div>
              <div className="text-[10px] text-green-500">+1.22%</div>
              <div className="h-[30px] mt-1">
                <LineChart width={70} height={30} data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">VIX</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="10"
                      strokeDasharray="282.7"
                      strokeDashoffset="212"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">13.2</span>
                  </div>
                </div>
              </div>
              <p className="text-center mt-1 text-[10px]">Low volatility</p>
            </CardContent>
          </Card>

          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Top Gainers</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="truncate">NVIDIA</span>
                  <span className="font-medium text-green-500">+2.85%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="truncate">AMD</span>
                  <span className="font-medium text-green-500">+2.33%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fourth Column - Asian Indices and News */}
        <div className="flex flex-col gap-4">
          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs sm:text-sm font-medium">Asian Indices</CardTitle>
              <GlobeIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="text-xs sm:text-sm">
              <IndexItem name="Nikkei 225" value={33445.66} change={1.67} />
              <IndexItem name="Hang Seng" value={16401.04} change={-0.13} />
              <IndexItem name="Shanghai Composite" value={3021.55} change={0.23} />
              <IndexItem name="KOSPI" value={2514.96} change={0.83} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
