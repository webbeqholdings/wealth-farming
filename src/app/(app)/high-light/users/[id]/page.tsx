import UserDetailHeader from '@/components/high-light/user-detail-header'
import UserFinancialOverview from '@/components/high-light/user-financial-overview'
import UserContractsList from '@/components/high-light/user-contracts-list'
import EquityChart from '@/components/high-light/user-equity-chart'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PasswordOverlay, { LogoutButton } from '@/components/high-light/password-overlay'

export default function UserDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the user data based on the ID
  const userId = Number.parseInt(params.id)
  const user = users.find((user) => user.id === userId)

  return (
    <PasswordOverlay>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="outline" size="sm" asChild className="mr-4">
                <Link href="/dashboard">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
            </div>
            <LogoutButton />
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
  // Other users...
]
