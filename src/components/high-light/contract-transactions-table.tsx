'use client'
import { useState, useMemo } from 'react'
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
import { Button } from '@/components/ui/button'
import { ArrowDownUp, ArrowUp, Plus } from 'lucide-react'
import TablePagination from '@/components/high-light/table-pagination'

interface Transaction {
  id: string
  contractId: string
  date: string
  amount: number
  type: 'bonus' | 'withdraw' | 'investment'
  description: string
}

interface ContractTransactionsTableProps {
  contractId: string
}

export default function ContractTransactionsTable({ contractId }: ContractTransactionsTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  // Filter and paginate transactions
  const contractTransactions = transactionsData.filter(
    (transaction) => transaction.contractId === contractId,
  )

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return contractTransactions.slice(startIndex, startIndex + pageSize)
  }, [contractTransactions, currentPage, pageSize])

  const totalPages = Math.ceil(contractTransactions.length / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Calculate totals by type
  const totals = contractTransactions.reduce(
    (acc, transaction) => {
      if (transaction.type === 'investment') {
        acc.investment += transaction.amount
      } else if (transaction.type === 'withdraw') {
        acc.withdraw += transaction.amount
      } else if (transaction.type === 'bonus') {
        acc.bonus += transaction.amount
      }
      return acc
    },
    { investment: 0, withdraw: 0, bonus: 0 },
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>All financial transactions for this contract.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <ArrowDownUp className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Total Investment</div>
                <div className="flex items-center text-emerald-500">
                  <Plus className="h-4 w-4 mr-1" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1">${totals.investment.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Total Withdraw</div>
                <div className="flex items-center text-red-500">
                  <ArrowUp className="h-4 w-4 mr-1" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1">${totals.withdraw.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-muted-foreground">Total Bonus</div>
                <div className="flex items-center text-yellow-500">
                  <Plus className="h-4 w-4 mr-1" />
                </div>
              </div>
              <div className="text-2xl font-bold mt-1">${totals.bonus.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  No transactions found for this contract.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        transaction.type === 'investment'
                          ? 'bg-emerald-100/10 text-emerald-500'
                          : transaction.type === 'withdraw'
                            ? 'bg-red-100/10 text-red-500'
                            : 'bg-yellow-100/10 text-yellow-500'
                      }`}
                    >
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </div>
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell
                    className={`text-right ${transaction.type === 'withdraw' ? 'text-red-500' : 'text-emerald-500'}`}
                  >
                    {transaction.type === 'withdraw' ? '-' : '+'}$
                    {transaction.amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={contractTransactions.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </CardFooter>
    </Card>
  )
}

// Sample data - in a real app, this would come from a database
const transactionsData: Transaction[] = [
  {
    id: 'TRX-001',
    contractId: 'CTR-7890',
    date: 'Jan 15, 2023',
    amount: 37500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-002',
    contractId: 'CTR-7890',
    date: 'Apr 22, 2023',
    amount: 37500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-003',
    contractId: 'CTR-7890',
    date: 'May 15, 2023',
    amount: 5000,
    type: 'withdraw',
    description: 'Resource allocation',
  },
  {
    id: 'TRX-004',
    contractId: 'CTR-7890',
    date: 'Jun 30, 2023',
    amount: 7500,
    type: 'bonus',
    description: 'Early delivery bonus',
  },
  {
    id: 'TRX-005',
    contractId: 'CTR-7890',
    date: 'Jul 15, 2023',
    amount: 12000,
    type: 'withdraw',
    description: 'Development costs',
  },
  {
    id: 'TRX-006',
    contractId: 'CTR-7890',
    date: 'Aug 22, 2023',
    amount: 8000,
    type: 'withdraw',
    description: 'Testing resources',
  },
  {
    id: 'TRX-007',
    contractId: 'CTR-7890',
    date: 'Oct 10, 2023',
    amount: 50000,
    type: 'investment',
    description: 'Final payment (40%)',
  },
  {
    id: 'TRX-008',
    contractId: 'CTR-7891',
    date: 'Feb 1, 2023',
    amount: 25500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-009',
    contractId: 'CTR-7891',
    date: 'May 15, 2023',
    amount: 25500,
    type: 'investment',
    description: 'Milestone payment (30%)',
  },
  {
    id: 'TRX-010',
    contractId: 'CTR-7891',
    date: 'Jun 10, 2023',
    amount: 4500,
    type: 'withdraw',
    description: 'UI/UX design costs',
  },
  {
    id: 'TRX-011',
    contractId: 'CTR-7891',
    date: 'Jul 22, 2023',
    amount: 6000,
    type: 'withdraw',
    description: 'Development resources',
  },
  {
    id: 'TRX-012',
    contractId: 'CTR-7891',
    date: 'Sep 5, 2023',
    amount: 5000,
    type: 'bonus',
    description: 'Performance optimization bonus',
  },
  {
    id: 'TRX-013',
    contractId: 'CTR-7892',
    date: 'Mar 10, 2023',
    amount: 19500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-014',
    contractId: 'CTR-7893',
    date: 'Apr 5, 2023',
    amount: 13500,
    type: 'investment',
    description: 'Initial payment (30%)',
  },
  {
    id: 'TRX-015',
    contractId: 'CTR-7890',
    date: 'Nov 15, 2023',
    amount: 4500,
    type: 'withdraw',
    description: 'Support and maintenance',
  },
  {
    id: 'TRX-016',
    contractId: 'CTR-7890',
    date: 'Dec 20, 2023',
    amount: 6000,
    type: 'bonus',
    description: 'Year-end performance bonus',
  },
]
