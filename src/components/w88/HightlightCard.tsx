import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface HighlightCardProps {
  title: string
  value: string
  description: string
  icon: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  className?: string
}

export function HighlightCard({
  title,
  value,
  description,
  icon,
  trend,
  className,
}: HighlightCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="border-b border-border/20 flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
        {trend && (
          <div
            className={cn(
              'text-xs font-medium mt-2',
              trend.isPositive ? 'text-green-500' : 'text-red-500',
            )}
          >
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </CardContent>
    </Card>
  )
}
