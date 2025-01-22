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
import { CustomTooltip } from '../CustomTooltip'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t(termName)} {t('inv_growth')}</CardTitle>
        <CardDescription>
          {t('init_deposit_summary', 
          {init: principal.toLocaleString(), month: monthlyRate.toFixed(2), term: months })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                label={{ value: t('months'), position: 'insideBottom', offset: -5 }}
                ticks={[
                  0,
                  Math.floor(months / 4),
                  Math.floor(months / 2),
                  Math.floor((3 * months) / 4),
                  months,
                ]}
              />
              <YAxis label={{ value: t('amount_usd'), angle: -90, position: 'insideLeft' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="blue" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <p className="text-sm font-semibold">{t('final_amount', {final: finalAmount.toLocaleString()})}</p>
          <p className="text-sm font-semibold">
            {t('total_interest', {total: totalInterestEarned.toLocaleString()})}
          </p>
          <p className="text-sm font-semibold">
            {t('x_times')} {(finalAmount / principal).toLocaleString()}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
