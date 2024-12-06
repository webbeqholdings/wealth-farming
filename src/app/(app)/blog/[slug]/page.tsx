'use client'
import React, { useState, useEffect } from 'react';
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

  type RelatedPost = {
    id: number;
    title: string;
    slug: string;
  };

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
          image: apiData.featured_image.url,
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

  const renderContent = (child: any) => {
    switch (child.type) {
      case 'paragraph':
        return `<p>${child.children[0]?.text ?? '</br>'}</p>`;
      case 'upload':
        return `<img src="${child.value.url}" width="${child.value.width}px" height="${child.value.height}px" alt="${child.value.filename}" class="rounded-lg mb-8" />`;
      case 'list': {
        // Determine if the list type is "check" or "number"
        const listItems = child.children.map((item: any, index: number) => {
          const text = item.children[0].text;
          const isChecked = item.checked ? 'checked' : ''; // Check if the item is marked as checked
          const textStyle = item.checked ? 'text-decoration: line-through;' : ''; // Apply strikethrough if checked

          return `<li key="${index}">
                      ${child.listType === 'check' ? `<input type="checkbox" ${isChecked} disabled />` : ''}
                      <span style="${textStyle}">${text}</span>
                    </li>`;
        }).join('');

        // If listType is "number", return ordered list (ol), otherwise default to unordered list (ul)
        if (child.listType === 'number') {
          return `<ol style="list-style-type: decimal;">${listItems}</ol>`
        }
        if (child.listType === 'bullet') {
          return `<ul style="list-style-type: disc;">${listItems}</ul>`;
        } 
        if (child.listType === 'check'){
          return `<ul style="list-style-type: none;">${listItems}</ul>`;
        }
      }
      case 'quote':
        return `<blockquote><p>${child.children[0]?.text || 'Quote text'}</p></blockquote>`;
      case 'heading': {
        const text = child.children[0].text;
        let style = '';

        // Set styles based on the tag type (h1, h2, h3, h4, h5, h6)
        switch (child.tag) {
          case 'h1':
            style = 'font-size: 32px; margin-bottom: 10px; font-weight: bold;';
            break;
          case 'h2':
            style = 'font-size: 28px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h3':
            style = 'font-size: 24px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h4':
            style = 'font-size: 20px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h5':
            style = 'font-size: 18px; margin-bottom: 8px; font-weight: bold;';
            break;
          case 'h6':
            style = 'font-size: 16px; margin-bottom: 8px; font-weight: bold;';
            break;
          default:
            style = ''; // If it's not a recognized heading tag
        }

        // Return the HTML with the style applied dynamically
        return `<${child.tag} style="${style}">${text}</${child.tag}>`;
      }
      case 'horizontalrule':
        return `<hr />`;
      default:
        return '';
    }
  };

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
