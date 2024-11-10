'use client'

import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarIcon, TrendingUpIcon, DollarSignIcon, PercentIcon } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

const financialProducts = [
  {
    id: 1,
    name: 'High-Yield Savings Account',
    description: 'Earn more interest on your savings with our competitive rates.',
    type: 'Savings',
    interestRate: '2.5%',
    minInvestment: '$100',
    term: 'No fixed term',
  },
  {
    id: 2,
    name: '5-Year CD',
    description: 'Lock in a great rate with our 5-year Certificate of Deposit.',
    type: 'CD',
    interestRate: '3.25%',
    minInvestment: '$1,000',
    term: '5 years',
  },
  {
    id: 3,
    name: 'Growth Stock ETF',
    description: 'Invest in a diversified portfolio of growth stocks.',
    type: 'ETF',
    expenseRatio: '0.45%',
    minInvestment: '$500',
    risk: 'Moderate',
  },
  {
    id: 4,
    name: 'Municipal Bond Fund',
    description: 'Tax-free income from a diversified portfolio of municipal bonds.',
    type: 'Bond Fund',
    yield: '2.8%',
    minInvestment: '$2,500',
    risk: 'Low',
  },
  {
    id: 5,
    name: 'Real Estate Investment Trust (REIT)',
    description: 'Invest in commercial real estate without directly owning properties.',
    type: 'REIT',
    dividendYield: '4.5%',
    minInvestment: '$1,000',
    risk: 'Moderate',
  },
]

export default function FinancialProductsPage() {
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const filteredProducts = financialProducts
    .filter((product) => filter === 'all' || product.type.toLowerCase() === filter)
    .filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Investment Financial Products</h1>

        <div className="mb-8">
          <Label htmlFor="search">Search Products</Label>
          <Input
            id="search"
            placeholder="Search by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger value="all" onClick={() => setFilter('all')}>
              All Products
            </TabsTrigger>
            <TabsTrigger value="savings" onClick={() => setFilter('savings')}>
              Savings
            </TabsTrigger>
            <TabsTrigger value="cd" onClick={() => setFilter('cd')}>
              CDs
            </TabsTrigger>
            <TabsTrigger value="etf" onClick={() => setFilter('etf')}>
              ETFs
            </TabsTrigger>
            <TabsTrigger value="bond fund" onClick={() => setFilter('bond fund')}>
              Bond Funds
            </TabsTrigger>
            <TabsTrigger value="reit" onClick={() => setFilter('reit')}>
              REITs
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <Badge>{product.type}</Badge>
                  {product.risk && (
                    <Badge variant={product.risk === 'Low' ? 'secondary' : 'destructive'}>
                      {product.risk} Risk
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-2">{product.name}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-2">
                  {product.interestRate && (
                    <div className="flex items-center">
                      <PercentIcon className="mr-2 h-4 w-4" />
                      <span>Interest Rate: {product.interestRate}</span>
                    </div>
                  )}
                  {product.expenseRatio && (
                    <div className="flex items-center">
                      <PercentIcon className="mr-2 h-4 w-4" />
                      <span>Expense Ratio: {product.expenseRatio}</span>
                    </div>
                  )}
                  {product.yield && (
                    <div className="flex items-center">
                      <TrendingUpIcon className="mr-2 h-4 w-4" />
                      <span>Yield: {product.yield}</span>
                    </div>
                  )}
                  {product.dividendYield && (
                    <div className="flex items-center">
                      <TrendingUpIcon className="mr-2 h-4 w-4" />
                      <span>Dividend Yield: {product.dividendYield}</span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <DollarSignIcon className="mr-2 h-4 w-4" />
                    <span>Min Investment: {product.minInvestment}</span>
                  </div>
                  {product.term && (
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Term: {product.term}</span>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full">Learn More & Invest</Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
