import React from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const newsItems = [
  {
    title: 'BeQ Expands Green Energy Portfolio',
    content:
      'BeQ Wealth Farming Fund announces a significant investment in solar-powered agricultural technologies, marking a major step towards sustainable farming practices.',
    date: '2024-03-15',
  },
  {
    title: 'Record Returns for Q1 2024',
    content:
      'Investors celebrate as BeQ reports record-breaking returns for the first quarter, attributed to strategic investments in high-yield crops and innovative farming techniques.',
    date: '2024-04-01',
  },
  {
    title: 'New Partnership with AgriTech Startup',
    content:
      'BeQ forms strategic partnership with leading AgriTech startup to integrate AI-driven crop management systems across its farming portfolio.',
    date: '2024-04-10',
  },
  {
    title: 'Sustainable Water Management Initiative Launched',
    content:
      'BeQ introduces cutting-edge water management systems across its farms, significantly reducing water usage while increasing crop yields.',
    date: '2024-04-15',
  },
]

export function BreakingNewsCarousel() {
  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">Breaking News</h2>
        <Carousel
          opts={{
            align: 'start',
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-1">
            {newsItems.map((item, index) => (
              <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/3">
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      <Badge variant="secondary" className="font-mono text-xs">
                        {item.date}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </section>
  )
}
