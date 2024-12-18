'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

interface MarketData {
  [year: string]: {
    months: {
      [month: string]: number
    }
    total: number
  }
}

export function MarketWorkingDays() {
  const [activeYear, setActiveYear] = useState('2024')
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/market-working-days')
        if (!response.ok) {
          throw new Error('Failed to fetch market data')
        }
        const data = await response.json()
        setMarketData(data)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load market data. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const renderYearContent = (year: string) => {
    if (!marketData) return null

    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Working Days {year}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Working Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(marketData[year].months).map(([month, days]) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell>
                  <TableCell>{days}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right font-bold">Total: {marketData[year].total} days</div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    )
  }

  return (
    <Tabs defaultValue="2024" className="w-full max-w-3xl mx-auto">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="2024" onClick={() => setActiveYear('2024')}>
          2024
        </TabsTrigger>
        <TabsTrigger value="2025" onClick={() => setActiveYear('2025')}>
          2025
        </TabsTrigger>
        <TabsTrigger value="2026" onClick={() => setActiveYear('2026')}>
          2026
        </TabsTrigger>
      </TabsList>
      <TabsContent value="2024">{renderYearContent('2024')}</TabsContent>
      <TabsContent value="2025">{renderYearContent('2025')}</TabsContent>
      <TabsContent value="2026">{renderYearContent('2026')}</TabsContent>
    </Tabs>
  )
}
