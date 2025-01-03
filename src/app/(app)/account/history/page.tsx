'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import clsx from 'clsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { DollarSign } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TabMenu } from '@/components/w88/TabMenu'
import { accountConfig } from '@/config/accounts'
import { formatDateTime } from '@/utilities/formatDateTime'
import UserStatus from '@/lib/userStatus'
import { getTransactions } from '@/lib/transaction'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import Spinner from '@/components/Spinner'

// Mock data for chart
const chartData = [
  { name: 'Jan', deposits: 3000, withdrawals: 1400 },
  { name: 'Feb', deposits: 2000, withdrawals: 1800 },
  { name: 'Mar', deposits: 2780, withdrawals: 2100 },
  { name: 'Apr', deposits: 1890, withdrawals: 1700 },
  { name: 'May', deposits: 2390, withdrawals: 2000 },
  { name: 'Jun', deposits: 3490, withdrawals: 1500 },
]

export default function HistoryPage() {
  const router = useRouter()
  const { isLoggedIn, loading, user } = UserStatus()
  const [activeTab, setActiveTab] = useState('all')
  const [transactions, setTransactions] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/accounts?where[user][equals]=${user.id}`); // Replace with dynamic user ID if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Transform API response into desired format
        const transformedAccounts = data.docs.map((account: { account_name: string, amount: number }) => ({
          name: account.account_name,
          balance: account.amount, // Assuming you want to divide the amount to convert to another unit
          currency: 'USD', // Hardcoded as 'USD', replace with dynamic value if available in the API
        }));

        setAccounts(transformedAccounts); // Store the transformed accounts in state
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts()
  }, [loading])

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const { docs, totalPages } = await getTransactions(currentPage, 10, activeTab);

        setTransactions(docs); // Store the accounts in state
        setTotalPages(totalPages);
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchTransactions();
  }, [loading, activeTab, currentPage]);

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <Spinner/>; // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join');
    return <Spinner/>; // Optional: Show a redirect message
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Transaction History</h1>
        <TabMenu items={accountConfig.tabList} defaultValue="history" />
        {/* Wallet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-6">
          {accounts.map((account) => (
            <Card key={account.name}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {account.balance.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </div>
                <p className="text-xs text-muted-foreground">Balance</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Transactions Table and Chart */}
        <Tabs defaultValue="table" className="space-y-4">
          <TabsList>
            <TabsTrigger value="table">Table View</TabsTrigger>
            <TabsTrigger value="chart">Chart View</TabsTrigger>
          </TabsList>
          <TabsContent value="table" className="space-y-4">
            <div className="flex justify-end space-x-2 mb-4">
              <Button
                variant={activeTab === 'all' ? 'default' : 'outline'}
                onClick={() => { setActiveTab('all'); setCurrentPage(1) }}
              >
                All
              </Button>
              <Button
                variant={activeTab === 'deposit' ? 'default' : 'outline'}
                onClick={() => { setActiveTab('deposit'); setCurrentPage(1) }}
              >
                Deposits
              </Button>
              <Button
                variant={activeTab === 'withdraw' ? 'default' : 'outline'}
                onClick={() => { setActiveTab('withdraw'); setCurrentPage(1) }}
              >
                Withdrawals
              </Button>
              <Button
                variant={activeTab === 'transfer' ? 'default' : 'outline'}
                onClick={() => { setActiveTab('transfer'); setCurrentPage(1) }}
              >
                Transfers
              </Button>
              <Button
                variant={activeTab === 'investment' ? 'default' : 'outline'}
                onClick={() => { setActiveTab('investment'); setCurrentPage(1) }}
              >
                Investments
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  {activeTab === 'all' || activeTab === 'investment' ? <TableHead>Product</TableHead> : ''}
                  <TableHead>Amount</TableHead>
                  {activeTab === 'all' || activeTab === 'investment' ? <TableHead>Profit</TableHead> : ''}
                  {activeTab !== 'transfer' ? <TableHead>Account</TableHead> : ''}
                  {activeTab === 'transfer' ? <TableHead>From Account</TableHead> : ''}
                  {activeTab === 'transfer' ? <TableHead>To Account</TableHead> : ''}
                  {activeTab === 'all' || activeTab === 'deposit' || activeTab === 'withdraw' ? <TableHead>Status</TableHead> : ''}
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .filter(
                    (t) =>
                      activeTab === 'all' ||
                      (activeTab === 'deposit' && t.type == 'deposit') ||
                      (activeTab === 'withdraw' && t.type == 'withdraw') ||
                      (activeTab === 'transfer' && t.type == 'transfer') ||
                      (activeTab === 'investment' && t.type == 'investment')
                  )
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1).toLowerCase()}</TableCell>
                      {activeTab === 'all' || activeTab === 'investment' ? <TableHead>{transaction.product_name}</TableHead> : ''}
                      <TableCell>
                        <span
                          className={transaction.amount >= 0 && transaction.profit_or_loss >= 0 ? 'text-green-600' : 'text-red-600'}
                        >
                          {transaction.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </span>
                      </TableCell>
                      {activeTab === 'all' || activeTab === 'investment' ? <TableCell><span
                        className={transaction.amount >= 0 && transaction.profit_or_loss >= 0 ? 'text-green-600' : 'text-red-600'}
                      >{transaction.profit_or_loss}{transaction.unit_code}</span></TableCell> : ''}
                      <TableCell>{transaction.account}</TableCell>
                      {activeTab === 'transfers' ? <TableCell>{transaction.to_account}</TableCell> : ''}
                      {activeTab === 'all' || activeTab === 'deposit' || activeTab === 'withdraw' ? (
                        <TableCell
                          className={clsx({
                            'text-yellow-500': transaction.status === 'pending',  // Yellow font
                            'text-green-500': transaction.status === 'completed', // Green font
                            'text-red-500': transaction.status === 'failed',      // Red font
                          })}
                        >
                          {transaction.status}
                        </TableCell>
                      ) : (
                        ''
                      )}
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
            {transactions && transactions.length > 0 ? <div className="flex justify-end mt-4 mb-4">
              <Pagination className="cursor-pointer">
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="text-sm font-medium rounded-lg hover:bg-gray-100"
                >
                  Previous
                </PaginationPrevious>
                <PaginationContent>
                  {[...Array(totalPages)].map((_, index) => (
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
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg hover:bg-gray-100"
                >
                  Next
                </PaginationNext>
              </Pagination>
            </div> : <></>}
          </TabsContent>
          <TabsContent value="chart">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>Deposits and withdrawals over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" stroke="#888888" />
                    <YAxis stroke="#888888" />
                    <Tooltip />
                    <Bar dataKey="deposits" fill="#4ade80" name="Deposits" />
                    <Bar dataKey="withdrawals" fill="#f87171" name="Withdrawals" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
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
