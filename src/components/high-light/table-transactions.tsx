'use client'
import { Button } from '@/components/ui/button'
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
import { format, isAfter, isBefore, isValid, parse } from 'date-fns'
import TablePagination from '@/components/high-light/table-pagination'
import { Badge } from '@/components/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Filter, X } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function TableTransactions() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter states
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
  const [toDate, setToDate] = useState<Date | undefined>(undefined)
  const [categoryFilter, setCategoryFilter] = useState<string | undefined>(undefined)
  const [isFilterActive, setIsFilterActive] = useState(false)

  // Filter the transactions based on the selected filters
  const filteredTransactions = useMemo(() => {
    if (!isFilterActive) return transactions

    return transactions.filter((transaction) => {
      // Parse transaction date
      const transactionDate = parse(transaction.date, 'MMM d, yyyy', new Date())

      // Check from date filter
      if (fromDate && isValid(fromDate) && isValid(transactionDate)) {
        if (isBefore(transactionDate, fromDate)) return false
      }

      // Check to date filter
      if (toDate && isValid(toDate) && isValid(transactionDate)) {
        if (isAfter(transactionDate, toDate)) return false
      }

      // Check category filter
      if (categoryFilter && transaction.category !== categoryFilter) return false

      return true
    })
  }, [transactions, fromDate, toDate, categoryFilter, isFilterActive])

  // Calculate pagination
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTransactions.slice(startIndex, startIndex + pageSize)
  }, [filteredTransactions, currentPage, pageSize])

  const totalPages = Math.ceil(filteredTransactions.length / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Apply filters
  const applyFilters = () => {
    setIsFilterActive(true)
    setCurrentPage(1) // Reset to first page when applying filters
  }

  // Clear all filters
  const clearFilters = () => {
    setFromDate(undefined)
    setToDate(undefined)
    setCategoryFilter(undefined)
    setIsFilterActive(false)
    setCurrentPage(1)
  }

  // Get unique categories for the filter
  const uniqueCategories = useMemo(() => {
    return Array.from(new Set(transactions.map((transaction) => transaction.category)))
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Recent financial transactions across all accounts.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* From Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {fromDate ? format(fromDate, 'MMM d, yyyy') : 'From Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={fromDate} onSelect={setFromDate} initialFocus />
              </PopoverContent>
            </Popover>

            {/* To Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {toDate ? format(toDate, 'MMM d, yyyy') : 'To Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={toDate} onSelect={setToDate} initialFocus />
              </PopoverContent>
            </Popover>

            {/* Category Filter */}
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {uniqueCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Apply Filters Button */}
            <Button size="sm" className="h-8" onClick={applyFilters}>
              <Filter className="h-3.5 w-3.5 mr-1" />
              Apply Filters
            </Button>

            {/* Clear Filters Button - Only show when filters are active */}
            {isFilterActive && (
              <Button variant="outline" size="sm" className="h-8" onClick={clearFilters}>
                <X className="h-3.5 w-3.5 mr-1" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Active Filters Display */}
        {isFilterActive && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {fromDate && (
              <Badge variant="outline" className="text-xs">
                From: {format(fromDate, 'MMM d, yyyy')}
              </Badge>
            )}
            {toDate && (
              <Badge variant="outline" className="text-xs">
                To: {format(toDate, 'MMM d, yyyy')}
              </Badge>
            )}
            {categoryFilter && (
              <Badge variant="outline" className="text-xs">
                Category: {categoryFilter}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transactions found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.id}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell
                    className={`text-right ${transaction.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}
                  >
                    {transaction.amount > 0 ? '+' : ''}
                    {transaction.amount.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
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
          totalItems={filteredTransactions.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </CardFooter>
    </Card>
  )
}

// Sample data - expanded to show pagination better
const transactions = [
  {
    id: 'TRX-001',
    description: 'Payment from Client A',
    date: 'Mar 15, 2023',
    category: 'Income',
    amount: 5250.0,
  },
  {
    id: 'TRX-002',
    description: 'Office Supplies',
    date: 'Mar 14, 2023',
    category: 'Expense',
    amount: -125.5,
  },
  {
    id: 'TRX-003',
    description: 'Software Subscription',
    date: 'Mar 13, 2023',
    category: 'Expense',
    amount: -49.99,
  },
  {
    id: 'TRX-004',
    description: 'Payment from Client B',
    date: 'Mar 12, 2023',
    category: 'Income',
    amount: 3200.0,
  },
  {
    id: 'TRX-005',
    description: 'Server Hosting',
    date: 'Mar 10, 2023',
    category: 'Expense',
    amount: -299.0,
  },
  {
    id: 'TRX-006',
    description: 'Employee Payroll',
    date: 'Mar 5, 2023',
    category: 'Expense',
    amount: -8500.0,
  },
  {
    id: 'TRX-007',
    description: 'Payment from Client C',
    date: 'Mar 3, 2023',
    category: 'Income',
    amount: 4750.0,
  },
  {
    id: 'TRX-008',
    description: 'Marketing Campaign',
    date: 'Mar 2, 2023',
    category: 'Expense',
    amount: -1200.0,
  },
  {
    id: 'TRX-009',
    description: 'Office Rent',
    date: 'Mar 1, 2023',
    category: 'Expense',
    amount: -2000.0,
  },
  {
    id: 'TRX-010',
    description: 'Consulting Services',
    date: 'Feb 28, 2023',
    category: 'Income',
    amount: 1800.0,
  },
  {
    id: 'TRX-011',
    description: 'Hardware Purchase',
    date: 'Feb 25, 2023',
    category: 'Expense',
    amount: -3500.0,
  },
  {
    id: 'TRX-012',
    description: 'Cloud Services',
    date: 'Feb 23, 2023',
    category: 'Expense',
    amount: -450.0,
  },
  {
    id: 'TRX-013',
    description: 'Payment from Client D',
    date: 'Feb 20, 2023',
    category: 'Income',
    amount: 6200.0,
  },
  {
    id: 'TRX-014',
    description: 'Internet Bill',
    date: 'Feb 18, 2023',
    category: 'Expense',
    amount: -120.0,
  },
  {
    id: 'TRX-015',
    description: 'Team Lunch',
    date: 'Feb 15, 2023',
    category: 'Expense',
    amount: -350.0,
  },
  {
    id: 'TRX-016',
    description: 'Contract Extension Fee',
    date: 'Feb 12, 2023',
    category: 'Income',
    amount: 1500.0,
  },
  {
    id: 'TRX-017',
    description: 'Training Workshop',
    date: 'Feb 10, 2023',
    category: 'Expense',
    amount: -2000.0,
  },
  {
    id: 'TRX-018',
    description: 'Client Refund',
    date: 'Feb 8, 2023',
    category: 'Expense',
    amount: -750.0,
  },
  {
    id: 'TRX-019',
    description: 'Annual License Renewal',
    date: 'Feb 5, 2023',
    category: 'Expense',
    amount: -1200.0,
  },
  {
    id: 'TRX-020',
    description: 'Payment from Client E',
    date: 'Feb 3, 2023',
    category: 'Income',
    amount: 4800.0,
  },
  {
    id: 'TRX-021',
    description: 'Data Recovery Services',
    date: 'Feb 1, 2023',
    category: 'Expense',
    amount: -800.0,
  },
  {
    id: 'TRX-022',
    description: 'Conference Ticket',
    date: 'Jan 28, 2023',
    category: 'Expense',
    amount: -1500.0,
  },
  {
    id: 'TRX-023',
    description: 'Payment from Client F',
    date: 'Jan 25, 2023',
    category: 'Income',
    amount: 3250.0,
  },
  {
    id: 'TRX-024',
    description: 'Office Equipment',
    date: 'Jan 20, 2023',
    category: 'Expense',
    amount: -980.0,
  },
  {
    id: 'TRX-025',
    description: 'Quarterly Tax Payment',
    date: 'Jan 15, 2023',
    category: 'Expense',
    amount: -5600.0,
  },
]
