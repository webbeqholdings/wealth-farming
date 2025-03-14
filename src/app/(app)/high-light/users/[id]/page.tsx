'use client'

import UserDetailHeader from '@/components/high-light/user-detail-header'
import UserFinancialOverview from '@/components/high-light/user-financial-overview'
import UserContractsList from '@/components/high-light/user-contracts-list'
import EquityChart from '@/components/high-light/user-equity-chart'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { use } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import PasswordOverlay, { LogoutButton } from '@/components/high-light/password-overlay'

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  // In a real app, you would fetch the user data based on the ID
  const { id } = use(params)
  const userId = Number.parseInt(id)
  const user = users.find((user) => user.id === userId)

  return (
    <PasswordOverlay>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" asChild>
                <Link href="/high-light">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            </div>

            <div className="flex items-center gap-3">
              <UserSelector currentUserId={userId} />
              <LogoutButton />
            </div>
          </div>

          {!user ? (
            <div className="flex items-center justify-center h-[80vh]">
              <h1 className="text-2xl font-bold">User not found</h1>
            </div>
          ) : (
            <>
              {/* User Information */}
              <UserDetailHeader user={user} />

              {/* Financial Overview */}
              <UserFinancialOverview userId={user.id} />

              {/* User Contracts */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Contracts</h2>
                <UserContractsList userId={user.id} />
              </div>

              {/* Equity Chart */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Equity Performance</h2>
                <EquityChart userId={user.id} />
              </div>
            </>
          )}
        </main>
      </div>
    </PasswordOverlay>
  )
}

function UserSelector({ currentUserId }: { currentUserId: number }) {
  const router = useRouter()
  const [selectedUser, setSelectedUser] = useState<string>(currentUserId.toString())

  // Update the selected user when the currentUserId changes
  useEffect(() => {
    setSelectedUser(currentUserId.toString())
  }, [currentUserId])

  const handleUserChange = (userId: string) => {
    setSelectedUser(userId)
    router.push(`/high-light/users/${userId}`)
  }

  return (
    <Select value={selectedUser} onValueChange={handleUserChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Select a user" />
      </SelectTrigger>
      <SelectContent>
        {users.map((user) => (
          <SelectItem key={user.id} value={user.id.toString()}>
            {user.name} ({user.email})
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

// Sample data - in a real app, this would come from a database
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    status: 'Active',
    role: 'Admin',
    lastActive: 'Just now',
    phone: '+1 (555) 123-4567',
    address: '123 Main St, New York, NY 10001',
    joinDate: 'Jan 15, 2022',
    bio: 'Senior administrator with expertise in system management and team leadership.',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    status: 'Active',
    role: 'User',
    lastActive: '5 min ago',
    phone: '+1 (555) 987-6543',
    address: '456 Park Ave, Boston, MA 02108',
    joinDate: 'Mar 22, 2022',
    bio: 'Marketing specialist with a focus on digital campaigns and brand development.',
  },
  {
    id: 3,
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    status: 'Inactive',
    role: 'User',
    lastActive: '3 hours ago',
    phone: '+1 (555) 234-5678',
    address: '789 Oak St, Chicago, IL 60601',
    joinDate: 'Apr 10, 2022',
    bio: 'Product development expert with experience in agile methodologies.',
  },
  {
    id: 4,
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    status: 'Active',
    role: 'Manager',
    lastActive: '1 day ago',
    phone: '+1 (555) 345-6789',
    address: '321 Pine St, San Francisco, CA 94101',
    joinDate: 'May 5, 2022',
    bio: 'Team manager with a track record of successful project deliveries.',
  },
  {
    id: 5,
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    status: 'Suspended',
    role: 'User',
    lastActive: '1 week ago',
    phone: '+1 (555) 456-7890',
    address: '654 Maple St, Seattle, WA 98101',
    joinDate: 'Jun 15, 2022',
    bio: 'Technical specialist focusing on infrastructure and cloud solutions.',
  },
  // Other users...
]
