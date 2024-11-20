'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { name: 'Project A', volume: 4000 },
  { name: 'Project B', volume: 3000 },
  { name: 'Project C', volume: 2000 },
  { name: 'Project D', volume: 2780 },
  { name: 'Project E', volume: 1890 },
  { name: 'Project F', volume: 2390 },
  { name: 'Project G', volume: 3490 },
]

export function FundingVolumeChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Project Funding</CardTitle>
        <CardDescription>Volume of funds raised per project</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Bar
              dataKey="volume"
              fill="currentColor"
              radius={[4, 4, 0, 0]}
              className="fill-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
