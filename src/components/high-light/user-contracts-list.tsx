'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'

interface Contract {
  id: string
  title: string
  value: number
  startDate: string
  endDate: string
  status: string
  description: string
}

interface UserContractsListProps {
  userId: number
}

export default function UserContractsList({ userId }: UserContractsListProps) {
  // In a real app, you would fetch this data based on the userId
  const userContracts = contractsData.filter((contract) => contract.userId === userId)

  const [expandedContracts, setExpandedContracts] = useState<Record<string, boolean>>({})

  const toggleContract = (contractId: string) => {
    setExpandedContracts((prev) => ({
      ...prev,
      [contractId]: !prev[contractId],
    }))
  }

  return (
    <div className="space-y-4">
      {userContracts.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            No contracts found for this user.
          </CardContent>
        </Card>
      ) : (
        userContracts.map((contract) => (
          <Card key={contract.id} className="overflow-hidden">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <CardTitle className="text-base">{contract.title}</CardTitle>
                </div>
                <Badge
                  className={`${
                    contract.status === 'Active'
                      ? 'bg-emerald-100/10 text-emerald-500 hover:bg-emerald-100/20'
                      : contract.status === 'Pending'
                        ? 'bg-yellow-100/10 text-yellow-500 hover:bg-yellow-100/20'
                        : 'bg-red-100/10 text-red-500 hover:bg-red-100/20'
                  }`}
                >
                  {contract.status}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div>Contract ID: {contract.id}</div>
                  <div>Value: ${contract.value.toLocaleString()}</div>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {contract.startDate} - {contract.endDate}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleContract(contract.id)}
                    className="h-8 px-2"
                  >
                    {expandedContracts[contract.id] ? (
                      <>
                        <span className="mr-1">Less details</span>
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span className="mr-1">More details</span>
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                  <Button variant="outline" size="sm" className="h-8" asChild>
                    <Link href={`/high-light/contracts/${contract.id}`}>
                      <ExternalLink className="h-4 w-4 mr-1" />
                      See Detail
                    </Link>
                  </Button>
                </div>
              </div>

              {expandedContracts[contract.id] && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <h4 className="font-medium mb-2">Contract Details</h4>
                  <p className="text-muted-foreground">{contract.description}</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">
                        Payment Schedule
                      </h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Initial payment: ${(contract.value * 0.3).toLocaleString()}</li>
                        <li>Milestone 1: ${(contract.value * 0.3).toLocaleString()}</li>
                        <li>Final payment: ${(contract.value * 0.4).toLocaleString()}</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="text-xs font-medium text-muted-foreground mb-1">
                        Key Deliverables
                      </h5>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Project specifications</li>
                        <li>Development phase</li>
                        <li>Testing and deployment</li>
                        <li>Maintenance support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
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
  },
  // Other contracts...
]
