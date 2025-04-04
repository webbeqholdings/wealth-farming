'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

export default function EquityChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Equity Performance</CardTitle>
        <CardDescription>Monthly equity growth over the past year.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={equityData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 10,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
              <XAxis
                dataKey="month"
                stroke="rgba(255, 255, 255, 0.5)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="rgba(255, 255, 255, 0.5)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '6px',
                  color: 'white',
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                labelStyle={{ color: 'rgba(255, 255, 255, 0.7)' }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '10px' }}
                formatter={(value) => (
                  <span style={{ color: 'rgba(255, 255, 255, 0.7)' }}>{value}</span>
                )}
              />
              <Line
                type="monotone"
                dataKey="equity"
                name="Total Equity"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="investments"
                name="Investments"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

// Sample data
const equityData = [
  { month: 'Apr', equity: 67000, investments: 45000 },
  { month: 'May', equity: 75800, investments: 48000 },
  { month: 'Jun', equity: 93400, investments: 52000 },
  { month: 'Jul', equity: 102500, investments: 55000 },
  { month: 'Aug', equity: 108700, investments: 58000 },
  { month: 'Sep', equity: 120000, investments: 62000 },
  { month: 'Oct', equity: 135800, investments: 68000 },
  { month: 'Nov', equity: 147200, investments: 72000 },
  { month: 'Dec', equity: 160500, investments: 76000 },
  { month: 'Jan', equity: 169300, investments: 80000 },
  { month: 'Feb', equity: 180100, investments: 85000 },
  { month: 'Mar', equity: 192800, investments: 90000 },
]
