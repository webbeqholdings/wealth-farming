'use client'

import { useState, useEffect } from 'react'
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
import userStatus from '@/lib/userStatus'
import { useRouter } from 'next/navigation'
import { getContracts, getWithdrawals } from '@/lib/api/contract'

interface Investment {
    id: string
    userId: string
    productName: string
    investedAmount: number
    minInvestment: number
    expectedReturn: number
    availableBalance: number
    startDate: string
    endDate: string
    status: 'active' | 'completed' | 'pending'
    lastWithdrawal?: string
}

interface Withdrawal {
    id: string
    productName: string
    amount: number
    date: string
    status: 'completed' | 'pending' | 'failed'
}


export function InvestmentContracts() {
    const router = useRouter()
    const { isLoggedIn, loading, user } = userStatus();
    const [selectedContract, setSelectedContract] = useState<Investment | null>(null)
    const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
    const [investments, setInvestments] = useState<Investment[]>()
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>()
    const [activeTab, setActiveTab] = useState('investment')
    // Handle tab switch and data fetching
    useEffect(() => {
        const fetchData = async () => {
            if (activeTab === 'investment') {
                const newInvestments = await getContracts();
                setInvestments(newInvestments);
            } else if (activeTab === 'withdraw') {
                const newWithdrawals = await getWithdrawals();
                setWithdrawals(newWithdrawals);
            }
        };
        fetchData();
    }, [activeTab]);

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
                            <div className="text-2xl font-bold ">25%</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="flex justify-end space-x-2 mb-4">
                    <Button
                        variant={activeTab === 'investment' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('investment')}
                    >
                        Investment
                    </Button>
                    <Button
                        variant={activeTab === 'withdraw' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('withdraw')}
                    >
                        Withdraw
                    </Button>
                </div>

                <Card className=" shadow-sm">
                    <CardContent className="p-0">
                        {activeTab === 'investment' ? (
                            <Table>
                                <TableHeader>
                                    <TableRow className=" ">
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Invested Amount</TableHead>
                                        <TableHead>Available Balance</TableHead>
                                        <TableHead>Expected Return</TableHead>
                                        <TableHead>Start Date</TableHead>
                                        <TableHead>End Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {investments && investments.map((investment) => (
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
                                                    className=" hover:text-black"
                                                >
                                                    Withdraw
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className=" ">
                                        <TableHead>Product Name</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
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
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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
        </div>
    )
}

