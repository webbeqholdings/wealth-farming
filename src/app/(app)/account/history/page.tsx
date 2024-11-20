'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TabMenu } from '@/components/w88/TabMenu'
import { accountConfig } from '@/config/accounts'

// Mock data for transactions
const transactions = [
  { id: 1, type: 'Deposit', amount: 1000, date: '2023-06-01', account: 'Main' },
  { id: 2, type: 'Withdrawal', amount: -500, date: '2023-06-05', account: 'Savings' },
  { id: 3, type: 'Transfer', amount: 200, date: '2023-06-10', account: 'Investment' },
  { id: 4, type: 'Deposit', amount: 1500, date: '2023-06-15', account: 'Main' },
  { id: 5, type: 'Withdrawal', amount: -200, date: '2023-06-20', account: 'Investment' },
]

// Mock data for chart
const chartData = [
  { name: 'Jan', deposits: 3000, withdrawals: 1400 },
  { name: 'Feb', deposits: 2000, withdrawals: 1800 },
  { name: 'Mar', deposits: 2780, withdrawals: 2100 },
  { name: 'Apr', deposits: 1890, withdrawals: 1700 },
  { name: 'May', deposits: 2390, withdrawals: 2000 },
  { name: 'Jun', deposits: 3490, withdrawals: 1500 },
]

// Mock data for accounts
const accounts = [
  { name: 'Main Account', balance: 5000, currency: 'USD' },
  { name: 'Savings Account', balance: 10000, currency: 'USD' },
  { name: 'Investment Account', balance: 15000, currency: 'USD' },
]

export default function HistoryPage() {
  const [activeTab, setActiveTab] = useState('all')

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
                    currency: account.currency,
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
                onClick={() => setActiveTab('all')}
              >
                All
              </Button>
              <Button
                variant={activeTab === 'deposits' ? 'default' : 'outline'}
                onClick={() => setActiveTab('deposits')}
              >
                Deposits
              </Button>
              <Button
                variant={activeTab === 'withdrawals' ? 'default' : 'outline'}
                onClick={() => setActiveTab('withdrawals')}
              >
                Withdrawals
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Account</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions
                  .filter(
                    (t) =>
                      activeTab === 'all' ||
                      (activeTab === 'deposits' && t.amount > 0) ||
                      (activeTab === 'withdrawals' && t.amount < 0),
                  )
                  .map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>
                        <span
                          className={transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}
                        >
                          {transaction.amount > 0 ? '+' : ''}
                          {transaction.amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </span>
                      </TableCell>
                      <TableCell>{transaction.account}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
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
