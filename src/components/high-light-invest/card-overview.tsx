"use client"

import { BarChart3, DollarSign, TrendingUp, Users } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { OverviewMetric } from "@/lib/high-light-invest-hooks"

interface CardOverviewProps {
    metrics: OverviewMetric[]
}

// Icon mapping for different metric keys
const getIconForMetric = (key: string) => {
    switch (key) {
        case "hightlight_metric_1":
            return DollarSign
        case "hightlight_metric_2":
            return Users
        case "hightlight_metric_3":
            return BarChart3
        case "hightlight_metric_4":
            return TrendingUp
        default:
            return BarChart3
    }
}

// Color mapping for different metric keys
const getColorForMetric = (key: string) => {
    switch (key) {
        case "hightlight_metric_1":
            return "text-emerald-500"
        case "hightlight_metric_2":
            return "text-blue-500"
        case "hightlight_metric_3":
            return "text-purple-500"
        case "hightlight_metric_4":
            return "text-orange-500"
        default:
            return "text-gray-500"
    }
}

export default function CardOverview({ metrics }: CardOverviewProps) {
    // Ensure we have exactly 4 metrics, fill with empty ones if needed
    const displayMetrics = [...metrics]
    while (displayMetrics.length < 4) {
        displayMetrics.push({
            key: `empty_${displayMetrics.length}`,
            label: "No Data",
            value: 0,
            note: "No data available",
        })
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {displayMetrics.slice(0, 4).map((metric) => {
                const IconComponent = getIconForMetric(metric.key)
                const colorClass = getColorForMetric(metric.key)

                return (
                    <Card key={metric.key}>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">{metric.label}</CardTitle>
                            <IconComponent className={`h-4 w-4 text-muted-foreground`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {typeof metric.value === "number" ? metric.value.toLocaleString() : metric.value}
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">{metric.note}</div>
                        </CardContent>
                    </Card>
                )
            })}
        </div>
    )
}
