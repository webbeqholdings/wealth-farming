'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Bell } from 'lucide-react'
import { formatDateTime } from '@/utilities/formatDateTime';
import { useParams } from "next/navigation";
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';

const getTypeColor = (type: string) => {
  switch (type) {
    case 'opportunity':
      return 'bg-green-500'
    case 'account':
      return 'bg-blue-500'
    case 'alert':
      return 'bg-yellow-500'
    case 'transaction':
      return 'bg-purple-500'
    case 'security':
      return 'bg-red-500'
    default:
      return 'bg-gray-500'
  }
}

export default function NotificationDetailPage() {
  const params = useParams();
  const [notification, setNotification] = useState({
    id: 1,
    title: '',
    description: '',
    date: '',
    type: '',
    content: '',
  });

  // Fetch data from API when the component mounts
  useEffect(() => {
    // Function to fetch notification data from the API
    const fetchNotificationData = async () => {
      try {
        const response = await fetch(`/api/notifications/${params.id}`);
        const data = await response.json();

        // Update state with the fetched data
        setNotification({
          id: data.id,
          title: data.title,
          description: data.description,
          date: formatDateTime(data.date), // Format the date
          type: data.type,
          content: data.content.root.children.map((child: any) => renderContent(child)).join(' '),
        });
      } catch (error) {
        console.error('Error fetching notification:', error);
      }
    };

    // Call the fetch function
    fetchNotificationData();
  }, []); // Empty dependency array ensures this runs only once on mount

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
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <Link href="/account/notifications" className="flex items-center text-primary hover:underline mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Notifications
        </Link>
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-bold flex items-center">
                <Bell className="mr-2" />
                {notification.title}
              </CardTitle>
              <Badge className={`${getTypeColor(notification.type)} text-white`}>
                {notification.type}
              </Badge>
            </div>
            <CardDescription>{notification.date}</CardDescription>
          </CardHeader>
          <CardContent>
          {notification.content}
            {/* <div
            className="whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: notification.content }}
          /> */}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button>
              {notification.type == 'account' ?<Link href="/account/history">Take Action</Link> : ''}
              {notification.type == 'transaction' ?<Link href="/account/history">Take Action</Link> : ''}
              {notification.type == 'opportunity' ?<Link href="/investment-products">Take Action</Link> : ''}
              {notification.type == 'security' ?<Link href="/account/history">Take Action</Link> : ''}
              {notification.type == 'alert' ?<Link href="/account/history">Take Action</Link> : ''}
            </Button>
          </CardFooter>
        </Card>
        <SiteFooter />
      </div>
    </>
  )
}
