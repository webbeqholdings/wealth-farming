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
          content: data.content,
        });
      } catch (error) {
        console.error('Error fetching notification:', error);
      }
    };

    // Call the fetch function
    fetchNotificationData();
  }, []); // Empty dependency array ensures this runs only once on mount

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
            <p className="whitespace-pre-wrap">{notification.content}</p>
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
