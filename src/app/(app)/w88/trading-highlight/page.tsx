import { FundingVolumeChart } from '@/components/w88/FundingVolumeChart'
import { HighlightCard } from '@/components/w88/HightlightCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DollarSign, Users, TrendingUp, Briefcase } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function TradingPage() {
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Wealth Farming Fund Highlight</h1>

        {/* Highlight Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <HighlightCard
            title="Total Assets Under Management"
            value="$284.5M"
            description="Total value of all managed assets"
            icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 2.5, isPositive: true }}
          />
          <HighlightCard
            title="Active Investors"
            value="12,345"
            description="Number of investors with active investments"
            icon={<Users className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 5.1, isPositive: true }}
          />
          <HighlightCard
            title="Average ROI"
            value="8.7%"
            description="Average return on investment across all projects"
            icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
            trend={{ value: 0.3, isPositive: false }}
          />
          <HighlightCard
            title="Active Projects"
            value="73"
            description="Number of ongoing investment projects"
            icon={<Briefcase className="h-4 w-4 text-muted-foreground" />}
          />
        </div>

        {/* Main Content */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FundingVolumeChart />
          </div>
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full">Start a New Investment</Button>
                <Button className="w-full" variant="outline">
                  View My Portfolio
                </Button>
                <Button className="w-full" variant="outline">
                  Deposit Funds
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent News</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>New high-yield farming opportunity available</li>
                  <li>Q2 returns exceed expectations by 15%</li>
                  <li>Platform security update: What you need to know</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
