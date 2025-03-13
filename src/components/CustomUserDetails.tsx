'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DollarSign } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TabMenu } from '@/components/w88/TabMenu'
import { accountConfig } from '@/config/accounts'

import {
  getTransactions,
  getTransactionsWithDate,
  getSumAmountBalanceByAccount,
} from '@/lib/transaction'
import { getAccountsByUser } from '@/lib/account'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import Spinner from '@/components/Spinner'
import { printPdf } from '@/components/printPdf'
import { useTheme } from 'next-themes'
import { format } from 'date-fns'
import { CalendarIcon, ArrowDownToLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useTranslation } from 'react-i18next'
import { me } from '@/lib/me'
import { useGetMessage } from '@/utilities/getMessage'
import { useDocumentInfo } from '@payloadcms/ui'
import {
  getTransactionsByUser,
  getTransactionsWithDateByUser,
  getContractsByUser,
  getContractsWithDateByUser,
  getWithdrawalsByUser,
  getWithdrawalsWithDateByUser,
} from '@/lib/admin-only-view'
import { TrendingUp } from 'lucide-react'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import '@/i18n/i18n.tsx'

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
  note: string
}

export default function CustomUserDetails({ params }: { params: Promise<{ slug: string }> }) {
  //Transactions
  const router = useRouter()
  const { t } = useTranslation()
  const [activeTabTransactions, setActiveTabTransactions] = useState('deposit')
  const [transactions, setTransactions] = useState([])
  const [totalPagesTransactions, setTotalPagesTransactions] = useState(1)
  const [currentPageTransactions, setCurrentPageTransactions] = useState(1)
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [startDateTransactions, setStartDateTransactions] = useState<Date>()
  const [endDateTransactions, setEndDateTransactions] = useState<Date>()
  const getMessage = useGetMessage()

  //Contracts
  const [investments, setInvestments] = useState<Investment[]>()
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>()
  const [currentPageContracts, setCurrentPageContracts] = useState(1)
  const [totalPageInvestments, setTotalPagesInvestment] = useState(1)
  const [totalPageWithdrawl, setTotalPagesWithdrawl] = useState(1)
  const [activeTabContracts, setActiveTabContracts] = useState('investment')
  const [startDateContracts, setStartDateContracts] = useState<Date>()
  const [endDateContracts, setEndDateContracts] = useState<Date>()

  const { id } = useDocumentInfo()
  const userId = Number(id)

  {
    /* TRANSACTIONS*/
  }

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { docs, totalPages } = await getTransactionsByUser(
          userId,
          currentPageTransactions,
          10,
          activeTabTransactions,
        )

        setTransactions(docs) // Store the accounts in state
        setTotalPagesTransactions(totalPages)
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }

    fetchTransactions()
    setLoading(false)
  }, [loading, activeTabTransactions, currentPageTransactions])

  // Update Start Date & End Date
  const fetchDataTransactions = async () => {
    try {
      const { docs, totalPages } = await getTransactionsByUser(
        userId,
        currentPageTransactions,
        10,
        activeTabTransactions,
      )

      setTransactions(docs) // Store the accounts in state
      setTotalPagesTransactions(totalPages)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }

  const handleEndDateTransactionsSelect = (date: Date) => {
    if (date) {
      const updatedEndDateTransactions = new Date(date)
      updatedEndDateTransactions.setHours(23, 59, 59, 999)
      setEndDateTransactions(updatedEndDateTransactions)
    } else {
      setEndDateTransactions(date)
    }
  }

  useEffect(() => {
    if (startDateTransactions && endDateTransactions) {
      if (!(startDateTransactions instanceof Date) || !(endDateTransactions instanceof Date)) {
        console.error('Start date or end date is not a valid Date object.')
        return
      }
      if (startDateTransactions > endDateTransactions) {
        console.error('Start date must be earlier than or equal to end date')
        return
      }

      filterDateTransactions()
    } else {
      fetchDataTransactions()
    }
  }, [startDateTransactions, endDateTransactions, activeTabTransactions])

  function filterDateTransactions() {
    const fetchTransactions = async () => {
      try {
        const { docs, totalPages } = await getTransactionsWithDateByUser(
          userId,
          currentPageTransactions,
          10,
          activeTabTransactions,
          startDateTransactions.toISOString(),
          endDateTransactions.toISOString(),
        )
        setTransactions(docs) // Store the transactions in state

        setTotalPagesTransactions(totalPages)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      }
    }
    fetchTransactions() // Invoke the asynchronous function
  }

  const handleExportPdf = async (element: string) => {
    if (theme === 'dark') {
      setTheme('light')
      await printPdf(element, false)
      setTheme('dark')
    } else {
      await printPdf(element, false)
    }
  }

  {
    /* CONTRACTS */
  }

  const fetchDataContracts = useCallback(async () => {
    if (activeTabContracts === 'investment') {
      const { docs, totalPages } = await getContractsByUser(userId, currentPageContracts, 10)
      setInvestments(docs)
      setTotalPagesInvestment(totalPages)
      const initialCheckedStates = docs.reduce((acc: any, investment: any) => {
        acc[investment.id] = investment.setting?.extend_contract === true || false
        return acc
      }, {})
    } else if (activeTabContracts === 'withdraw') {
      const { docs, totalPages } = await getWithdrawalsByUser(userId, currentPageContracts, 10)
      setWithdrawals(docs)
      setTotalPagesWithdrawl(totalPages)
    }
  }, [activeTabContracts, currentPageContracts, loading])

  // Call fetchData in useEffect
  useEffect(() => {
    fetchDataContracts()
  }, [fetchDataContracts])

  useEffect(() => {
    if (startDateContracts && endDateContracts) {
      if (!(startDateContracts instanceof Date) || !(endDateContracts instanceof Date)) {
        console.error('Start date or end date is not a valid Date object.')
        return
      }
      if (startDateContracts > endDateContracts) {
        console.error('Start date must be earlier than or equal to end date')
        return
      }
      filterDateContracts()
    } else {
      fetchDataContracts()
    }
  }, [startDateContracts, endDateContracts, activeTabContracts])

  // Update Start Date & End Date
  const handleEndDateContractsSelect = (date: Date) => {
    if (date) {
      const updatedEndDateContracts = new Date(date)
      updatedEndDateContracts.setHours(23, 59, 59, 999)
      setEndDateContracts(updatedEndDateContracts)
    } else {
      setEndDateContracts(date)
    }
  }

  function filterDateContracts() {
    const fetchContracts = async () => {
      try {
        if (activeTabContracts === 'investment') {
          const { docs, totalPages } = await getContractsWithDateByUser(
            userId,
            currentPageContracts,
            10,
            startDateContracts.toISOString(),
            endDateContracts.toISOString(),
          )
          setInvestments(docs)
          setTotalPagesInvestment(totalPages)
          const initialCheckedStates = docs.reduce((acc: any, investment: any) => {
            acc[investment.id] = investment.setting?.extend_contract === true || false
            return acc
          }, {})
        } else if (activeTabContracts === 'withdraw') {
          const { docs, totalPages } = await getWithdrawalsWithDateByUser(
            userId,
            currentPageContracts,
            10,
            startDateContracts.toISOString(),
            endDateContracts.toISOString(),
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

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <Spinner /> // You can replace this with a loading spinner component if desired
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8">
        {/* OVERVIEW INFOMATION*/}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="  shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium ">Total Investment</CardTitle>
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
              <CardTitle className="text-sm font-medium ">Total Profit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {transactions &&
                  formatCurrency(transactions.filter(t => t.type == 'bonus')
                  .reduce((sum, inv) => sum + inv.amount, 0))
                }
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TRANSACTION TABLE*/}
        <h1 className="text-3xl font-bold my-8">{t('tranfer_history_Header_title')}</h1>

        <Tabs defaultValue="table" className="space-y-4">
          <TabsContent value="table" className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
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
                      {startDateTransactions ? (
                        format(startDateTransactions, 'PPP')
                      ) : (
                        <span>{t('start_date')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDateTransactions}
                      onSelect={setStartDateTransactions}
                      initialFocus
                    />
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
                      {endDateTransactions ? (
                        format(endDateTransactions, 'PPP')
                      ) : (
                        <span>{t('end_date')}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDateTransactions}
                      onSelect={(date) => {
                        handleEndDateTransactionsSelect(date)
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex space-x-2 items-center">
                <Button
                  variant={activeTabTransactions === 'deposit' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTabTransactions('deposit')
                    setCurrentPageTransactions(1)
                  }}
                >
                  {t('tranfer_history_table_button_1')}
                </Button>
                <Button
                  variant={activeTabTransactions === 'withdraw' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTabTransactions('withdraw')
                    setCurrentPageTransactions(1)
                  }}
                >
                  {t('tranfer_history_table_button_2')}
                </Button>
                <Button
                  variant={activeTabTransactions === 'transfer' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTabTransactions('transfer')
                    setCurrentPageTransactions(1)
                  }}
                >
                  {t('tranfer_history_table_button_3')}
                </Button>
                <Button
                  variant={activeTabTransactions === 'investment' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTabTransactions('investment')
                    setCurrentPageTransactions(1)
                  }}
                >
                  {t('tranfer_history_table_button_4')}
                </Button>
                <Button
                  variant={activeTabTransactions === 'bonus' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTabTransactions('bonus')
                    setCurrentPageTransactions(1)
                  }}
                >
                  {t('tranfer_history_table_button_5')}
                </Button>
                <div
                  className="p-2 cursor-pointer hover:bg-gray-200 rounded-md"
                  onClick={() => handleExportPdf('tableContent')}
                  title="Export to PDF"
                >
                  <ArrowDownToLine className="w-5 h-5 text-gray-600" />
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <Table id="tableContent">
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('date')}</TableHead>
                    <TableHead>{t('type')}</TableHead>
                    {activeTabTransactions === 'all' || activeTabTransactions === 'investment' ? (
                      <TableHead>{t('product')}</TableHead>
                    ) : (
                      ''
                    )}
                    <TableHead>{t('money_amount')}</TableHead>
                    {activeTabTransactions === 'investment' ? (
                      <TableHead>{t('portfolio_profit')}</TableHead>
                    ) : (
                      ''
                    )}
                    {activeTabTransactions !== 'transfer' ? (
                      <TableHead>{t('account')}</TableHead>
                    ) : (
                      ''
                    )}
                    {activeTabTransactions === 'transfer' ? (
                      <TableHead>{t('tranfer_from')}</TableHead>
                    ) : (
                      ''
                    )}
                    {activeTabTransactions === 'transfer' ? (
                      <TableHead>{t('tranfer_to')}</TableHead>
                    ) : (
                      ''
                    )}
                    {activeTabTransactions === 'deposit' ||
                    activeTabTransactions === 'withdraw' ||
                    activeTabTransactions === 'bonus' ? (
                      <TableHead>{t('status')}</TableHead>
                    ) : (
                      ''
                    )}
                    {activeTabTransactions === 'bonus' ||
                    activeTabTransactions === 'withdraw' ||
                    activeTabTransactions === 'deposit' ? (
                      <TableHead>{t('portfolio_withdraw_message')}</TableHead>
                    ) : (
                      ''
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions
                    .filter(
                      (t) =>
                        (activeTabTransactions === 'deposit' && t.type == 'deposit') ||
                        (activeTabTransactions === 'withdraw' && t.type == 'withdraw') ||
                        (activeTabTransactions === 'transfer' && t.type == 'transfer') ||
                        (activeTabTransactions === 'investment' && t.type == 'investment') ||
                        (activeTabTransactions === 'bonus' && t.type == 'bonus'),
                    )
                    .map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell>
                          {t(transaction.type).charAt(0).toUpperCase() +
                            t(transaction.type).slice(1).toLowerCase()}
                        </TableCell>
                        {activeTabTransactions === 'all' ||
                        activeTabTransactions === 'investment' ? (
                          <TableHead>{transaction.product_name}</TableHead>
                        ) : (
                          ''
                        )}
                        <TableCell>
                          <span
                            // className={
                            //   transaction.amount >= 0 && transaction.profit_or_loss >= 0
                            //     ? 'text-green-600'
                            //     : 'text-red-600'
                            // }
                            className={clsx({
                              'text-green-600':
                                transaction.amount >= 0 && transaction.profit_or_loss >= 0,
                              'text-red-600':
                                transaction.status === 'failed' || transaction.amount < 0,
                            })}
                          >
                            {transaction.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            })}
                          </span>
                        </TableCell>
                        {activeTabTransactions === 'investment' ? (
                          <TableCell>
                            <span
                              className={
                                transaction.amount >= 0 && transaction.profit_or_loss >= 0
                                  ? 'text-green-600'
                                  : 'text-red-600'
                              }
                            >
                              {transaction.profit_or_loss}
                              {transaction.unit_code}
                            </span>
                          </TableCell>
                        ) : (
                          ''
                        )}
                        {activeTabTransactions === 'deposit' ||
                        activeTabTransactions === 'bonus' ? (
                          <TableCell>{t(transaction.account_from)}</TableCell>
                        ) : (
                          <TableCell>{t(transaction.account)}</TableCell>
                        )}
                        {/* <TableCell>{transaction.account}</TableCell> */}
                        {activeTabTransactions === 'transfer' ? (
                          <TableCell>{t(transaction.account_from)}</TableCell>
                        ) : (
                          ''
                        )}
                        {activeTabTransactions === 'deposit' ||
                        activeTabTransactions === 'withdraw' ||
                        activeTabTransactions === 'bonus' ? (
                          <TableCell
                            className={clsx({
                              'text-yellow-500': transaction.status === 'pending', // Yellow font
                              'text-green-500': transaction.status === 'completed', // Green font
                              'text-red-500': transaction.status === 'failed', // Red font
                            })}
                          >
                            {t(transaction.status)}
                          </TableCell>
                        ) : (
                          ''
                        )}
                        {activeTabTransactions === 'bonus' ||
                        activeTabTransactions == 'withdraw' ||
                        activeTabTransactions == 'deposit' ? (
                          <TableHead>
                            {transaction.note != null && transaction.status == 'failed'
                              ? transaction.note
                              : transaction.message != null
                                ? getMessage(transaction.message)
                                : ''}
                          </TableHead>
                        ) : (
                          ''
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
              {transactions && transactions.length > 0 ? (
                <div className="flex justify-end mt-4 mb-4">
                  <Pagination className="cursor-pointer">
                    <PaginationPrevious
                      onClick={() => setCurrentPageTransactions((prev) => Math.max(prev - 1, 1))}
                      className="text-sm font-medium rounded-lg hover:bg-gray-100"
                    >
                      {t('previous')}
                    </PaginationPrevious>
                    <PaginationContent className="list-none p-0">
                      {[...Array(totalPagesTransactions)].map((_, index) => (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => setCurrentPageTransactions(index + 1)}
                            isActive={currentPageTransactions === index + 1}
                            className={`text-sm font-medium rounded-lg ${
                              currentPageTransactions === index + 1 ? 'border-gray-400' : ''
                            }`}
                          >
                            {index + 1}
                          </PaginationLink>
                        </PaginationItem>
                      ))}
                    </PaginationContent>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPageTransactions((prev) =>
                          Math.min(prev + 1, totalPagesTransactions),
                        )
                      }
                      className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                    >
                      {t('next')}
                    </PaginationNext>
                  </Pagination>
                </div>
              ) : (
                <></>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* CONTRACTS TABLE */}
        <h1 className="text-3xl font-bold my-8">Contracts</h1>
        <div className="mx-auto space-y-6">
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
                    {startDateContracts ? (
                      format(startDateContracts, 'PPP')
                    ) : (
                      <span>{t('start_date')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDateContracts}
                    onSelect={setStartDateContracts}
                    initialFocus
                  />
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
                    {endDateContracts ? (
                      format(endDateContracts, 'PPP')
                    ) : (
                      <span>{t('end_date')}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDateContracts}
                    onSelect={(date) => {
                      handleEndDateContractsSelect(date)
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant={activeTabContracts === 'investment' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTabContracts('investment')
                  setCurrentPageContracts(1)
                }}
              >
                {t('portfolio_tab_investment')}
              </Button>
              <Button
                variant={activeTabContracts === 'withdraw' ? 'default' : 'outline'}
                onClick={() => {
                  setActiveTabContracts('withdraw')
                  setCurrentPageContracts(1)
                }}
              >
                {t('portfolio_tab_withdraw')}
              </Button>
            </div>
          </div>
          <Card className=" shadow-sm">
            <CardContent className="p-0">
              {activeTabContracts === 'investment' ? (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t('portfolio_productName')}</TableHead>
                        <TableHead>{t('portfolio_investedAmount')}</TableHead>
                        <TableHead>{t('portfolio_expectedReturn')}</TableHead>
                        <TableHead>{t('portfolio_availableBalance')}</TableHead>
                        <TableHead>{t('portfolio_profit')}</TableHead>
                        <TableHead>{t('portfolio_rate')}</TableHead>
                        <TableHead>{t('portfolio_term')}</TableHead>
                        <TableHead>{t('portfolio_startDate')}</TableHead>
                        <TableHead>{t('portfolio_endDate')}</TableHead>
                        <TableHead>{t('portfolio_status')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {investments &&
                        investments.map((investment) => (
                          <TableRow key={investment.id}>
                            <TableCell className="font-medium">{investment.productName}</TableCell>
                            <TableCell>{formatCurrency(investment.investedAmount)}</TableCell>
                            <TableCell>{formatCurrency(investment.expectedReturn)}</TableCell>
                            <TableCell className="text-green-500">
                              {formatCurrency(investment.availableBalance)}
                            </TableCell>
                            <TableCell>{formatCurrency(investment.profit)}</TableCell>
                            <TableCell>{(investment.rateOfReturn * 100).toFixed(2)}%</TableCell>
                            <TableCell className="whitespace-nowrap overflow-hidden text-ellipsis">
                              {t('portfolio_term_' + investment.term)}
                            </TableCell>
                            <TableCell>
                              {new Date(investment.startDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              {new Date(investment.endDate).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap overflow-hidden text-ellipsis ${getStatusColor(
                                  investment.status,
                                )}`}
                              >
                                {t(investment.status)}
                              </span>
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
                          onClick={() => setCurrentPageContracts((prev) => Math.max(prev - 1, 1))}
                          className="text-sm font-medium rounded-lg hover:bg-gray-100"
                        ></PaginationPrevious>
                        <PaginationContent className="list-none p-0">
                          {[...Array(totalPageInvestments)].map((_, index) => (
                            <PaginationItem key={index}>
                              <PaginationLink
                                onClick={() => setCurrentPageContracts(index + 1)}
                                isActive={currentPageContracts === index + 1}
                                className={`text-sm font-medium rounded-lg ${
                                  currentPageContracts === index + 1 ? 'border-gray-400' : ''
                                }`}
                              >
                                {index + 1}
                              </PaginationLink>
                            </PaginationItem>
                          ))}
                        </PaginationContent>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPageContracts((prev) =>
                              Math.min(prev + 1, totalPageInvestments),
                            )
                          }
                          className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                        ></PaginationNext>
                      </Pagination>
                    </div>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-4">
                        {t('portfolio_empty_contract')}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ) : (
                <>
                  <Table>
                    <TableHeader>
                      <TableRow className=" ">
                        <TableHead>{t('portfolio_productName')}</TableHead>
                        <TableHead>{t('portfolio_withdraw_amount')}</TableHead>
                        <TableHead>{t('portfolio_withdraw_date')}</TableHead>
                        <TableHead>{t('portfolio_status')}</TableHead>
                        <TableHead>{t('portfolio_withdraw_message')}</TableHead>
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
                                {t(
                                  withdrawal.status.charAt(0).toUpperCase() +
                                    withdrawal.status.slice(1),
                                )}
                              </span>
                            </TableCell>
                            <TableCell>
                              {withdrawal.note != null && withdrawal.status == 'failed'
                                ? withdrawal.note
                                : getMessage(withdrawal.message)}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                  {withdrawals && withdrawals.length > 0 ? (
                    <div className="flex justify-end mt-4 mb-4">
                      <Pagination className="cursor-pointer">
                        <PaginationPrevious
                          onClick={() => setCurrentPageContracts((prev) => Math.max(prev - 1, 1))}
                          className="text-sm font-medium rounded-lg hover:bg-gray-100"
                        >
                          {t('previous')}
                        </PaginationPrevious>
                        <PaginationContent>
                          {[...Array(totalPageWithdrawl)].map((_, index) => (
                            <PaginationItem key={index}>
                              <PaginationLink
                                onClick={() => setCurrentPageContracts(index + 1)}
                                isActive={currentPageContracts === index + 1}
                                className={`text-sm font-medium rounded-lg ${
                                  currentPageContracts === index + 1 ? 'border-gray-400' : ''
                                }`}
                              >
                                {index + 1}
                              </PaginationLink>{' '}
                            </PaginationItem>
                          ))}
                        </PaginationContent>
                        <PaginationNext
                          onClick={() =>
                            setCurrentPageContracts((prev) =>
                              Math.min(prev + 1, totalPageWithdrawl),
                            )
                          }
                          className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                        >
                          {t('next')}
                        </PaginationNext>
                      </Pagination>
                    </div>
                  ) : (
                    <TableRow>
                      <TableCell colSpan={11} className="text-center py-4">
                        {t('portfolio_empty_contract_withdraw')}
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
