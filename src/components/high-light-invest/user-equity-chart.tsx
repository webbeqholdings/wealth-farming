"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useEffect, useState } from "react"
import { getUserEquityData } from "@/lib/high-light-invest-hooks"

interface UserEquityChartProps {
    userId: string
}

export default function UserEquityChart({ userId }: UserEquityChartProps) {
    const [chartData, setChartData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEquityData() {
            try {
                const data = await getUserEquityData(userId)
                setChartData(data)
            } catch (error) {
                console.error("Error fetching equity data:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEquityData()
    }, [userId])

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Equity Performance</CardTitle>
                    <CardDescription>Loading equity data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Equity Performance</CardTitle>
                    <CardDescription>No equity data available for this user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center text-muted-foreground">No data to display</div>
                </CardContent>
            </Card>
        )
    }

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
                            data={chartData}
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
                                    backgroundColor: "rgba(17, 24, 39, 0.9)",
                                    border: "1px solid rgba(255, 255, 255, 0.1)",
                                    borderRadius: "6px",
                                    color: "white",
                                }}
                                formatter={(value) => [`$${value.toLocaleString()}`, undefined]}
                                labelStyle={{ color: "rgba(255, 255, 255, 0.7)" }}
                            />
                            <Legend
                                wrapperStyle={{ paddingTop: "10px" }}
                                formatter={(value) => <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>{value}</span>}
                            />
                            <Line
                                type="monotone"
                                dataKey="equity"
                                name="Total Equity"
                                stroke="#f5c842"
                                strokeWidth={2}
                                dot={{ r: 4, strokeWidth: 2 }}
                                activeDot={{ r: 1, strokeWidth: 1 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
