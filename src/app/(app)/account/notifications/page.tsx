import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Bell, ChevronRight } from 'lucide-react'

// This would typically come from an API or database
const notifications = [
  {
    id: 1,
    title: 'New Investment Opportunity',
    description: 'A new high-yield fund is now available for investment.',
    date: '2024-12-10',
    type: 'opportunity',
    isRead: false,
  },
  {
    id: 2,
    title: 'Account Statement Available',
    description: 'Your monthly account statement for November 2024 is ready to view.',
    date: '2024-12-05',
    type: 'account',
    isRead: true,
  },
  {
    id: 3,
    title: 'Market Alert: Crypto Surge',
    description: 'Bitcoin has surpassed $100,000. Consider rebalancing your portfolio.',
    date: '2024-12-03',
    type: 'alert',
    isRead: false,
  },
  {
    id: 4,
    title: 'Dividend Payment Processed',
    description: 'A dividend of $500 has been credited to your account.',
    date: '2024-11-30',
    type: 'transaction',
    isRead: true,
  },
  {
    id: 5,
    title: 'Security Update Required',
    description: 'Please update your security settings to enable new protection features.',
    date: '2024-11-28',
    type: 'security',
    isRead: false,
  },
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

export default function NotificationsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <Bell className="mr-2" />
        Notifications
      </h1>
      <div className="space-y-6">
        {notifications.map((notification) => (
          <Link href={`/notifications/${notification.id}`} key={notification.id}>
            <Card
              className={`transition-shadow hover:shadow-md my-md-2 my-2 ${notification.isRead ? 'bg-background/50' : 'bg-background'}`}
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {notification.title}
                  {!notification.isRead && (
                    <Badge variant="secondary" className="ml-2">
                      New
                    </Badge>
                  )}
                </CardTitle>
                <Badge className={`${getTypeColor(notification.type)} text-white`}>
                  {notification.type}
                </Badge>
              </CardHeader>
              <CardContent>
                <CardDescription>{notification.description}</CardDescription>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-muted-foreground">{notification.date}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
