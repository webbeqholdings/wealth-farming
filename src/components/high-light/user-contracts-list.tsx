'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp, ExternalLink, FileText } from 'lucide-react'
import Link from 'next/link'
import { getContractsByUserId, type Contract } from '@/lib/high-light-hooks'

interface UserContractsListProps {
  userId: string
}

export default function UserContractsList({ userId }: UserContractsListProps) {
  const [userContracts, setUserContracts] = useState<Contract[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedContracts, setExpandedContracts] = useState<Record<string, boolean>>({})

  useEffect(() => {
    async function fetchContracts() {
      try {
        const contracts = await getContractsByUserId(userId)
        setUserContracts(contracts)
      } catch (error) {
        console.error('Error fetching contracts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContracts()
  }, [userId])

  const toggleContract = (contractId: string) => {
    setExpandedContracts((prev) => ({
      ...prev,
      [contractId]: !prev[contractId],
    }))
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {Array(3)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="p-4 pb-0">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-48 animate-pulse bg-muted rounded-md" />
                  <div className="h-6 w-20 animate-pulse bg-muted rounded-full" />
                </div>
                <CardDescription className="mt-2">
                  <div className="h-4 w-full animate-pulse bg-muted rounded-md mt-2" />
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-4 w-32 animate-pulse bg-muted rounded-md" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
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
                    contract.status === 'active'
                      ? 'bg-emerald-100/10 text-emerald-500 hover:bg-emerald-100/20'
                      : contract.status === 'pending'
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
                    {/* <div>
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
                    </div> */}
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
