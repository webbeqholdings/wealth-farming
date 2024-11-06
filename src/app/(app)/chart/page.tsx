'use client'

import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
} from '@/components/ui/chart'

// export const description = 'A linear line chart'

// Dữ liệu mở rộng từ T1 2015 đến T1 2024, với năm điểm mỗi năm và giá trị trong khoảng từ 10,000 đến 30,000
const chartData = [
  { year: '2015', month: 'T1', data: 12000, index: 10500 },
  { year: '2015', month: 'T2', data: 15000, index: 11200 },
  { year: '2015', month: 'T3', data: 17000, index: 11800 },
  { year: '2015', month: 'T4', data: 14500, index: 12500 },
  { year: '2015', month: 'T5', data: 16000, index: 13000 },
  { year: '2016', month: 'T1', data: 18000, index: 13500 },
  { year: '2016', month: 'T2', data: 19000, index: 14000 },
  { year: '2016', month: 'T3', data: 22000, index: 14500 },
  { year: '2016', month: 'T4', data: 20500, index: 15000 },
  { year: '2016', month: 'T5', data: 23000, index: 15500 },
  { year: '2017', month: 'T1', data: 21000, index: 16000 },
  { year: '2017', month: 'T2', data: 24000, index: 16500 },
  { year: '2017', month: 'T3', data: 25000, index: 17000 },
  { year: '2017', month: 'T4', data: 23500, index: 17500 },
  { year: '2017', month: 'T5', data: 26000, index: 18000 },
  { year: '2018', month: 'T1', data: 27000, index: 18500 },
  { year: '2018', month: 'T2', data: 28000, index: 19000 },
  { year: '2018', month: 'T3', data: 27500, index: 19500 },
  { year: '2018', month: 'T4', data: 29000, index: 20000 },
  { year: '2018', month: 'T5', data: 28500, index: 21000 },
  { year: '2019', month: 'T1', data: 30000, index: 22000 },
  { year: '2019', month: 'T2', data: 29500, index: 22500 },
  { year: '2019', month: 'T3', data: 29000, index: 23000 },
  { year: '2019', month: 'T4', data: 28000, index: 23500 },
  { year: '2019', month: 'T5', data: 27500, index: 24000 },
  { year: '2020', month: 'T1', data: 26500, index: 24500 },
  { year: '2020', month: 'T2', data: 25500, index: 25000 },
  { year: '2020', month: 'T3', data: 26000, index: 25500 },
  { year: '2020', month: 'T4', data: 25000, index: 26000 },
  { year: '2020', month: 'T5', data: 24000, index: 26500 },
  { year: '2021', month: 'T1', data: 23500, index: 27000 },
  { year: '2021', month: 'T2', data: 22500, index: 27500 },
  { year: '2021', month: 'T3', data: 21500, index: 28000 },
  { year: '2021', month: 'T4', data: 21000, index: 28500 },
  { year: '2021', month: 'T5', data: 20000, index: 29000 },
  { year: '2022', month: 'T1', data: 19000, index: 29500 },
  { year: '2022', month: 'T2', data: 18500, index: 30000 },
  { year: '2022', month: 'T3', data: 17500, index: 29500 },
  { year: '2022', month: 'T4', data: 16500, index: 29000 },
  { year: '2022', month: 'T5', data: 15500, index: 28500 },
  { year: '2023', month: 'T1', data: 15000, index: 28000 },
  { year: '2023', month: 'T2', data: 14000, index: 27500 },
  { year: '2023', month: 'T3', data: 13500, index: 27000 },
  { year: '2023', month: 'T4', data: 12500, index: 26500 },
  { year: '2023', month: 'T5', data: 12000, index: 26000 },
  { year: '2024', month: 'T1', data: 11000, index: 25500 },
  { year: '2024', month: 'T2', data: 10500, index: 25000 },
  { year: '2024', month: 'T3', data: 10000, index: 24500 },
  { year: '2024', month: 'T4', data: 9500, index: 24000 },
  { year: '2024', month: 'T5', data: 9000, index: 23500 },
]

const chartConfig = {
  data: {
    label: 'Data',
    color: 'hsl(var(--chart-1))',
  },
  index: {
    label: 'Index',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig

const IndexPage = () => {
  return (
    <div className="container relative">
      <Card>
        <CardHeader>
          <CardTitle>Line Chart - Linear</CardTitle>
          <CardDescription>2015 - 2024</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 30, // Tăng khoảng cách để nhường chỗ cho nhãn trục y
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="year"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value, index) => {
                  const item = chartData[index]
                  return item.month === 'T1' ? `${item.month} ${value}` : ''
                }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                label={{
                  value: 'Số lượng',
                  angle: -90,
                  position: 'insideLeft',
                  dy: -10,
                  dx: -10,
                  style: { textAnchor: 'middle', fill: '#666' },
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const { year, month, data, index } = payload[0].payload
                    return (
                      <div
                        style={{
                          padding: '8px',
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          borderRadius: '8px',
                          border: '1px solid #e2e8f0',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          fontSize: '0.875rem',
                          color: '#1a202c',
                        }}
                      >
                        <p
                          style={{
                            fontWeight: '600',
                            color: '#2d3748',
                            marginBottom: '4px',
                          }}
                        >
                          {`${month} ${year}`}
                        </p>
                        <p style={{ margin: 0, color: '#4a5568' }}>
                          <span style={{ fontWeight: '500' }}>Data:</span> {data.toLocaleString()}
                        </p>
                        <p style={{ margin: 0, color: '#4a5568' }}>
                          <span style={{ fontWeight: '500' }}>Index:</span> {index.toLocaleString()}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />
              <Line
                dataKey="data"
                type="linear"
                stroke="var(--color-data)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="index"
                type="linear"
                stroke="var(--color-index)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Showing total visitors for the last 10 years
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

export default IndexPage
