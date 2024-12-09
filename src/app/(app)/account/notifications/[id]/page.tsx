import { notFound } from 'next/navigation'
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

// This would typically come from an API or database
const notifications = [
  {
    id: 1,
    title: 'New Investment Opportunity',
    description: 'A new high-yield fund is now available for investment.',
    date: '2024-12-10',
    type: 'opportunity',
    isRead: false,
    content:
      'We are excited to announce a new investment opportunity in our high-yield fund. This fund focuses on emerging markets and has shown consistent returns over the past 5 years. Key features include:\n\n- Expected annual return: 8-10%\n- Minimum investment: $10,000\n- Low management fees\n- Diversified portfolio across multiple sectors\n\nPlease review the prospectus carefully before making any investment decisions. Our financial advisors are available to discuss this opportunity in detail and help you determine if it aligns with your investment goals.',
  },
  // ... other notifications (add full content for each)
]

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

export default function NotificationDetailPage({ params }: { params: { id: string } }) {
  const notification = notifications.find((n) => n.id === parseInt(params.id))

  if (!notification) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/notifications" className="flex items-center text-primary hover:underline mb-4">
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
          <Button variant="outline">Mark as {notification.isRead ? 'Unread' : 'Read'}</Button>
          <Button>Take Action</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
