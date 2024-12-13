import { useMemo } from 'react'
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

interface CompoundInterestCalculatorProps {
  principal: number
  monthlyRate: number
  months: number
  termName: string
}

export function CompoundInterestCalculator({
  principal,
  monthlyRate,
  months,
  termName,
}: CompoundInterestCalculatorProps) {
  const chartData = useMemo(() => {
    return Array.from({ length: months + 1 }, (_, i) => ({
      month: i,
      amount: parseFloat((principal * Math.pow(1 + monthlyRate / 100, i)).toFixed(2)),
    }))
  }, [principal, monthlyRate, months])

  const finalAmount = chartData[chartData.length - 1].amount
  const totalInterestEarned = finalAmount - principal

  return (
    <Card>
      <CardHeader>
        <CardTitle>{termName} Investment Growth</CardTitle>
        <CardDescription>
          Initial Deposit: ${principal.toLocaleString()}, Monthly Rate: {monthlyRate.toFixed(2)}%,
          Term: {months} months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{ value: 'Months', position: 'insideBottom', offset: -5 }}
                ticks={[
                  0,
                  Math.floor(months / 4),
                  Math.floor(months / 2),
                  Math.floor((3 * months) / 4),
                  months,
                ]}
              />
              <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="blue" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold">Final Amount: ${finalAmount.toLocaleString()}</p>
          <p className="text-sm font-semibold">
            Total Interest Earned: ${totalInterestEarned.toLocaleString()}
          </p>
          <p className="text-sm font-semibold">
            X times: {(finalAmount / principal).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
  }>
  label?: string
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-4 rounded-lg shadow-md">
        <p className="font-bold">Month: {label}</p>
        <p className="text-blue-500">Amount: ${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}
