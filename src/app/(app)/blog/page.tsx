'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

// Mock data for news articles
const newsArticles = [
  {
    id: 1,
    title: 'New Technology Breakthrough',
    excerpt: 'Scientists have made a groundbreaking discovery in quantum computing...',
    date: '2023-06-01',
    readTime: '5 min',
    category: 'Technology',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 2,
    title: 'Global Climate Summit Concludes',
    excerpt: 'World leaders have agreed on new measures to combat climate change...',
    date: '2023-05-28',
    readTime: '7 min',
    category: 'Environment',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 3,
    title: 'Economic Outlook for 2024',
    excerpt: 'Economists predict steady growth despite ongoing challenges...',
    date: '2023-05-25',
    readTime: '6 min',
    category: 'Economy',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 4,
    title: 'Advancements in Renewable Energy',
    excerpt: 'New solar panel technology promises to double energy efficiency...',
    date: '2023-05-22',
    readTime: '4 min',
    category: 'Technology',
    image: '/placeholder.svg?height=200&width=400',
  },
  {
    id: 5,
    title: 'Space Exploration Milestone',
    excerpt: 'NASA announces plans for the first crewed mission to Mars...',
    date: '2023-05-20',
    readTime: '8 min',
    category: 'Science',
    image: '/placeholder.svg?height=200&width=400',
  },
]

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 3
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const currentArticles = newsArticles.slice(indexOfFirstArticle, indexOfLastArticle)

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Latest News</h1>

        {/* Featured Article */}
        <Card className="mb-12">
          <CardContent className="p-0">
            <div className="md:flex">
              <div className="md:w-2/3 relative h-64 md:h-auto">
                <Image
                  src={newsArticles[0].image}
                  alt={newsArticles[0].title}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                />
              </div>
              <div className="md:w-1/3 p-6">
                <Badge>{newsArticles[0].category}</Badge>
                <CardTitle className="mt-4 mb-2">{newsArticles[0].title}</CardTitle>
                <CardDescription>{newsArticles[0].excerpt}</CardDescription>
                <div className="flex items-center mt-4 text-sm text-gray-500">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{newsArticles[0].date}</span>
                  <ClockIcon className="ml-4 mr-2 h-4 w-4" />
                  <span>{newsArticles[0].readTime} read</span>
                </div>
                <Button className="mt-4" asChild>
                  <Link href={`/news/${newsArticles[0].id}`}>Read More</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* News Articles List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
          {currentArticles.slice(1).map((article) => (
            <Card key={article.id}>
              <CardHeader className="p-0">
                <div className="relative h-48">
                  <Image
                    src={article.image}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Badge>{article.category}</Badge>
                <CardTitle className="mt-2 mb-2">{article.title}</CardTitle>
                <CardDescription>{article.excerpt}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{article.date}</span>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/news/${article.id}`}>Read More</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* Pagination */}
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
              />
            </PaginationItem>
            {[...Array(Math.ceil(newsArticles.length / articlesPerPage))].map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink
                  href="#"
                  onClick={() => setCurrentPage(i + 1)}
                  isActive={currentPage === i + 1}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() =>
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, Math.ceil(newsArticles.length / articlesPerPage)),
                  )
                }
                className={
                  currentPage === Math.ceil(newsArticles.length / articlesPerPage)
                    ? 'pointer-events-none opacity-50'
                    : ''
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
      <SiteFooter />
    </>
  )
}
