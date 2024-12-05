'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  ArrowUpIcon,
  ArrowDownIcon,
  TrendingUpIcon,
  FlameIcon,
  DollarSignIcon,
  BarChart3Icon,
} from 'lucide-react'
import { LineChart, Line } from 'recharts'

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'May', value: 189 },
  { name: 'Jun', value: 239 },
  { name: 'Jul', value: 349 },
]

const TrendingCoin = ({
  rank,
  icon,
  name,
  price,
  change,
}: {
  rank: number
  icon: string
  name: string
  price: number
  change: number
}) => (
  <div className="flex items-center justify-between py-1 text-xs sm:text-sm">
    <div className="flex items-center gap-1 overflow-hidden">
      <span className="text-muted-foreground">{rank}</span>
      <span className="text-base">{icon}</span>
      <span className="font-medium truncate">{name}</span>
    </div>
    <div className="flex items-center gap-1 flex-shrink-0">
      <span className="font-medium">${price.toFixed(6)}</span>
      <Badge variant={change >= 0 ? 'default' : 'destructive'} className="text-[10px] px-1 py-0">
        <span className="flex items-center">
          {change >= 0 ? (
            <ArrowUpIcon className="w-2 h-2 mr-0.5" />
          ) : (
            <ArrowDownIcon className="w-2 h-2 mr-0.5" />
          )}
          {Math.abs(change).toFixed(2)}%
        </span>
      </Badge>
    </div>
  </div>
)

export default function CryptoDashboard() {
  return (
    <div className="">
      <div className="bg-background">
        <h2 className="text-3xl font-bold mb-8">Today is Cryptocurrency Prices by WF</h2>
        {/* <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-1">
          Today is Cryptocurrency Prices by Market Cap
        </h2> */}
        <p className="text-xs sm:text-sm text-muted-foreground">
          The global crypto market cap is $3.68T, a{' '}
          <span className="text-green-500">5.32% increase</span> over the last day.{' '}
          <a href="#" className="text-blue-500 hover:underline">
            Read More
          </a>
        </p>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {/* First Column - Trending Coins */}
        <Card className="bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Trending Coins</CardTitle>
            <div className="flex gap-1">
              <span className="p-1 rounded-full bg-background/90 text-xs">🔥</span>
              <span className="p-1 rounded-full bg-background/90 text-xs">⏰</span>
              <span className="p-1 rounded-full bg-background/90 text-xs">👁️</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm">
            <TrendingCoin rank={1} icon="💱" name="XRP" price={2.42} change={2.11} />
            <TrendingCoin rank={2} icon="🐶" name="ALPHADOGE" price={0.002229} change={192.46} />
            <TrendingCoin rank={3} icon="💱" name="SXCH" price={0.03282} change={-2.85} />
            <TrendingCoin rank={4} icon="🟣" name="MAD" price={0.0000416} change={1.87} />
            <TrendingCoin rank={5} icon="Ξ" name="ETH" price={3910.49} change={3.95} />
          </CardContent>
        </Card>

        {/* Second Column - Trending on DexScan */}
        <Card className="bg-background/95">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Trending on DexScan</CardTitle>
            <div className="flex gap-1">
              <span className="p-1 rounded-full bg-background/90 text-xs">⚡</span>
              <span className="p-1 rounded-full bg-background/90 text-xs">💎</span>
              <span className="p-1 rounded-full bg-background/90 text-xs">🏆</span>
            </div>
          </CardHeader>
          <CardContent className="text-xs sm:text-sm">
            <TrendingCoin rank={1} icon="🦅" name="HAWK/WETH" price={0.00452} change={9999} />
            <TrendingCoin rank={2} icon="💰" name="$$/SOL" price={0.0561} change={-35.4} />
            <TrendingCoin rank={3} icon="🐶" name="CHIDO/WETH" price={0.01022} change={-27.04} />
            <TrendingCoin rank={4} icon="🔵" name="UNOPETIT/SOL" price={0.0001628} change={25.56} />
            <TrendingCoin
              rank={5}
              icon="🦅"
              name="HawkTuah/SOL"
              price={0.0007932}
              change={-36.58}
            />
          </CardContent>
        </Card>

        {/* Third Column - 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Market Cap</CardTitle>
              <DollarSignIcon className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">$3.68T</div>
              <div className="text-[10px] text-green-500">+5.32%</div>
              <div className="h-[30px] mt-1">
                <LineChart width={70} height={30} data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Volume</CardTitle>
              <BarChart3Icon className="h-3 w-3 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">$358.26B</div>
              <div className="text-[10px] text-green-500">+38.22%</div>
              <div className="h-[30px] mt-1">
                <LineChart width={70} height={30} data={data}>
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#22c55e"
                    strokeWidth={1}
                    dot={false}
                  />
                </LineChart>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Fear & Greed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center">
                <div className="relative w-12 h-12">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" strokeWidth="10" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="10"
                      strokeDasharray="282.7"
                      strokeDashoffset="42.4"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold">84</span>
                  </div>
                </div>
              </div>
              <p className="text-center mt-1 text-[10px]">Extreme greed</p>
            </CardContent>
          </Card>

          <Card className="bg-background/95">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1">
              <CardTitle className="text-xs font-medium">Dominance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 text-xs">
                <div className="flex items-center">
                  <span className="text-sm mr-1">₿</span>
                  <span className="font-medium">54.61%</span>
                </div>
                <div className="flex items-center">
                  <span className="text-sm mr-1">Ξ</span>
                  <span className="font-medium">12.84%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Fourth Column - Live Chat and App Download */}
        <div className="flex flex-col gap-4">
          <Card className="bg-blue-600 text-white">
            <CardContent className="p-3">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-xs">📊 Live</span>
                    <span className="text-[10px] bg-blue-500/50 px-1 py-0.5 rounded">
                      433 listening
                    </span>
                  </div>
                  <h3 className="font-bold text-sm mb-1 truncate">
                    $BTC soars $100k! What is next?
                  </h3>
                  <div className="flex -space-x-1">
                    <img
                      src="/placeholder.svg?height=20&width=20"
                      alt="User"
                      className="w-5 h-5 rounded-full border-2 border-blue-600"
                    />
                    <img
                      src="/placeholder.svg?height=20&width=20"
                      alt="User"
                      className="w-5 h-5 rounded-full border-2 border-blue-600"
                    />
                    <img
                      src="/placeholder.svg?height=20&width=20"
                      alt="User"
                      className="w-5 h-5 rounded-full border-2 border-blue-600"
                    />
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/20 rounded flex items-center justify-center flex-shrink-0">
                  <span className="text-xl">📈</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-600 text-white">
            <CardContent className="p-3 flex items-center gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-xs mb-0.5 truncate">Download CMC Mobile App Now!</h3>
                <p className="text-[10px] text-blue-100 truncate">
                  All your crypto essentials at your fingertips.
                </p>
              </div>
              <div className="w-12 h-12 bg-white p-0.5 rounded flex-shrink-0">
                <img
                  src="/placeholder.svg?height=48&width=48"
                  alt="QR Code"
                  className="w-full h-full"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
