'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Mail, Phone, MapPin, Calendar } from 'lucide-react'
import type { User } from '@/lib/high-light-hooks'

interface UserDetailHeaderProps {
  user: User
}

export default function UserDetailHeader({ user }: UserDetailHeaderProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
  }

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center md:items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={`/placeholder.svg?height=96&width=96`} alt={user.name} />
              <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
              <div>
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <div className="flex items-center gap-2 mt-1 text-muted-foreground">
                  <Badge variant={user.status === 'Active' ? 'success' : 'destructive'}>
                    {user.status}
                  </Badge>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">{user.bio}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{user.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.address}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Joined {user.joinDate}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
