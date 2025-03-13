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

interface ContractEquityChartProps {
  contractId: string
}

export default function ContractEquityChart({ contractId }: ContractEquityChartProps) {
  // In a real app, you would fetch this data based on the contractId
  const contractData = contractEquityData.find((data) => data.contractId === contractId)?.data || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contract Equity Performance</CardTitle>
        <CardDescription>Monthly equity growth for this contract.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={contractData}
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
                dataKey="value"
                name="Contract Value"
                stroke="#8884d8"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="cost"
                name="Operational Cost"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="profit"
                name="Net Profit"
                stroke="#ffc658"
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

// Sample data - in a real app, this would come from a database
const contractEquityData = [
  {
    contractId: 'CTR-7890',
    data: [
      { month: 'Jan', value: 37500, cost: 5000, profit: 32500 },
      { month: 'Feb', value: 37500, cost: 8000, profit: 29500 },
      { month: 'Mar', value: 37500, cost: 12000, profit: 25500 },
      { month: 'Apr', value: 75000, cost: 15000, profit: 60000 },
      { month: 'May', value: 75000, cost: 20000, profit: 55000 },
      { month: 'Jun', value: 75000, cost: 22500, profit: 52500 },
      { month: 'Jul', value: 75000, cost: 34500, profit: 40500 },
      { month: 'Aug', value: 75000, cost: 42500, profit: 32500 },
      { month: 'Sep', value: 75000, cost: 45000, profit: 30000 },
      { month: 'Oct', value: 125000, cost: 48000, profit: 77000 },
      { month: 'Nov', value: 125000, cost: 50000, profit: 75000 },
      { month: 'Dec', value: 125000, cost: 52000, profit: 73000 },
    ],
  },
  {
    contractId: 'CTR-7891',
    data: [
      { month: 'Feb', value: 25500, cost: 3000, profit: 22500 },
      { month: 'Mar', value: 25500, cost: 5000, profit: 20500 },
      { month: 'Apr', value: 25500, cost: 7500, profit: 18000 },
      { month: 'May', value: 51000, cost: 12000, profit: 39000 },
      { month: 'Jun', value: 51000, cost: 16500, profit: 34500 },
      { month: 'Jul', value: 51000, cost: 22500, profit: 28500 },
      { month: 'Aug', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Sep', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Oct', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Nov', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Dec', value: 51000, cost: 25000, profit: 26000 },
      { month: 'Jan', value: 51000, cost: 25000, profit: 26000 },
    ],
  },
  {
    contractId: 'CTR-7892',
    data: [
      { month: 'Mar', value: 19500, cost: 2000, profit: 17500 },
      { month: 'Apr', value: 19500, cost: 4000, profit: 15500 },
      { month: 'May', value: 19500, cost: 6000, profit: 13500 },
      { month: 'Jun', value: 19500, cost: 8000, profit: 11500 },
      { month: 'Jul', value: 19500, cost: 10000, profit: 9500 },
      { month: 'Aug', value: 19500, cost: 12000, profit: 7500 },
      { month: 'Sep', value: 19500, cost: 14000, profit: 5500 },
      { month: 'Oct', value: 19500, cost: 16000, profit: 3500 },
      { month: 'Nov', value: 19500, cost: 18000, profit: 1500 },
      { month: 'Dec', value: 19500, cost: 19000, profit: 500 },
      { month: 'Jan', value: 19500, cost: 19000, profit: 500 },
      { month: 'Feb', value: 19500, cost: 19000, profit: 500 },
    ],
  },
  {
    contractId: 'CTR-7893',
    data: [
      { month: 'Apr', value: 13500, cost: 1500, profit: 12000 },
      { month: 'May', value: 13500, cost: 3000, profit: 10500 },
      { month: 'Jun', value: 13500, cost: 4500, profit: 9000 },
      { month: 'Jul', value: 13500, cost: 6000, profit: 7500 },
      { month: 'Aug', value: 13500, cost: 7500, profit: 6000 },
      { month: 'Sep', value: 13500, cost: 9000, profit: 4500 },
      { month: 'Oct', value: 13500, cost: 10500, profit: 3000 },
      { month: 'Nov', value: 13500, cost: 12000, profit: 1500 },
      { month: 'Dec', value: 13500, cost: 13000, profit: 500 },
      { month: 'Jan', value: 13500, cost: 13000, profit: 500 },
      { month: 'Feb', value: 13500, cost: 13000, profit: 500 },
      { month: 'Mar', value: 13500, cost: 13000, profit: 500 },
    ],
  },
]
