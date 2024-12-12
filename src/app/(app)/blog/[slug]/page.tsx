'use client'
import React, { useState, useEffect } from 'react';
import { renderContent } from '@/components/contentRender';
import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { useParams } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { SiteHeader } from '@/components/site-header';

export default function NewsDetailPage() {
  const params = useParams();
  const [article, setArticle] = useState({
    title: 'The Future of Artificial Intelligence: Promises and Perils',
    author: {
      name: 'Dr. Jane Smith',
      avatar: '/avatars/jane-smith.jpg',
      bio: 'AI researcher and professor at Tech University',
    },
    publishDate: new Date('2024-03-15'),
    category: 'Technology',
    image: '/images/ai-future.jpg',
    content: '',
    tags: [{ postTags: { id: 1, name: 'global-investment' } }, { id: 2, relatedPost: { name: 'finance' } }, { relatedPost: { id: 3, name: 'economy' } }],
    relatedArticles: [],
  });

  useEffect(() => {
    const loadArticleData = async () => {
      // Fetch the article data from API
      try {
        const response = await fetch(`/api/posts?where[slug][equals]=${params.slug}`); // API call
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        const apiData = data.docs[0];

        // Merge API data with the initial state
        setArticle(prevState => ({
          ...prevState,
          title: apiData.title,
          author: {
            name: `${apiData.author.first_name} ${apiData.author.last_name}`,
            avatar: apiData.author.avatar || '/default-avatar.jpg',
            bio: apiData.author.phone_contact, // Adjust as needed
          },
          publishDate: new Date(apiData.published_date),
          category: apiData.category.name,
          content: apiData.content.root.children.map((child: any) => renderContent(child)).join(' '),
          tags: apiData.tags,
          image: apiData.featured_image?.url,
          relatedArticles: apiData.relatedPosts.map((data: any) => ({
            id: data?.relatedPost?.id,
            title: data?.relatedPost?.title,
            slug: data?.relatedPost?.slug,
          }))
        }));
      } catch (error) {
        console.error('Failed to fetch article data:', error);
      }
    };

    loadArticleData();
  }, []);

  return (
    <div>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex items-center space-x-4 text-muted-foreground">
              <span className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(article.publishDate, 'MMMM d, yyyy')}
              </span>
              <Badge variant="secondary">{article.category}</Badge>
            </div>
          </header>

          <Image
            src={article.image}
            alt="Article Image"
            width={1200}
            height={630}
            className="rounded-lg mb-8"
          />

          <div
            className="prose prose-lg max-w-none mb-12"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          <div className="flex items-center justify-between mb-8">
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                tag.postTags?.name && (
                  <Badge key={tag.postTags.id} variant="outline">
                    {tag.postTags.name}
                  </Badge>
                )
              ))}
            </div>
          </div>

          <Separator className="my-8" />
          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4">About the Author</h2>
            <div className="flex items-center space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={article.author.avatar} alt={article.author.name} />
                <AvatarFallback>
                  {article.author.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{article.author.name}</h3>
                <p className="text-muted-foreground">{article.author.bio}</p>
              </div>
            </div>
          </section>

          {article.relatedArticles.length > 0 && article.relatedArticles[0].relatedPost !== null && (
            <section className="mb-12">
              <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {article.relatedArticles.map((related, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{related.title}</CardTitle>
                    </CardHeader>
                    <CardFooter>
                      <Link href={`/blog/${related.slug}`} className="text-primary hover:underline">
                        Read more
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </article>
      </div>
    </div>
  );
}
