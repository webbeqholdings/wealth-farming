'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, ChevronRight } from 'lucide-react'
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { formatDateTime } from '@/utilities/formatDateTime';

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

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  // Fetch data from API and update the notifications state
  useEffect(() => {
    // Function to fetch the data
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();

        // Map API data to fit the notifications template structure
        const updatedNotifications = data.docs.map((apiNotification: any) => {
          // Find matching template notification based on id (or handle as needed)
          const templateNotification = notifications.find(
            (notification) => notification.id === apiNotification.id
          );

          if (templateNotification) {
            // Update existing template data with API response data
            return {
              ...templateNotification,
              date: apiNotification.date,
              type: apiNotification.type,
              content: apiNotification.content,
            };
          }

          // If no matching notification, return API data as new
          return apiNotification;
        });
        // Set updated notifications to the state
        setNotifications(updatedNotifications);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Call the function to fetch data
    fetchNotifications();
  }, []); // Empty dependency array means this will run only once on component mount
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 flex items-center">
          <Bell className="mr-2" />
          Notifications
        </h1>
        <div className="space-y-6">
          {notifications.map((notification) => (
            <Link href={`/account/notifications/${notification.id}`} key={notification.id}>
              <Card
                className={`transition-shadow hover:shadow-md my-md-2 my-2 bg-background`}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {notification.title}
                  </CardTitle>
                  <Badge className={`${getTypeColor(notification.type)} text-white`}>
                    {notification.type}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <CardDescription>{notification.description}</CardDescription>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">{formatDateTime(notification.date)}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
        <SiteFooter />
      </div>
    </>
  )
}
