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
import { CalendarIcon, Filter, X } from 'lucide-react'
import { format, isAfter, isBefore, isValid, parse } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import TablePagination from '@/components/high-light/table-pagination'

import type { Contract } from '@/lib/high-light-hooks'

interface TableContractsProps {
  contracts: Contract[]
}

export default function TableContracts({ contracts }: TableContractsProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter states
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const [isFilterActive, setIsFilterActive] = useState(false)

  // Filter the contracts based on the selected filters
  const filteredContracts = useMemo(() => {
    if (!isFilterActive) return contracts

    return contracts.filter((contract) => {
      // Parse contract dates
      const contractStartDate = parse(contract.startDate, 'MMM d, yyyy', new Date())
      const contractEndDate = parse(contract.endDate, 'MMM d, yyyy', new Date())

      // Check start date filter
      if (startDate && isValid(startDate) && isValid(contractStartDate)) {
        if (isBefore(contractStartDate, startDate)) return false
      }

      // Check end date filter
      if (endDate && isValid(endDate) && isValid(contractEndDate)) {
        if (isAfter(contractEndDate, endDate)) return false
      }

      // Check status filter
      if (statusFilter && contract.status !== statusFilter) return false

      return true
    })
  }, [contracts, startDate, endDate, statusFilter, isFilterActive])

  // Calculate pagination
  const paginatedContracts = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredContracts.slice(startIndex, startIndex + pageSize)
  }, [filteredContracts, currentPage, pageSize])

  const totalPages = Math.ceil(filteredContracts.length / pageSize)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Apply filters
  const applyFilters = () => {
    setIsFilterActive(!!startDate || !!endDate || !!statusFilter)
    setCurrentPage(1) // Reset to first page when applying filters
  }

  // Clear all filters
  const clearFilters = () => {
    setStartDate(undefined)
    setEndDate(undefined)
    setStatusFilter(undefined)
    setIsFilterActive(false)
    setCurrentPage(1)
  }

  // Get unique statuses for the filter
  const uniqueStatuses = useMemo(() => {
    return Array.from(new Set(contracts.map((contract) => contract.status)))
  }, [contracts])

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Contracts</CardTitle>
            <CardDescription>View and manage all active contracts.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Start Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {startDate ? format(startDate, 'MMM d, yyyy') : 'Start Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>

            {/* End Date Filter */}
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 gap-1">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {endDate ? format(endDate, 'MMM d, yyyy') : 'End Date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {uniqueStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
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
            {startDate && (
              <Badge variant="outline" className="text-xs">
                Start Date: {format(startDate, 'MMM d, yyyy')}
              </Badge>
            )}
            {endDate && (
              <Badge variant="outline" className="text-xs">
                End Date: {format(endDate, 'MMM d, yyyy')}
              </Badge>
            )}
            {statusFilter && (
              <Badge variant="outline" className="text-xs">
                Status: {statusFilter}
              </Badge>
            )}
          </div>
        )}
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
            {paginatedContracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No contracts found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedContracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-medium">{contract.id}</TableCell>
                  <TableCell>{contract.client}</TableCell>
                  <TableCell>${contract.value.toLocaleString()}</TableCell>
                  <TableCell>{contract.startDate}</TableCell>
                  <TableCell>{contract.endDate}</TableCell>
                  <TableCell className="text-right">
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        contract.status === 'active'
                          ? 'bg-emerald-100/10 text-emerald-500'
                          : contract.status === 'pending'
                            ? 'bg-yellow-100/10 text-yellow-500'
                            : 'bg-red-100/10 text-red-500'
                      }`}
                    >
                      {contract.status}
                    </div>
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
          totalItems={filteredContracts.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </CardFooter>
    </Card>
  )
}
