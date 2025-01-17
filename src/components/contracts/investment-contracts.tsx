'use client'

import { useState, useEffect, useCallback } from 'react'
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
import {
  getContracts,
  getWithdrawals,
  updateSetting,
  getContractsWithDate,
  getWithdrawalsWithDate,
  getEligibleContracts,
} from '@/lib/contract'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import Spinner from '../Spinner'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { LucideBan, LucideBanknote, Settings } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'

interface Investment {
  id: string
  userId: string
  productName: string
  investedAmount: number
  minInvestment: number
  extendContract: number
  expectedReturn: number
  availableBalance: number
  rateOfReturn: number
  term: string
  periods: string
  profit: number
  startDate: Date
  endDate: Date
  setting: {
    auto_profit: number | null
    extend_contract: boolean | null
  }
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
  const { isLoggedIn, loading, user } = userStatus()
  const { toast } = useToast()
  // const [selectedContract, setSelectedContract] = useState<Investment | null>(null)
  // const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  // const [terminationDialogOpen, setTerminationDialogOpen] = useState(false)
  const [investments, setInvestments] = useState<Investment[]>()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>()
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPageInvestments, setTotalPagesInvestment] = useState(1)
  const [totalPageWithdrawl, setTotalPagesWithdrawl] = useState(1)
  const [activeTab, setActiveTab] = useState('investment')
  const [checkedStates, setCheckedStates] = useState<any>({})
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  // Handle tab switch and data fetching
  // Unified fetchData function
  const fetchData = useCallback(async () => {
    if (activeTab === 'investment') {
      const { docs, totalPages } = await getContracts(currentPage, 10)
      setInvestments(docs)
      setTotalPagesInvestment(totalPages)
      const initialCheckedStates = docs.reduce((acc: any, investment: any) => {
        acc[investment.id] = investment.setting?.extend_contract === true || false
        return acc
      }, {})
      setCheckedStates(initialCheckedStates)
    } else if (activeTab === 'withdraw') {
      const { docs, totalPages } = await getWithdrawals(currentPage, 10)
      setWithdrawals(docs)
      setTotalPagesWithdrawl(totalPages)
    }
    const { docs: eligibleDocs } = await getEligibleContracts()
    console.log('Eligible Contracts:', eligibleDocs)
  }, [activeTab, currentPage])

  // Call fetchData in useEffect
  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (startDate && endDate) {
      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        console.error('Start date or end date is not a valid Date object.')
        return
      }
      if (startDate > endDate) {
        console.error('Start date must be earlier than or equal to end date')
        return
      }
      filterDate()
    } else {
      fetchData()
    }
  }, [startDate, endDate, activeTab])

  // Update Start Date & End Date
  const handleEndDateSelect = (date: Date) => {
    if (date) {
      const updatedEndDate = new Date(date)
      updatedEndDate.setHours(23, 59, 59, 999)
      setEndDate(updatedEndDate)
    } else {
      setEndDate(date)
    }
  }

  function filterDate() {
    const fetchContracts = async () => {
      try {
        if (activeTab === 'investment') {
          const { docs, totalPages } = await getContractsWithDate(
            currentPage,
            10,
            startDate.toISOString(),
            endDate.toISOString(),
          )
          setInvestments(docs)
          setTotalPagesInvestment(totalPages)
          const initialCheckedStates = docs.reduce((acc: any, investment: any) => {
            acc[investment.id] = investment.setting?.extend_contract === true || false
            return acc
          }, {})
          setCheckedStates(initialCheckedStates)
        } else if (activeTab === 'withdraw') {
          const { docs, totalPages } = await getWithdrawalsWithDate(
            currentPage,
            10,
            startDate.toISOString(),
            endDate.toISOString(),
          )
          setWithdrawals(docs)
          setTotalPagesWithdrawl(totalPages)
        }
      } catch (error) {
        console.error('Failed to fetch contracts:', error)
      }
    }
    fetchContracts()
  }

  // Calculate ROI
  const calculateROI = () => {
    if (!investments || investments.length === 0) return 0

    const totalInvested = investments.reduce((sum, inv) => sum + inv.investedAmount, 0)
    const totalExpected = investments.reduce((sum, inv) => sum + inv.expectedReturn, 0)

    if (totalInvested === 0) return 0

    return ((totalExpected - totalInvested) / totalInvested) * 100
  }

  // const handleWithdraw = (investment: Investment) => {
  //   setSelectedContract(investment)
  //   setWithdrawDialogOpen(true)
  // }
  // const handleTerminate = (investment: Investment) => {
  //   setSelectedContract(investment)
  //   setTerminationDialogOpen(true)
  // }

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

  const handleInvestmentClick = (investment: Investment) => {
    router.push(`/investment-contracts/contract-details?type=investment&id=${investment.id}`)
  }

  if (loading) {
    return <Spinner />
  }

  if (!isLoggedIn) {
    router.push('/join')
    return <Spinner />
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
              <CardTitle className="text-sm font-medium ">Total Invested</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">
                {investments &&
                  formatCurrency(investments.reduce((sum, inv) => sum + inv.investedAmount, 0))}
              </div>
            </CardContent>
          </Card>
          <Card className="  shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium ">Total Available Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {investments &&
                  formatCurrency(investments.reduce((sum, inv) => sum + inv.availableBalance, 0))}
              </div>
            </CardContent>
          </Card>
          <Card className="  shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium ">Active Investments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold ">
                {investments && investments.filter((inv) => inv.status === 'active').length}
              </div>
            </CardContent>
          </Card>
          <Card className="  shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium ">Expected ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {investments ? `${calculateROI().toFixed(2)}%` : '0.00%'}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2">
          <div className="flex space-x-2 justify-start">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !Date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon />
                  {startDate ? format(startDate, 'PPP') : <span>Start Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[240px] justify-start text-left font-normal',
                    !Date && 'text-muted-foreground',
                  )}
                >
                  <CalendarIcon />
                  {endDate ? format(endDate, 'PPP') : <span>End Date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    handleEndDateSelect(date)
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              variant={activeTab === 'investment' ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab('investment')
                setCurrentPage(1)
              }}
            >
              Investment
            </Button>
            <Button
              variant={activeTab === 'withdraw' ? 'default' : 'outline'}
              onClick={() => {
                setActiveTab('withdraw')
                setCurrentPage(1)
              }}
            >
              Withdraw
            </Button>
          </div>
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
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {investments &&
                      investments.map((investment) => (
                        <TableRow key={investment.id}>
                          <TableCell className="font-medium ">{investment.productName}</TableCell>
                          <TableCell>{formatCurrency(investment.investedAmount)}</TableCell>
                          <TableCell>{formatCurrency(investment.expectedReturn)}</TableCell>
                          <TableCell className="text-green-500">
                            {formatCurrency(investment.availableBalance)}
                          </TableCell>
                          <TableCell>{formatCurrency(investment.profit)}</TableCell>
                          <TableCell>{(investment.rateOfReturn * 100).toFixed(2)}%</TableCell>
                          <TableCell>{investment.term}</TableCell>
                          <TableCell>
                            {new Date(investment.startDate).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            {investment.endDate
                              ? new Date(investment.endDate).toLocaleDateString()
                              : ''}
                          </TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                investment.status,
                              )}`}
                            >
                              {investment.status.charAt(0).toUpperCase() +
                                investment.status.slice(1)}
                            </span>
                          </TableCell>

                          <TableCell
                            className="text-right relative flex items-center space-x-2 cursor-pointer hover:underline"
                            onClick={() => handleInvestmentClick(investment)}
                          >
                            Investment Details
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {/* Pagination Component */}
                {investments && investments.length > 0 ? (
                  <div className="flex justify-end mt-4 mb-4">
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
                              className={`text-sm font-medium rounded-lg ${
                                currentPage === index + 1 ? 'border-gray-400' : ''
                              }`}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      </PaginationContent>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPageInvestments))
                        }
                        className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                      >
                        Next
                      </PaginationNext>
                    </Pagination>
                  </div>
                ) : (
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
                    {withdrawals &&
                      withdrawals.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="font-medium ">{withdrawal.productName}</TableCell>
                          <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                          <TableCell>{new Date(withdrawal.date).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                                withdrawal.status,
                              )}`}
                            >
                              {withdrawal.status.charAt(0).toUpperCase() +
                                withdrawal.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell>{withdrawal.message}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
                {withdrawals && withdrawals.length > 0 ? (
                  <div className="flex justify-end mt-4 mb-4">
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
                              className={`text-sm font-medium rounded-lg ${
                                currentPage === index + 1 ? 'border-gray-400' : ''
                              }`}
                            >
                              {index + 1}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                      </PaginationContent>
                      <PaginationNext
                        onClick={() =>
                          setCurrentPage((prev) => Math.min(prev + 1, totalPageWithdrawl))
                        }
                        className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                      >
                        Next
                      </PaginationNext>
                    </Pagination>
                  </div>
                ) : (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-4">
                      There are no withdrawal contracts in your portfolio.
                    </TableCell>
                  </TableRow>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* {selectedContract && (
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
      )} */}
    </div>
  )
}
