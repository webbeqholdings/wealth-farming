import ContractDetailHeader from '@/components/high-light/contract-detail-header'
import ContractTransactionsTable from '@/components/high-light/contract-transactions-table'
import ContractEquityChart from '@/components/high-light/contract-equity-chart'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import PasswordOverlay, { LogoutButton } from '@/components/high-light/password-overlay'

export default function ContractDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the contract data based on the ID
  const contractId = params.id
  const contract = contractsData.find((contract) => contract.id === contractId)

  // Find the user associated with this contract
  const user = usersData.find((user) => contract && user.id === contract.userId)

  return (
    <PasswordOverlay>
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex-1 p-6 md:p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Button variant="outline" size="sm" asChild className="mr-4">
                <Link href={user ? `/users/${user.id}` : '/dashboard'}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  {user ? `Back to ${user.name}'s Profile` : 'Back to Dashboard'}
                </Link>
              </Button>
              <h1 className="text-3xl font-bold tracking-tight">Contract Details</h1>
            </div>
            <LogoutButton />
          </div>

          {!contract ? (
            <div className="flex items-center justify-center h-[80vh]">
              <h1 className="text-2xl font-bold">Contract not found</h1>
            </div>
          ) : (
            <>
              {/* Contract Information */}
              <ContractDetailHeader contract={contract} user={user} />

              {/* Transactions Table */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Transactions</h2>
                <ContractTransactionsTable contractId={contract.id} />
              </div>

              {/* Equity Chart */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Equity Performance</h2>
                <ContractEquityChart contractId={contract.id} />
              </div>
            </>
          )}
        </main>
      </div>
    </PasswordOverlay>
  )
}

// Sample data - in a real app, this would come from a database
const contractsData = [
  {
    userId: 1,
    id: 'CTR-7890',
    title: 'Enterprise Software Development',
    value: 125000,
    startDate: 'Jan 15, 2023',
    endDate: 'Jan 14, 2024',
    status: 'Active',
    description:
      'Development of custom enterprise resource planning software with integrated modules for inventory management, human resources, and financial reporting. Includes ongoing maintenance and support for the duration of the contract.',
    client: 'Acme Corporation',
    contactPerson: 'John Smith',
    contactEmail: 'john.smith@acme.com',
    contactPhone: '+1 (555) 123-4567',
    terms: 'Net 30',
    renewalOption: true,
  },
  {
    userId: 1,
    id: 'CTR-7891',
    title: 'Mobile App Development',
    value: 85000,
    startDate: 'Feb 1, 2023',
    endDate: 'Jan 31, 2024',
    status: 'Active',
    description:
      'Design and development of cross-platform mobile applications for iOS and Android. Includes user authentication, push notifications, and integration with existing backend systems.',
    client: 'TechStart Inc.',
    contactPerson: 'Sarah Johnson',
    contactEmail: 'sarah.j@techstart.com',
    contactPhone: '+1 (555) 987-6543',
    terms: 'Net 15',
    renewalOption: true,
  },
  {
    userId: 1,
    id: 'CTR-7892',
    title: 'Cloud Migration Services',
    value: 65000,
    startDate: 'Mar 10, 2023',
    endDate: 'Mar 9, 2024',
    status: 'Pending',
    description:
      'Migration of on-premises infrastructure to cloud-based solutions. Includes assessment, planning, migration execution, and post-migration support to ensure minimal disruption to business operations.',
    client: 'Global Enterprises',
    contactPerson: 'Michael Brown',
    contactEmail: 'm.brown@globalent.com',
    contactPhone: '+1 (555) 456-7890',
    terms: 'Net 45',
    renewalOption: false,
  },
  {
    userId: 2,
    id: 'CTR-7893',
    title: 'Digital Marketing Campaign',
    value: 45000,
    startDate: 'Apr 5, 2023',
    endDate: 'Apr 4, 2024',
    status: 'Active',
    description:
      'Comprehensive digital marketing campaign including SEO optimization, content creation, social media management, and performance analytics. Monthly reporting and strategy adjustments based on campaign performance.',
    client: 'Retail Solutions',
    contactPerson: 'Emily Davis',
    contactEmail: 'emily@retailsolutions.com',
    contactPhone: '+1 (555) 234-5678',
    terms: 'Net 30',
    renewalOption: true,
  },
  // Other contracts...
]

const usersData = [
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
