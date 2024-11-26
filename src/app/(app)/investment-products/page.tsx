'use client'

import { useEffect, useState } from 'react'
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CalendarIcon, DollarSignIcon, PercentIcon } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useRouter } from 'next/navigation';

export default function FinancialProductsPage() {
  const [financialProducts, setFinancialProducts] = useState([])
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  interface Fund {
    name: string;
  }

  interface InvestmentProduct {
    id: string;
    product_name: string;
    description?: string;
    interest_rate_from: number;
    interest_rate_to: number;
    min_investment: number;
    profit_period?: string;
    status: string;
    fund: Fund
  }
  // Fetch and format data from the API
  useEffect(() => {
    async function fetchInvestmentProducts() {
      try {
        const response = await fetch('/api/investment-products?limit=1000')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }

        const { docs } = await response.json() // Assuming API response contains `docs` array
        const formattedProducts = docs.map((product: InvestmentProduct) => ({
          id: product.id,
          name: product.product_name,
          description: product.description || 'No description available.',
          type: product?.fund.name, // Default type for all products
          interestRate: `${product.interest_rate_from}% - ${product.interest_rate_to}%`,
          minInvestment: `$${product.min_investment}`,
          term: product.profit_period
            ? product.profit_period.replace('_', ' ').toUpperCase()
            : 'N/A',
          status: product.status,
        }))
        setFinancialProducts(formattedProducts)
      } catch (error) {
        console.error('Failed to fetch investment products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInvestmentProducts()
  }, [])

  const filteredProducts = financialProducts
    .filter((product) => filter === 'all' || product.type.toLowerCase() === filter.toLowerCase())
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
            {/* Add filters based on product type if available */}
            {Array.from(new Set(financialProducts.map((product) => product.type)))
              .filter(Boolean) // Remove undefined or null values
              .map((fundName) => (
                <TabsTrigger
                  key={fundName}
                  value={fundName}
                  onClick={() => setFilter(fundName)}
                >
                  {fundName}
                </TabsTrigger>
              ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <p>Loading products...</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge>{product.type}</Badge>
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
                  <Button
                    className="w-full"
                    onClick={() => {
                      // Store the product id in localStorage
                      localStorage.setItem('product_id', product.id);

                      // Navigate to the detail page
                      router.push(`/investment-products/detail`);
                    }}
                  >
                    Learn More & Invest
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
      <SiteFooter />
    </>
  )
}
