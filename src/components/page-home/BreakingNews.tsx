'use client'
import React, { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslation } from 'react-i18next';

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

type Content = {
  root: {
    type: string;
    format: string;
    indent: number;
    version: number;
    children: Array<{
      type: string;
      format: string;
      indent: number;
      children: Array<{ text: string; type: string }>;
    }>;
    direction: string;
  };
};

type Blog = {
  id: number;
  slug: string,
  title: string;
  content: Content;
  published_date: string;
  status: string;
  featured_image: {url: string};
  excerpt: string;  // Added missing 'excerpt'
  date: string;  // Added missing 'date'
  readTime: string;  // Added missing 'readTime'
  image: string;  // Added missing 'image' for the featured article
};

export function BreakingNewsCarousel() {
  const [newsItems, setNewsItems] = useState([]);
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const { t } = useTranslation();
  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts?locale=${locale}`); // Replace with your actual API endpoint
        const data = await response.json();

        // Transform API response to the desired format
        const formattedNews = data.docs.map((post: Blog) => ({
          title: post.title,
          content: post.content.root.children[0].children[0].text,
          date: new Date(post.published_date).toISOString().split('T')[0], // Format date as YYYY-MM-DD
          slug: post.slug,
        }));

        setNewsItems(formattedNews);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [locale]); // Empty dependency array to run only once
  return (
    <section className="py-16 bg-secondary/10">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8">{t('breaking_news')}</h2>
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
                <a className="cursor-pointer" href={`/blog/${item.slug}`}>
                <div className="p-1 h-full">
                  <Card className="h-full flex flex-col transition-colors duration-300 hover:bg-gray-100">
                    <CardHeader className="grid grid-cols-3">
                      <div className="col-span-2">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      </div>
                      <div className="font-mono text-xs text-center">
                        <Badge variant = "secondary">{item.date}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-sm text-muted-foreground">{item.content}</p>
                    </CardContent>
                  </Card>
                </div>
                </a>
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
