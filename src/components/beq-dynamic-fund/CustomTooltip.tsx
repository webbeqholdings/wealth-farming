import { useTranslation } from 'react-i18next'

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{
    name: string
    value: number
  }>
  label?: string
}

export const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  const { t } = useTranslation()
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border p-4 rounded-lg shadow-md">
        <p className="font-bold">{t('month')}: {label}</p>
        <p className="text-blue-500">{t('amount')}: ${payload[0].value.toLocaleString()}</p>
      </div>
    )
  }
  return null
}
