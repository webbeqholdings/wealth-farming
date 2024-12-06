'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import UserStatus from '@/lib/userStatus'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import {
  DollarSignIcon,
  PercentIcon,
  AlertTriangleIcon,
  BarChartIcon,
  CalendarIcon
} from 'lucide-react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { toast } from '@/hooks/use-toast'
import { format } from 'date-fns';

// Mock data for a single financial product
const product = {
  id: 1,
  name: 'Growth Stock ETF',
  description: 'Invest in a diversified portfolio of growth stocks with our high-performing ETF.',
  type: 'ETF',
  expenseRatio: '0.45%',
  minInvestment: 500,
  maxInvestment: 1000000,
  risk: 'Moderate',
  interestRate: 0.07, // 7% annual interest rate
  historicalReturns: [
    { year: 2019, return: 28.9 },
    { year: 2020, return: 22.4 },
    { year: 2021, return: 18.7 },
    { year: 2022, return: -12.3 },
    { year: 2023, return: 15.8 },
  ],
  holdings: [
    { name: 'Apple Inc.', percentage: 8.5 },
    { name: 'Microsoft Corp.', percentage: 7.2 },
    { name: 'Amazon.com Inc.', percentage: 6.8 },
    { name: 'Alphabet Inc.', percentage: 5.9 },
    { name: 'Tesla Inc.', percentage: 4.3 },
  ],
}

