'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CalendarIcon, MapPinIcon, ClockIcon } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const events = [
  {
    id: 1,
    title: 'Annual Tech Summit 2024',
    description: 'Join industry leaders for a day of innovation and networking.',
    date: '2024-03-15',
    time: '9:00 AM - 5:00 PM',
    location: 'San Francisco, CA',
    category: 'Technology',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 2,
    title: 'Global Climate Conference',
    description: 'Addressing climate change through collaborative action and policy.',
    date: '2024-04-22',
    time: '10:00 AM - 6:00 PM',
    location: 'New York, NY',
    category: 'Environment',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 3,
    title: 'Startup Pitch Competition',
    description: 'Witness innovative startups compete for funding and mentorship.',
    date: '2024-05-10',
    time: '1:00 PM - 7:00 PM',
    location: 'Austin, TX',
    category: 'Business',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 4,
    title: 'AI and Machine Learning Symposium',
    description: 'Explore the latest advancements in AI and machine learning.',
    date: '2024-06-05',
    time: '9:30 AM - 4:30 PM',
    location: 'Boston, MA',
    category: 'Technology',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 5,
    title: 'Sustainable Energy Forum',
    description: 'Discussing the future of renewable energy and sustainable practices.',
    date: '2024-07-18',
    time: '10:00 AM - 5:00 PM',
    location: 'Seattle, WA',
    category: 'Environment',
    image: '/placeholder.svg?height=200&width=400',
  },
]

export default function EventsPage() {
  const [filter, setFilter] = useState('all')

  const filteredEvents =
    filter === 'all' ? events : events.filter((event) => event.category.toLowerCase() === filter)

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Upcoming Events & Summits</h1>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter('all')}>
              All Events
            </TabsTrigger>
            <TabsTrigger value="technology" onClick={() => setFilter('technology')}>
              Technology
            </TabsTrigger>
            <TabsTrigger value="environment" onClick={() => setFilter('environment')}>
              Environment
            </TabsTrigger>
            <TabsTrigger value="business" onClick={() => setFilter('business')}>
              Business
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="flex flex-col">
              <CardHeader className="p-0">
                <div className="relative h-48">
                  <Image
                    src={event.image}
                    alt={event.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="flex-grow p-6">
                <Badge>{event.category}</Badge>
                <CardTitle className="mt-2 mb-2">{event.title}</CardTitle>
                <CardDescription>{event.description}</CardDescription>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <ClockIcon className="mr-2 h-4 w-4" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPinIcon className="mr-2 h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button asChild className="w-full">
                  <Link href={`/events/${event.id}`}>Learn More & Register</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
