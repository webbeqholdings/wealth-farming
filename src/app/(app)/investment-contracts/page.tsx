'use client'

import { useState } from 'react'
import { ArrowUpDown, Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { WithdrawDialog } from '@/components/withdraw-dialog'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

interface Investment {
    id: string
    productName: string
    investedAmount: number
    expectedReturn: number
    availableBalance: number
    startDate: string
    endDate: string
    status: 'active' | 'completed' | 'pending'
    lastWithdrawal?: string
}

export default function InvestmentContracts() {
    const [selectedContract, setSelectedContract] = useState<Investment | null>(null)
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)

    const [investments] = useState<Investment[]>([
        {
            id: '1',
            productName: 'Green Energy Fund',
            investedAmount: 10000,
            expectedReturn: 12000,
            availableBalance: 11000,
            startDate: '2024-01-01',
            endDate: '2024-12-31',
            status: 'active',
            lastWithdrawal: '2024-01-15'
        },
        {
            id: '2',
            productName: 'Sustainable Agriculture',
            investedAmount: 25000,
            expectedReturn: 31250,
            availableBalance: 27500,
            startDate: '2024-02-15',
            endDate: '2025-02-15',
            status: 'active',
            lastWithdrawal: '2024-02-20'
        },
        {
            id: '3',
            productName: 'Tech Innovation Fund',
            investedAmount: 15000,
            expectedReturn: 18750,
            availableBalance: 16200,
            startDate: '2023-12-01',
            endDate: '2024-11-30',
            status: 'active'
        },
        {
            id: '4',
            productName: 'Real Estate Development',
            investedAmount: 50000,
            expectedReturn: 65000,
            availableBalance: 55000,
            startDate: '2023-11-15',
            endDate: '2024-11-15',
            status: 'active',
            lastWithdrawal: '2024-01-30'
        },
    ])

    const handleWithdraw = (investment: Investment) => {
        setSelectedContract(investment)
        setWithdrawDialogOpen(true)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const calculateDaysRemaining = (endDate: string) => {
        const end = new Date(endDate)
        const today = new Date()
        const diffTime = end.getTime() - today.getTime()
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-500/20 text-green-500'
            case 'completed':
                return 'bg-blue-500/20 text-blue-500'
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-500'
            default:
                return 'bg-gray-500/20 '
        }
    }

    return (
        <div>
            <SiteHeader />
            <div className="min-h-screen p-6">
                <div className="max-w-7xl mx-auto space-y-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold">Investment Contracts</h1>
                            <p className="">Manage your investments and withdrawals</p>
                        </div>
                        <div className="flex gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 " />
                                <Input
                                    placeholder="Search contracts..."
                                    className="pl-8  "
                                />
                            </div>
                            <Button variant="outline" className=" ">
                                <ArrowUpDown className="h-4 w-4 mr-2" />
                                Sort
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="  shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium ">
                                    Total Invested
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold ">
                                    {formatCurrency(
                                        investments.reduce((sum, inv) => sum + inv.investedAmount, 0)
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="  shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium ">
                                    Total Available Balance
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-500">
                                    {formatCurrency(
                                        investments.reduce((sum, inv) => sum + inv.availableBalance, 0)
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="  shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium ">
                                    Active Investments
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold ">
                                    {investments.filter((inv) => inv.status === 'active').length}
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="  shadow-sm">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium ">
                                    Expected ROI
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold ">25%</div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card className=" shadow-sm">
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow className=" ">
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Invested Amount</TableHead>
                                        <TableHead>Available Balance</TableHead>
                                        <TableHead>Expected Return</TableHead>
                                        <TableHead>Days Remaining</TableHead>
                                        <TableHead>Last Withdrawal</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {investments.map((investment) => (
                                        <TableRow
                                            key={investment.id}
                                        >
                                            <TableCell className="font-medium ">
                                                {investment.productName}
                                            </TableCell>
                                            <TableCell>{formatCurrency(investment.investedAmount)}</TableCell>
                                            <TableCell className="text-green-500">
                                                {formatCurrency(investment.availableBalance)}
                                            </TableCell>
                                            <TableCell>{formatCurrency(investment.expectedReturn)}</TableCell>
                                            <TableCell>{calculateDaysRemaining(investment.endDate)} days</TableCell>
                                            <TableCell>
                                                {investment.lastWithdrawal
                                                    ? new Date(investment.lastWithdrawal).toLocaleDateString()
                                                    : 'No withdrawals'}
                                            </TableCell>
                                            <TableCell>
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                        investment.status
                                                    )}`}
                                                >
                                                    {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleWithdraw(investment)}
                                                    className=" hover:text-black"
                                                >
                                                    Withdraw
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>

                {selectedContract && (
                    <WithdrawDialog
                        isOpen={withdrawDialogOpen}
                        onClose={() => setWithdrawDialogOpen(false)}
                        contract={selectedContract}
                    />
                )}
            </div>
            <SiteFooter />
        </div>
    )
}

