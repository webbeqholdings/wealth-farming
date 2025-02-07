'use client'

import { useState, useEffect } from 'react'
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
import { useTranslation } from 'react-i18next'

// Mock data for news articles
type Author = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_contact: string;
  date_of_birth: string;
  nation: string;
  gender: string;
  email_verified: boolean;
};

type Category = {
  id: number;
  name: string;
  slug: string;
};

type Tag = {
  id: number;
  name: string;
  slug: string;
};

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
  author: Author;
  published_date: string;
  category: Category;
  tags: Tag;
  content: Content;
  status: string;
  featured_image: {url: string};
  excerpt: string;  // Added missing 'excerpt'
  date: string;  // Added missing 'date'
  readTime: string;  // Added missing 'readTime'
  image: string;  // Added missing 'image' for the featured article
};

type NewsArticles = Blog[]; // Assuming `newsArticles` is an array of products

export default function NewsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const articlesPerPage = 3
  const indexOfLastArticle = currentPage * articlesPerPage
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage
  const [newsArticles, setNewsArticles] = useState<NewsArticles>([]);
  const { t } = useTranslation();
  const { i18n } = useTranslation();
  const locale = i18n.language;

  // Fetch data from the API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/posts?locale=${locale}&limit=1000`);
        const data = await response.json();

        // Assuming the response has a `docs` array with the products
        const articles = data.docs.map((item: Blog) => ({
          id: item.id,
          slug: item.slug,
          title: item.title,
          author: item.author,
          published_date: item.published_date,
          category: item.category,
          tags: item.tags,
          content: item.content,
          status: item.status,
          featured_image: item.featured_image,
          excerpt: item.excerpt,  // Ensure your API returns this
          date: item.published_date,  // Assuming 'published_date' is your date
          readTime: item.readTime,  // Ensure your API returns this
          image: item.image,  // Ensure your API returns this image URL
        }));

        // Set the fetched articles to state
        setNewsArticles(articles);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [locale]); // Empty dependency array means this will run once when the component mounts
  
  const currentArticles = newsArticles.slice(indexOfFirstArticle, indexOfLastArticle)

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">{t('lastest_news')}</h1>

        {/* Featured Article */}
        {newsArticles && newsArticles.length > 0 && (
          <Card className="mb-12">
            <CardContent className="p-0">
              <div className="md:flex">
                <div className="md:w-2/3 relative h-64 md:h-auto">
                  <Image
                    src={newsArticles[0].featured_image?.url}
                    alt={newsArticles[0].title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
                <div className="md:w-1/3 p-6">
                  <Badge>{newsArticles[0].category.name}</Badge>
                  <CardTitle className="mt-4 mb-2">{newsArticles[0].title}</CardTitle>
                  <CardDescription>{newsArticles[0].excerpt}</CardDescription>
                  <div className="flex items-center mt-4 text-sm text-gray-500">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span>{new Date(newsArticles[0].date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <Button className="mt-4" asChild>
                    <Link href={`/blog/${newsArticles[0].slug}`}>{t('read_more')}</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* News Articles List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 mb-8">
          {currentArticles.map((article) => (
            <Card key={article.id}>
              <CardHeader className="p-0">
                <div className="relative h-48">
                  <Image
                    src={article.featured_image?.url}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className="rounded-t-lg"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Badge>{article.category.name}</Badge>
                <CardTitle className="mt-2 mb-2">{article.title}</CardTitle>
                <CardDescription>{article.excerpt}</CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between items-center">
                <div className="flex items-center text-sm text-gray-500">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  <span>{new Date(article.date).toLocaleDateString('vi-VN')}</span>
                </div>
                <Button variant="outline" asChild>
                  <Link href={`/blog/${article.slug}`}>{t('read_more')}</Link>
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
