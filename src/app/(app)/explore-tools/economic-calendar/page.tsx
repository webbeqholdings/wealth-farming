'use client'

import { useState, useEffect } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useTranslation } from 'react-i18next'
import { format } from 'date-fns'
import { ChatBot } from '@/components/botpress/ChatBot'

type Event = {
  id: string
  date: Date
  time: string
  currency: string
  event: string
  impact: 'Low' | 'Medium' | 'High'
}

export default function EconomicCalendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [date, setDate] = useState<Date | undefined>(new Date())
  const { t } = useTranslation()
  const { i18n } = useTranslation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); 
    const lang = queryParams.get('locale') || 'en'; 
    i18n.changeLanguage(lang);  
  }, []);

  useEffect(() => {
    // Fetch data from the API based on the selected date
    const fetchEvents = async () => {
      if (!date) return // Don't fetch if no date is selected

      // Format the selected date as the start of the day (ISO format)
      const startOfDay = new Date(date.setHours(0, 0, 0, 0)).toISOString()
      const endOfDay = new Date(date.setHours(23, 59, 59, 999)).toISOString()

      try {
        const response = await fetch(
          `/api/economic-calendar?where[createdAt][greater_than]=${startOfDay}&where[createdAt][less_than]=${endOfDay}`,
        )

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const data = await response.json()

        // Map the response to the Event template form
        const mappedEvents = data.docs.map((item: any) => ({
          id: item.id.toString(),
          date: new Date(item.createdAt), // Convert to Date object
          time: item.time || 'N/A', // Handle missing time
          currency: item.unit?.unit_code || 'N/A', // Handle missing unit
          event: item.title || 'No title available', // Handle missing title
          impact: item.impact || 'Low', // Default to 'Low' if impact is missing
        }))

        setEvents(mappedEvents)
      } catch (error) {
        console.error('Error fetching events:', error)
      }
    }

    fetchEvents()
  }, [date]) // Re-run whenever the selected date changes

  const handleDateSelect = (newDate: Date | undefined) => {
    setDate(newDate)
  }

  const clearFilters = async () => {
    setDate(undefined)

    try {
      // Fetch all data without filtering by date
      const response = await fetch('/api/economic-calendar')

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      // Map the response to the Event template form
      const mappedEvents = data.docs.map((item: any) => ({
        id: item.id.toString(),
        date: new Date(item.createdAt), // Convert to Date object
        time: item.time || 'N/A', // Handle missing time
        currency: item.unit?.unit_code || 'N/A', // Handle missing unit
        event: item.title || 'No title available', // Handle missing title
        impact: item.impact || 'Low', // Default to 'Low' if impact is missing
      }))

      setEvents(mappedEvents)
    } catch (error) {
      console.error('Error fetching all events:', error)
    }
  }

  return (
    <>
      <SiteHeader />
      <div className='container mx-auto py-8'>
        <h1 className='text-3xl font-bold mb-6'>{t('econ_calendar')}</h1>
        <div className='grid gap-6 md:grid-cols-[300px_1fr]'>
          <Card>
            <CardHeader>
              <CardTitle>{t('filters')}</CardTitle>
              <CardDescription>{t('select_date_currency')}</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <Calendar
                mode='single'
                selected={date}
                onSelect={handleDateSelect}
                className='rounded-md border shadow'
              />
              <Button onClick={clearFilters} variant='outline' className='w-full'>
                {t('clear_filters')}
              </Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>{t('econ_events')}</CardTitle>
              <CardDescription>
                {t('showing_events_for', {day: t(date ? format(date, 'd/MM/yyy') : 'all_dates')})}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('time')}</TableHead>
                    <TableHead>{t('currency')}</TableHead>
                    <TableHead>{t('event')}</TableHead>
                    <TableHead>{t('impact')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {events && events.length > 0 ? (
                    events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.date.toDateString()}</TableCell>
                        <TableCell>{event.time}</TableCell>
                        <TableCell>{event.currency}</TableCell>
                        <TableCell>{event.event}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              event.impact === 'High'
                                ? 'destructive' // High -> destructive
                                : event.impact === 'Medium'
                                  ? 'default' // Medium -> default
                                  : 'secondary' // Low -> secondary
                            }
                          >
                            {event.impact}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className='text-center'>
                        {t('no_events_found')}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
      <div>
          <ChatBot />
        </div>
      <SiteFooter />
    </>
  )
}
