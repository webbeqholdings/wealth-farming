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
import { CalendarIcon, Filter, X } from 'lucide-react'
import { format, isAfter, isBefore, isValid, parse } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Transaction } from '@/lib/high-light-hooks'

interface TableTransactionsProps {
  transactions: Transaction[]
}

export default function TableTransactions({ transactions }: TableTransactionsProps) {
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
      if (categoryFilter && transaction.type !== categoryFilter) return false

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
    return Array.from(new Set(transactions.map((transaction) => transaction.type)))
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
                    {category.charAt(0).toUpperCase() + category.slice(1)}
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
                Category: {categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)}
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
                  <TableCell
                    className={`text-right ${transaction.type === 'withdraw' ? 'text-red-500' : 'text-emerald-500'}`}
                  >
                    {transaction.type === 'withdraw' ? '-' : '+'}
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
