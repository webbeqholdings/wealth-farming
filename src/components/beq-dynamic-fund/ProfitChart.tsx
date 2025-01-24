import { useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { CustomTooltip } from './CustomTooltip'

interface ProfitData {
  time: Date
  balance: number
}

interface ProfitChartProps {
  profitData: ProfitData[]
}

export function ProfitChart({ profitData }: ProfitChartProps) {
  const formatDate = (date: Date) => {
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${month}/${year}`
  }

  const chartData = useMemo(() => {
    return profitData.map((item) => ({
      time: formatDate(item.time),
      balance: item.balance,
    }))
  }, [profitData])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" label={{ value: 'Time', position: 'insideBottom', offset: -5 }} />
        <YAxis
          label={{
            value: 'Balance ($)',
            angle: -90,
            position: 'insideLeft',
            dx: -8, // Shift the label to the left by 5px
          }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="balance" stroke="blue" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
