'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import { WithdrawDialog } from '@/components/withdraw-dialog'
import { TerminationDialog } from '../termination-dialog'
import userStatus from '@/lib/userStatus'
import { useRouter } from 'next/navigation'
import { getContracts, getWithdrawals } from '@/lib/contract'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface Investment {
    id: string
    userId: string
    productName: string
    investedAmount: number
    minInvestment: number
    expectedReturn: number
    availableBalance: number,
    rateOfReturn: number,
    term: string,
    periods: string,
    profit: number,
    startDate: Date,
    endDate: Date,
    status: 'active' | 'completed' | 'pending' | 'inactive'
    lastWithdrawal?: string
}

interface Withdrawal {
    id: string
    productName: string
    amount: number
    date: string
    status: 'completed' | 'pending' | 'failed'
    message: string
}


export function InvestmentContracts() {
    const router = useRouter()
    const { isLoggedIn, loading, user } = userStatus();
    const [selectedContract, setSelectedContract] = useState<Investment | null>(null)
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
    const [terminationDialogOpen, setTerminationDialogOpen] = useState(false)
    const [investments, setInvestments] = useState<Investment[]>()
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>()
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPageInvestments, setTotalPagesInvestment] = useState(1);
    const [totalPageWithdrawl, setTotalPagesWithdrawl] = useState(1);
    const [activeTab, setActiveTab] = useState('investment')
    // Handle tab switch and data fetching
    useEffect(() => {
        const fetchData = async () => {
            if (activeTab === 'investment') {
                const { docs, totalPages } = await getContracts(currentPage, 10);
                setInvestments(docs);
                setTotalPagesInvestment(totalPages);
            } else if (activeTab === 'withdraw') {
                const { docs, totalPages } = await getWithdrawals(currentPage, 10);
                setWithdrawals(docs);
                setTotalPagesWithdrawl(totalPages)
            }
        };
        fetchData();
    }, [activeTab, currentPage]);

    // Calculate ROI
    const calculateROI = () => {
        if (!investments || investments.length === 0) return 0;

        const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0);
        const totalExpected = investments.reduce((sum, inv) => sum + inv.expectedReturn, 0);

        if (totalInvested === 0) return 0;

        return ((totalExpected - totalInvested) / totalInvested) * 100;
    };

    const handleWithdraw = (investment: Investment) => {
        setSelectedContract(investment)
        setWithdrawDialogOpen(true)
    }
    const handleTerminate = (investment: Investment) => {
        setSelectedContract(investment)
        setTerminationDialogOpen(true)
    }

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount)
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
            case 'completed':
                return 'bg-green-500/20 text-green-500'
            case 'pending':
                return 'bg-yellow-500/20 text-yellow-500'
            case 'failed':
                return 'bg-red-500/20 text-red-500'
            default:
                return 'bg-gray-500/20 text-gray-500'
        }
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        router.push('/join');
        return <div>Redirecting...</div>;
    }

    return (
        <div className="min-h-screen p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Portfolio</h1>
                        <p className="">Manage your investments and withdrawals</p>
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
                                {investments && formatCurrency(
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
                                {investments && formatCurrency(
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
                                {investments && investments.filter((inv) => inv.status === 'active').length}
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
                            <div className="text-2xl font-bold text-green-500">
                                {investments ? `${calculateROI().toFixed(2)}%` : '0.00%'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end space-x-2 mb-4">
                    <Button
                        variant={activeTab === 'investment' ? 'default' : 'outline'}
                        onClick={() => { setActiveTab('investment'); setCurrentPage(1) }}
                    >
                        Investment
                    </Button>
                    <Button
                        variant={activeTab === 'withdraw' ? 'default' : 'outline'}
                        onClick={() => { setActiveTab('withdraw'); setCurrentPage(1) }}
                    >
                        Withdraw
                    </Button>
                </div>

                <Card className=" shadow-sm">
                    <CardContent className="p-0">
                        {activeTab === 'investment' ? (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Invested Amount</TableHead>
                                            <TableHead>Expected Return</TableHead>
                                            <TableHead>Available Balance</TableHead>
                                            <TableHead>Profit</TableHead>
                                            <TableHead>Rate</TableHead>
                                            <TableHead>Term</TableHead>
                                            <TableHead>Start Date</TableHead>
                                            <TableHead>End Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {investments && investments.map((investment) => (
                                            <TableRow key={investment.id}>
                                                <TableCell className="font-medium">{investment.productName}</TableCell>
                                                <TableCell>{formatCurrency(investment.investedAmount)}</TableCell>
                                                <TableCell>{formatCurrency(investment.expectedReturn)}</TableCell>
                                                <TableCell className="text-green-500">
                                                    {formatCurrency(investment.availableBalance)}
                                                </TableCell>
                                                <TableCell>{formatCurrency(investment.profit)}</TableCell>
                                                <TableCell>{(investment.rateOfReturn * 100).toFixed(2)}%</TableCell>
                                                <TableCell>{investment.term}</TableCell>
                                                <TableCell>{new Date(investment.startDate).toLocaleDateString()}</TableCell>
                                                <TableCell>{new Date(investment.endDate).toLocaleDateString()}</TableCell>
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
                                                        className="hover:text-black"
                                                    >
                                                        Withdraw
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleTerminate(investment)}
                                                        className="hover:text-red-500 ml-2"
                                                    >
                                                        Termination
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {/* Pagination Component */}
                                {investments && investments.length > 0 ? <div className="flex justify-end mt-4 mb-4">
                                    <Pagination className="cursor-pointer">
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className="text-sm font-medium rounded-lg hover:bg-gray-100"
                                        >
                                            Previous
                                        </PaginationPrevious>
                                        <PaginationContent>
                                            {[...Array(totalPageInvestments)].map((_, index) => (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(index + 1)}
                                                        isActive={currentPage === index + 1}
                                                        className={`text-sm font-medium rounded-lg ${currentPage === index + 1
                                                            ? 'border-gray-400'
                                                            : ''
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                        </PaginationContent>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPageInvestments))}
                                            className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                                        >
                                            Next
                                        </PaginationNext>
                                    </Pagination>
                                </div> : (
                                    <TableRow>
                                        <TableCell colSpan={11} className="text-center py-4">
                                            There are no contracts in your portfolio.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow className=" ">
                                            <TableHead>Product Name</TableHead>
                                            <TableHead>Amount</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Message</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {withdrawals && withdrawals.map((withdrawal) => (
                                            <TableRow
                                                key={withdrawal.id}
                                            >
                                                <TableCell className="font-medium ">
                                                    {withdrawal.productName}
                                                </TableCell>
                                                <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                                                <TableCell>{new Date(withdrawal.date).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                                            withdrawal.status
                                                        )}`}
                                                    >
                                                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    {withdrawal.message}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                {withdrawals && withdrawals.length > 0 ? <div className="flex justify-end mt-4 mb-4">
                                    <Pagination className="cursor-pointer">
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                            className="text-sm font-medium rounded-lg hover:bg-gray-100"
                                        >
                                            Previous
                                        </PaginationPrevious>
                                        <PaginationContent>
                                            {[...Array(totalPageWithdrawl)].map((_, index) => (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        onClick={() => setCurrentPage(index + 1)}
                                                        isActive={currentPage === index + 1}
                                                        className={`text-sm font-medium rounded-lg ${currentPage === index + 1
                                                            ? 'border-gray-400'
                                                            : ''
                                                            }`}
                                                    >
                                                        {index + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            ))}
                                        </PaginationContent>
                                        <PaginationNext
                                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPageWithdrawl))}
                                            className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                                        >
                                            Next
                                        </PaginationNext>
                                    </Pagination>
                                </div> : <TableRow>
                                    <TableCell colSpan={11} className="text-center py-4">
                                        There are no withdrawal contracts in your portfolio.
                                    </TableCell>
                                </TableRow>}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {selectedContract && (
                <WithdrawDialog
                    isOpen={withdrawDialogOpen}
                    onClose={() => setWithdrawDialogOpen(false)}
                    contract={selectedContract}
                    setActiveTab={setActiveTab}
                />
            )}
            {selectedContract && (
                <TerminationDialog
                    isOpen={terminationDialogOpen}
                    onClose={() => setTerminationDialogOpen(false)}
                    contract={selectedContract}
                    setActiveTab={setActiveTab}
                />
            )}
        </div>
    )
}