export default function ProductDetailPage() {
  const { isLoggedIn, loading, user } = UserStatus();
  const [financialProducts, setFinancialProducts] = useState(null)
  const [investmentAmount, setInvestmentAmount] = useState(product.minInvestment)
  const [simulatedReturns, setSimulatedReturns] = useState<{ year: number; balance: number }[]>([])
  const router = useRouter()
  // const searchParams = useSearchParams();

  const handleInvest = async () => {
    try {
      // If still loading, show a loading indicator (or spinner)
      if (loading) {
        return <div>Loading...</div>; // You can replace this with a loading spinner component if desired
      }

      // If the user is not logged in, redirect to the join page
      if (!isLoggedIn) {
        router.push('/join');
        return <div>Redirecting...</div>; // Optional: Show a redirect message
      }
      const productId = localStorage.getItem('product_id');
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
          user_id: user.id,
          product_id: productId,
          amount: investmentAmount,
          status: "pending",
          type: "investment"
        }), // Convert the request body to JSON
      });

      if (!response.ok) {
        // Parse the error response to retrieve the error message
        const errorResponse = await response.json();
        const errorMessage = errorResponse.response?.error || 'An unknown error occurred';
        throw new Error(errorMessage);
      }
      router.push('/account/history')
      toast({
        title: 'Investment Successfully',
      })
    }
    catch (error) {
      console.log('Error creating transaction:', error);
      toast({
        title: `${error}`
      });
    }
  }

  // Fetch and format data from the API
  useEffect(() => {
    async function fetchInvestmentProducts() {
      try {
        const productId = localStorage.getItem('product_id');
        const response = await fetch(`/api/investment-products/${productId}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json() // Assuming API response contains `docs` array
        const formattedProducts = {
          id: data.id,
          name: data.product_name,
          description: data.description || 'No description available.',
          type: data?.fund.name, // Default type for all products
          interestRate: `${data.interest_rate_from}% - ${data.interest_rate_to}%`,
          minInvestment: `${data.min_investment}`,
          maxInvestment: `${data.max_investment}`,
          term: data.profit_period
            ? data.profit_period.replace('_', ' ').toUpperCase()
            : 'N/A',
          startDate: data.start_date,
          endDate: data.end_date,
          status: data.status,
        }
        setFinancialProducts(formattedProducts)
      } catch (error) {
        console.error('Failed to fetch investment products:', error)
      }
    }
    fetchInvestmentProducts()
  }, [])

  useEffect(() => {
    const simulateReturns = () => {
      let balance = investmentAmount
      const returns = []
      for (let year = 1; year <= 10; year++) {
        balance *= 1 + product.interestRate
        returns.push({ year, balance: Math.round(balance) })
      }
      setSimulatedReturns(returns)
    }

    simulateReturns()
  }, [investmentAmount])

  const chartConfig = {
    return: {
      label: 'Return',
      color: 'hsl(var(--chart-1))',
    },
    balance: {
      label: 'Balance',
      color: 'hsl(var(--chart-2))',
    },
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <Button variant="outline" className="mb-4" onClick={() => router.back()}>
          &larr; Back to Products
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Badge>{financialProducts?.type}</Badge>
              <Badge variant={product.risk === 'Low' ? 'secondary' : 'destructive'}>
                {product.risk} Risk
              </Badge>
            </div>
            <CardTitle className="text-3xl">{financialProducts?.name}</CardTitle>
            <CardDescription className="text-lg">{financialProducts?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <PercentIcon className="mr-2 h-5 w-5" />
                <span>Expense Ratio: {product.expenseRatio}</span>
              </div>
              <div className="flex items-center">
                <DollarSignIcon className="mr-2 h-5 w-5" />
                <span>Min Investment: ${financialProducts?.minInvestment}</span>
                <DollarSignIcon className="ml-10 h-5 w-5" />
                <span>Max Investment: ${financialProducts?.maxInvestment}</span>
              </div>

              {/* Start and End Date */}
              {financialProducts?.startDate && (
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  <span>Start Date: {format(new Date(financialProducts?.startDate), 'MMM dd, yyyy')}</span>
                </div>
              )}

              {financialProducts?.endDate && (
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-5 w-5" />
                  <span>End Date: {format(new Date(financialProducts?.endDate), 'MMM dd, yyyy')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="mb-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="holdings">Holdings</TabsTrigger>
            <TabsTrigger value="simulator">Return Simulator</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Product Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  The {financialProducts?.name} offers investors exposure to a carefully selected portfolio of
                  growth stocks. This ETF aims to provide long-term capital appreciation by
                  investing in companies with above-average growth potential.
                </p>
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Key Features:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Diversified exposure to growth stocks</li>
                    <li>Professional management</li>
                    <li>Low expense ratio compared to actively managed funds</li>
                    <li>Potential for higher returns (with corresponding higher risk)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={product.historicalReturns}>
                      <XAxis dataKey="year" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="return"
                        stroke="var(--color-return)"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="space-y-4 mt-4">
                  {product.historicalReturns.map((yearData) => (
                    <div key={yearData.year} className="flex items-center justify-between">
                      <span>{yearData.year}</span>
                      <div className="flex items-center">
                        <span className={yearData.return >= 0 ? 'text-green-600' : 'text-red-600'}>
                          {yearData.return >= 0 ? '+' : ''}
                          {yearData.return}%
                        </span>
                        <BarChartIcon className="ml-2 h-5 w-5" />
                      </div>
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm text-gray-500">
                  Past performance does not guarantee future results.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="holdings">
            <Card>
              <CardHeader>
                <CardTitle>Top Holdings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {product.holdings.map((holding) => (
                    <div key={holding.name} className="flex items-center justify-between">
                      <span>{holding.name}</span>
                      <Badge variant="secondary">{holding.percentage}%</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="simulator">
            <Card>
              <CardHeader>
                <CardTitle>Return Simulator</CardTitle>
                <CardDescription>
                  See potential returns based on your investment amount
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-4">
                  <div>
                    <Label htmlFor="investment-amount">Investment Amount ($)</Label>
                    <Input
                      id="investment-amount"
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                      min={product.minInvestment}
                      max={product.maxInvestment}
                    />
                  </div>
                  <div>
                    <Label>Adjust Investment</Label>
                    <Slider
                      value={[investmentAmount]}
                      onValueChange={(value) => setInvestmentAmount(value[0])}
                      max={product.maxInvestment}
                      min={product.minInvestment}
                      step={100}
                    />
                  </div>
                </div>
                <ChartContainer config={chartConfig} className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulatedReturns}>
                      <XAxis dataKey="year" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="balance"
                        stroke="var(--color-balance)"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <p className="mt-4 text-sm text-gray-500">
                  This simulation assumes a fixed annual return of {product.interestRate * 100}% and
                  does not account for market fluctuations or fees.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Financial Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Annual Report 2023</span>
                    <Button asChild>
                      <a
                        href="/reports/annual-report-2023.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download PDF
                      </a>
                    </Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Quarterly Report Q4 2023</span>
                    <Button asChild>
                      <a
                        href="/reports/quarterly-report-q4-2023.pdf"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download PDF
                      </a>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Invest in {financialProducts?.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="investment-amount">Investment Amount ($)</Label>
                <Input
                  id="investment-amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                  min={product.minInvestment}
                  max={product.maxInvestment}
                />
              </div>
              <div>
                <Label>Adjust Investment</Label>
                <Slider
                  value={[investmentAmount]}
                  onValueChange={(value) => setInvestmentAmount(value[0])}
                  max={product.maxInvestment}
                  min={product.minInvestment}
                  step={100}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between items-center">
            <div className="flex items-center text-yellow-600">
              <AlertTriangleIcon className="mr-2 h-5 w-5" />
              <span className="text-sm">Investment carries risk</span>
            </div>
            <Button onClick={handleInvest}>Invest Now</Button>
          </CardFooter>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
