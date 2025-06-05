"use client"

import { useState, useMemo, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUp, Plus } from "lucide-react"
import TablePagination from "@/components/high-light-invest/table-pagination"
import { getTransactionsByContractId, type Transaction } from "@/lib/high-light-invest-hooks"

interface ContractTransactionsTableProps {
    contractId: string
}

export default function ContractTransactionsTable({ contractId }: ContractTransactionsTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [loading, setLoading] = useState(true)

    // Fetch transactions data
    useEffect(() => {
        async function fetchTransactions() {
            try {
                const data = await getTransactionsByContractId(contractId)
                setTransactions(data)
            } catch (error) {
                console.error("Error fetching transactions:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchTransactions()
    }, [contractId])

    // Calculate pagination
    const paginatedTransactions = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize
        return transactions.slice(startIndex, startIndex + pageSize)
    }, [transactions, currentPage, pageSize])

    const totalPages = Math.ceil(transactions.length / pageSize)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handlePageSizeChange = (size: number) => {
        setPageSize(size)
        setCurrentPage(1) // Reset to first page when changing page size
    }

    // Calculate totals by type
    const totals = transactions.reduce(
        (acc, transaction) => {
            if (transaction.type === "investment") {
                acc.investment += transaction.amount
            } else if (transaction.type === "withdraw") {
                acc.withdraw += transaction.amount
            } else if (transaction.type === "profit") {
                acc.profit += transaction.amount
            }
            return acc
        },
        { investment: 0, withdraw: 0, profit: 0 },
    )

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Transactions</CardTitle>
                    <CardDescription>Loading transaction data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <div>
                        <CardTitle>Transactions</CardTitle>
                        <CardDescription>All financial transactions for this contract.</CardDescription>
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
                                <div className="text-sm font-medium text-muted-foreground">Total Profit</div>
                                <div className="flex items-center text-yellow-500">
                                    <Plus className="h-4 w-4 mr-1" />
                                </div>
                            </div>
                            <div className="text-2xl font-bold mt-1">${totals.profit.toLocaleString()}</div>
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
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${transaction.type === "investment"
                                                    ? "bg-emerald-100/10 text-emerald-500"
                                                    : transaction.type === "withdraw"
                                                        ? "bg-red-100/10 text-red-500"
                                                        : "bg-yellow-100/10 text-yellow-500"
                                                }`}
                                        >
                                            {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                                        </div>
                                    </TableCell>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell
                                        className={`text-right ${transaction.type === "withdraw" ? "text-red-500" : "text-emerald-500"}`}
                                    >
                                        {transaction.type === "withdraw" ? "-" : "+"}${transaction.amount.toLocaleString()}
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
                    totalItems={transactions.length}
                    pageSize={pageSize}
                    onPageChange={handlePageChange}
                    onPageSizeChange={handlePageSizeChange}
                />
            </CardFooter>
        </Card>
    )
}
