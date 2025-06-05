"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Filter, X } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import TablePagination from "@/components/high-light-invest/table-pagination"
import type { User } from "@/lib/high-light-invest-hooks"

interface TableUsersProps {
    users: User[]
}

export default function TableUsers({ users }: TableUsersProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)
    const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
    const [isFilterActive, setIsFilterActive] = useState(false)

    // Filter the users based on the selected filters
    const filteredUsers = useMemo(() => {
        if (!isFilterActive) return users

        return users.filter((user) => {
            if (statusFilter && user.status !== statusFilter) return false
            return true
        })
    }, [users, statusFilter, isFilterActive])

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
        setCurrentPage(1)
    }

    // Apply filters
    const applyFilters = () => {
        setIsFilterActive(!!statusFilter)
        setCurrentPage(1)
    }

    // Clear all filters
    const clearFilters = () => {
        setStatusFilter(undefined)
        setIsFilterActive(false)
        setCurrentPage(1)
    }

    // Get unique statuses for the filter
    const uniqueStatuses = useMemo(() => {
        return Array.from(new Set(users.map((user) => user.status)))
    }, [users])

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Investors</CardTitle>
                        <CardDescription>View and manage all registered investors.</CardDescription>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
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

                        {/* Clear Filters Button */}
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
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Phone</TableHead>
                            <TableHead>Join Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
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
                                    <TableCell>{user.phone}</TableCell>
                                    <TableCell>{user.joinDate}</TableCell>
                                    <TableCell>
                                        <div
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${user.status === "active"
                                                    ? "bg-emerald-100/10 text-emerald-500"
                                                    : user.status === "pending"
                                                        ? "bg-yellow-100/10 text-yellow-500"
                                                        : "bg-red-100/10 text-red-500"
                                                }`}
                                        >
                                            {user.status}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/high-light-invest/users/${user.id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
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
