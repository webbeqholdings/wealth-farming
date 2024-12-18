'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Calendar, Loader2 } from 'lucide-react'

interface Holiday {
  name: string
  [key: string]: string
}

interface HolidayData {
  holidays: Holiday[]
}

export function MarketHolidays() {
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const response = await fetch('/api/market-holidays')
        if (!response.ok) {
          throw new Error('Failed to fetch holiday data')
        }
        const data: HolidayData = await response.json()
        setHolidays(data.holidays)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load holiday data. Please try again later.')
        setIsLoading(false)
      }
    }

    fetchHolidays()
  }, [])

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

  const renderYearContent = (year: string) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[200px]">Holiday</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {holidays.map((holiday) => (
          <TableRow key={holiday.name}>
            <TableCell className="font-medium">{holiday.name}</TableCell>
            <TableCell>{holiday[year]}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-6 w-6" />
          Market Holidays
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="2024" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="2024">2024</TabsTrigger>
            <TabsTrigger value="2025">2025</TabsTrigger>
            <TabsTrigger value="2026">2026</TabsTrigger>
          </TabsList>
          <TabsContent value="2024">{renderYearContent('2024')}</TabsContent>
          <TabsContent value="2025">{renderYearContent('2025')}</TabsContent>
          <TabsContent value="2026">{renderYearContent('2026')}</TabsContent>
        </Tabs>
        <div className="mt-4 text-sm text-muted-foreground">
          <p>* Each exchange will be closed.</p>
          <p>
            ** Each exchange will be closed (The NYSE will have an early close at 1:00 p.m. on
            Friday, November 29, 2024).
          </p>
          <p>
            *** Each exchange will be closed (The NYSE will have an early close at 1:00 p.m. on
            Tuesday, December 24, 2024).
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
