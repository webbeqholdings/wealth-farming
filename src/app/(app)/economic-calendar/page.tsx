'use client'

import { useState, useMemo } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Event = {
  id: string
  date: Date
  time: string
  currency: string
  event: string
  impact: 'Low' | 'Medium' | 'High'
  actual: string
  forecast: string
  previous: string
}

const events: Event[] = [
  {
    id: '1',
    date: new Date(2024, 10, 15),
    time: '14:30 GMT',
    currency: 'USD',
    event: 'CPI m/m',
    impact: 'High',
    actual: '0.2%',
    forecast: '0.3%',
    previous: '0.4%',
  },
  {
    id: '2',
    date: new Date(2024, 10, 15),
    time: '14:30 GMT',
    currency: 'USD',
    event: 'Core CPI m/m',
    impact: 'High',
    actual: '0.3%',
    forecast: '0.3%',
    previous: '0.2%',
  },
  {
    id: '3',
    date: new Date(2024, 10, 16),
    time: '19:00 GMT',
    currency: 'USD',
    event: 'FOMC Statement',
    impact: 'High',
    actual: '',
    forecast: '',
    previous: '',
  },
  {
    id: '4',
    date: new Date(2024, 10, 17),
    time: '13:30 GMT',
    currency: 'EUR',
    event: 'ECB Press Conference',
    impact: 'High',
    actual: '',
    forecast: '',
    previous: '',
  },
  {
    id: '5',
    date: new Date(2024, 10, 17),
    time: '09:30 GMT',
    currency: 'GBP',
    event: 'Retail Sales m/m',
    impact: 'Medium',
    actual: '',
    forecast: '0.4%',
    previous: '-0.3%',
  },
]

export default function EconomicCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCurrency, setSelectedCurrency] = useState<string | undefined>(undefined)

  const filteredEvents = useMemo(
    () =>
      events.filter(
        (event) =>
          (!date || event.date.toDateString() === date.toDateString()) &&
          (!selectedCurrency || event.currency === selectedCurrency),
      ),
    [date, selectedCurrency],
  )

  const currencies = useMemo(() => Array.from(new Set(events.map((event) => event.currency))), [])

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
  }

  const handleCurrencySelect = (currency: string) => {
    setSelectedCurrency(currency === 'all' ? undefined : currency)
  }

  const clearFilters = () => {
    setDate(undefined)
    setSelectedCurrency(undefined)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Economic Calendar</h1>
      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
            <CardDescription>Select date and currency</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              className="rounded-md border shadow"
            />
            <Select onValueChange={handleCurrencySelect} value={selectedCurrency || 'all'}>
              <SelectTrigger>
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currencies</SelectItem>
                {currencies.map((currency) => (
                  <SelectItem key={currency} value={currency}>
                    {currency}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={clearFilters} variant="outline" className="w-full">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Economic Events</CardTitle>
            <CardDescription>
              Showing events for {date ? date.toDateString() : 'all dates'}
              {selectedCurrency ? ` in ${selectedCurrency}` : ''}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Currency</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Impact</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Forecast</TableHead>
                  <TableHead>Previous</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.date.toDateString()}</TableCell>
                    <TableCell>{event.time}</TableCell>
                    <TableCell>{event.currency}</TableCell>
                    <TableCell>{event.event}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          event.impact === 'High'
                            ? 'destructive'
                            : event.impact === 'Medium'
                              ? 'warning'
                              : 'secondary'
                        }
                      >
                        {event.impact}
                      </Badge>
                    </TableCell>
                    <TableCell>{event.actual}</TableCell>
                    <TableCell>{event.forecast}</TableCell>
                    <TableCell>{event.previous}</TableCell>
                  </TableRow>
                ))}
                {filteredEvents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No events found for the selected date and currency.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
