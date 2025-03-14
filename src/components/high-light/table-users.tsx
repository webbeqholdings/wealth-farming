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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Filter, MoreHorizontal, Search, X } from 'lucide-react'
import Link from 'next/link'
import TablePagination from '@/components/high-light/table-pagination'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import type { User } from '@/lib/high-light-hooks'

interface TableUsersProps {
  users: User[]
}

export default function TableUsers({ users }: TableUsersProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Filter states
  const [nameFilter, setNameFilter] = useState('')
  const [emailFilter, setEmailFilter] = useState('')
  const [isFilterActive, setIsFilterActive] = useState(false)

  // Filter the users based on the selected filters
  const filteredUsers = useMemo(() => {
    if (!isFilterActive) return users

    return users.filter((user) => {
      // Check name filter (case insensitive)
      if (nameFilter && !user.name.toLowerCase().includes(nameFilter.toLowerCase())) {
        return false
      }

      // Check email filter (case insensitive)
      if (emailFilter && !user.email.toLowerCase().includes(emailFilter.toLowerCase())) {
        return false
      }

      return true
    })
  }, [users, nameFilter, emailFilter, isFilterActive])

  // Calculate pagination
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredUsers.slice(startIndex, startIndex + pageSize)
  }, [filteredUsers, currentPage, pageSize])

  const totalPages = Math.ceil(filteredUsers.length / pageSize)

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
    setNameFilter('')
    setEmailFilter('')
    setIsFilterActive(false)
    setCurrentPage(1)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage your users and their account status.</CardDescription>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Name Filter */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name"
                value={nameFilter}
                onChange={(e) => setNameFilter(e.target.value)}
                className="h-8 w-[200px] pl-8"
              />
            </div>

            {/* Email Filter */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by email"
                value={emailFilter}
                onChange={(e) => setEmailFilter(e.target.value)}
                className="h-8 w-[200px] pl-8"
              />
            </div>

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
        {isFilterActive && (nameFilter || emailFilter) && (
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-xs text-muted-foreground">Active filters:</span>
            {nameFilter && (
              <Badge variant="outline" className="text-xs">
                Name: {nameFilter}
              </Badge>
            )}
            {emailFilter && (
              <Badge variant="outline" className="text-xs">
                Email: {emailFilter}
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">Last Active</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found matching the filters.
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <div
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        user.status === 'Active'
                          ? 'bg-emerald-100/10 text-emerald-500'
                          : user.status === 'Inactive'
                            ? 'bg-yellow-100/10 text-yellow-500'
                            : 'bg-red-100/10 text-red-500'
                      }`}
                    >
                      {user.status}
                    </div>
                  </TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell className="text-right">{user.lastActive}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/high-light/users/${user.id}`}>View Details</Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
          totalItems={filteredUsers.length}
          pageSize={pageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      </CardFooter>
    </Card>
  )
}
