'use client'
import { useState, useMemo } from 'react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import TablePagination from '@/components/high-light/table-pagination'

export default function TableContracts() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Calculate pagination
  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return contracts.slice(startIndex, startIndex + pageSize)
  }, [currentPage, pageSize])

  const totalPages = Math.ceil(contracts.length / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts</CardTitle>
        <CardDescription>View and manage all active contracts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedContracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.id}</TableCell>
                <TableCell>{contract.client}</TableCell>
                <TableCell>${contract.value.toLocaleString()}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      contract.status === 'Active'
                        ? 'bg-emerald-100/10 text-emerald-500'
                        : contract.status === 'Pending'
                          ? 'bg-yellow-100/10 text-yellow-500'
                          : 'bg-red-100/10 text-red-500'
                    }`}
                  >
                    {contract.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={contracts.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </CardFooter>
    </Card>
  )
}

// Sample data - expanded to show pagination better
const contracts = [
  {
    id: 'CTR-7890',
    client: 'Acme Inc.',
    value: 125000,
    startDate: 'Jan 15, 2023',
    endDate: 'Jan 14, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7891',
    client: 'Globex Corp',
    value: 85000,
    startDate: 'Feb 1, 2023',
    endDate: 'Jan 31, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7892',
    client: 'Initech',
    value: 65000,
    startDate: 'Mar 10, 2023',
    endDate: 'Mar 9, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7893',
    client: 'Massive Dynamic',
    value: 145000,
    startDate: 'Apr 5, 2023',
    endDate: 'Apr 4, 2024',
    status: 'Pending',
  },
  {
    id: 'CTR-7894',
    client: 'Stark Industries',
    value: 250000,
    startDate: 'May 20, 2023',
    endDate: 'May 19, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7895',
    client: 'Wayne Enterprises',
    value: 180000,
    startDate: 'Jun 15, 2023',
    endDate: 'Jun 14, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7896',
    client: 'Umbrella Corp',
    value: 95000,
    startDate: 'Jul 1, 2023',
    endDate: 'Jun 30, 2024',
    status: 'Expired',
  },
  {
    id: 'CTR-7897',
    client: 'Cyberdyne Systems',
    value: 120000,
    startDate: 'Aug 10, 2023',
    endDate: 'Aug 9, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7898',
    client: 'Oscorp Industries',
    value: 75000,
    startDate: 'Sep 5, 2023',
    endDate: 'Sep 4, 2024',
    status: 'Pending',
  },
  {
    id: 'CTR-7899',
    client: 'LexCorp',
    value: 110000,
    startDate: 'Oct 1, 2023',
    endDate: 'Sep 30, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7900',
    client: 'Soylent Corp',
    value: 85000,
    startDate: 'Nov 10, 2023',
    endDate: 'Nov 9, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7901',
    client: 'Weyland-Yutani',
    value: 195000,
    startDate: 'Dec 5, 2023',
    endDate: 'Dec 4, 2024',
    status: 'Pending',
  },
  {
    id: 'CTR-7902',
    client: 'InGen',
    value: 220000,
    startDate: 'Jan 20, 2024',
    endDate: 'Jan 19, 2025',
    status: 'Active',
  },
  {
    id: 'CTR-7903',
    client: 'Aperture Science',
    value: 75000,
    startDate: 'Feb 15, 2024',
    endDate: 'Feb 14, 2025',
    status: 'Active',
  },
  {
    id: 'CTR-7904',
    client: 'Blue Sun Corp',
    value: 130000,
    startDate: 'Mar 1, 2024',
    endDate: 'Feb 28, 2025',
    status: 'Pending',
  },
]
