'use client'

import { useState, useEffect, use } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
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

// Mock data for chart
const chartData = [
  { name: 'Jan', deposits: 3000, withdrawals: 1400 },
  { name: 'Feb', deposits: 2000, withdrawals: 1800 },
  { name: 'Mar', deposits: 2780, withdrawals: 2100 },
  { name: 'Apr', deposits: 1890, withdrawals: 1700 },
  { name: 'May', deposits: 2390, withdrawals: 2000 },
  { name: 'Jun', deposits: 3490, withdrawals: 1500 },
]

export default function HistoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()

  const slug = use(params).slug
  const tab =
    slug === 'withdraw' || slug === 'transfer' || slug === 'bonus' || slug === 'investment'
      ? slug
      : 'deposit' // Deposit tab as default
  const { t } = useTranslation()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState(tab)
  const [transactions, setTransactions] = useState([])
  const [accounts, setAccounts] = useState([])
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const { theme, setTheme } = useTheme()
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  // const [user, setUser] = useState(null)
  const [accountData, setAccountData] = useState(null)

  useEffect(() => {
    const fetchAccounts = async () => {
      const _user = await me()

      setUser(_user)

      let _accounts = await getAccountsByUser(_user.id)
      let _accountData = []

      for (const _acc of _accounts) {
        _accountData.push({
          type: _acc.type,
          balance: await getSumAmountBalanceByAccount(_acc.id),
          account_number: _acc.account_number,
        })
      }

      setAccountData(_accountData)
      console.log(accountData)

      // Update Code

      setAccounts(_accounts) // Store the transformed accounts in state
      setLoading(false)
    }

    fetchAccounts()
  }, [loading])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { docs, totalPages } = await getTransactions(currentPage, 10, activeTab)

        setTransactions(docs) // Store the accounts in state
        setTotalPages(totalPages)
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }

    fetchTransactions()
  }, [loading, activeTab, currentPage])

  // Update Start Date & End Date
  const fetchData = async () => {
    try {
      const { docs, totalPages } = await getTransactions(currentPage, 10, activeTab)

      setTransactions(docs) // Store the accounts in state
      setTotalPages(totalPages)
    } catch (error) {
      console.error('Failed to fetch accounts:', error)
    }
  }

  const handleEndDateSelect = (date: Date) => {
    if (date) {
      const updatedEndDate = new Date(date)
      updatedEndDate.setHours(23, 59, 59, 999)
      setEndDate(updatedEndDate)
    } else {
      setEndDate(date)
    }
  }

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

  function filterDate() {
    const fetchTransactions = async () => {
      try {
        const { docs, totalPages } = await getTransactionsWithDate(
          currentPage,
          10,
          activeTab,
          startDate.toISOString(),
          endDate.toISOString(),
        )
        setTransactions(docs) // Store the transactions in state

        setTotalPages(totalPages)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      }
    }
    fetchTransactions() // Invoke the asynchronous function
  }
  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <Spinner /> // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!user) {
    router.push('/join')
    return <Spinner /> // Optional: Show a redirect message
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

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">{t('tranfer_history_Header_title')}</h1>
        <TabMenu items={accountConfig.tabList} defaultValue="history" />
        {/* Wallet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-6">
          {accountData.map((data: any) => (
            <Card key={data.type}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{data.type.toString()}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {data.balance.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">{t('balance')}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transactions Table and Chart */}
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
                      {startDate ? format(startDate, 'PPP') : <span>Start Date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={setStartDate}
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

              <div className="flex space-x-2 items-center">
                <Button
                  variant={activeTab === 'deposit' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('deposit')
                    setCurrentPage(1)
                  }}
                >
                  {t('tranfer_history_table_button_1')}
                </Button>
                <Button
                  variant={activeTab === 'withdraw' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('withdraw')
                    setCurrentPage(1)
                  }}
                >
                  {t('tranfer_history_table_button_2')}
                </Button>
                <Button
                  variant={activeTab === 'transfer' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('transfer')
                    setCurrentPage(1)
                  }}
                >
                  {t('tranfer_history_table_button_3')}
                </Button>
                <Button
                  variant={activeTab === 'investment' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('investment')
                    setCurrentPage(1)
                  }}
                >
                  {t('tranfer_history_table_button_4')}
                </Button>
                <Button
                  variant={activeTab === 'bonus' ? 'default' : 'outline'}
                  onClick={() => {
                    setActiveTab('bonus')
                    setCurrentPage(1)
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

            <Table id="tableContent">
              <TableHeader>
                <TableRow>
                  <TableHead>{t('date')}</TableHead>
                  <TableHead>{t('type')}</TableHead>
                  {activeTab === 'all' || activeTab === 'investment' ? (
                    <TableHead>{t('product')}</TableHead>
                  ) : (
                    ''
                  )}
                  <TableHead>{t('money_amount')}</TableHead>
                  {activeTab === 'investment' ? <TableHead>{t('portfolio_profit')}</TableHead> : ''}
                  {activeTab !== 'transfer' ? <TableHead>{t('account')}</TableHead> : ''}
                  {activeTab === 'transfer' ? <TableHead>{t('tranfer_from')}</TableHead> : ''}
                  {activeTab === 'transfer' ? <TableHead>{t('tranfer_to')}</TableHead> : ''}
                  {activeTab === 'deposit' || activeTab === 'withdraw' || activeTab === 'bonus' ? (
                    <TableHead>{t('status')}</TableHead>
                  ) : (
                    ''
                  )}
                  {activeTab === 'bonus' ? (
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
                      (activeTab === 'deposit' && t.type == 'deposit') ||
                      (activeTab === 'withdraw' && t.type == 'withdraw') ||
                      (activeTab === 'transfer' && t.type == 'transfer') ||
                      (activeTab === 'investment' && t.type == 'investment') ||
                      (activeTab === 'bonus' && t.type == 'bonus'),
                  )
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        {transaction.type.charAt(0).toUpperCase() +
                          transaction.type.slice(1).toLowerCase()}
                      </TableCell>
                      {activeTab === 'all' || activeTab === 'investment' ? (
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
                      {activeTab === 'investment' ? (
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
                      {activeTab === 'deposit' || activeTab === 'bonus' ? (
                        <TableCell>{transaction.to_account}</TableCell>
                      ) : (
                        <TableCell>{transaction.account}</TableCell>
                      )}
                      {/* <TableCell>{transaction.account}</TableCell> */}
                      {activeTab === 'transfer' ? (
                        <TableCell>{transaction.to_account}</TableCell>
                      ) : (
                        ''
                      )}
                      {activeTab === 'deposit' ||
                      activeTab === 'withdraw' ||
                      activeTab === 'bonus' ? (
                        <TableCell
                          className={clsx({
                            'text-yellow-500': transaction.status === 'pending', // Yellow font
                            'text-green-500': transaction.status === 'completed', // Green font
                            'text-red-500': transaction.status === 'failed', // Red font
                          })}
                        >
                          {transaction.status}
                        </TableCell>
                      ) : (
                        ''
                      )}
                      {activeTab === 'bonus' ? <TableHead>{transaction.message}</TableHead> : ''}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {transactions && transactions.length > 0 ? (
              <div className="flex justify-end mt-4 mb-4">
                <Pagination className="cursor-pointer">
                  <PaginationPrevious
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    className="text-sm font-medium rounded-lg hover:bg-gray-100"
                  >
                    {t('previous')}
                  </PaginationPrevious>
                  <PaginationContent>
                    {[...Array(totalPages)].map((_, index) => (
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
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                  >
                    {t('next')}
                  </PaginationNext>
                </Pagination>
              </div>
            ) : (
              <></>
            )}
          </TabsContent>
        </Tabs>

        {/* Tips and Tricks */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Tips & Tricks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                Set up automatic transfers to your savings account to build your wealth
                consistently.
              </li>
              <li>Review your transaction history regularly to track your spending habits.</li>
              <li>
                Consider setting up alerts for large transactions to monitor your account activity.
              </li>
              <li>
                Take advantage of our investment account to potentially grow your wealth faster.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
