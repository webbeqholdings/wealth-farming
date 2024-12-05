'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ArrowUpIcon, ArrowDownIcon, Loader2, StarIcon } from 'lucide-react'
import CryptoDashboard from '@/components/crypto/CryptoDashboard'
type Network = {
  id: string
  name: string
  icon: string
}

const networks: Network[] = [
  { id: 'all', name: 'All Networks', icon: '🌐' },
  { id: 'solana', name: 'Solana', icon: '◎' },
  { id: 'ethereum', name: 'Ethereum', icon: 'Ξ' },
  { id: 'base', name: 'Base', icon: '🔵' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '⚡' },
  { id: 'bsc', name: 'BSC', icon: '🟡' },
  { id: 'tron', name: 'TRON', icon: '🔴' },
  { id: 'avalanche', name: 'Avalanche', icon: '🔺' },
  { id: 'polygon', name: 'Polygon', icon: '💜' },
]

type TradingPair = {
  id: string
  pair: string
  dex: string
  price: number
  change_1h: number
  change_24h: number
  txns_24h: number
  volume_24h: number
  liquidity: number
  fdv: number
  icon: string
}

export default function TrendingCryptoPage() {
  const [selectedNetwork, setSelectedNetwork] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const [pairs, setPairs] = useState<TradingPair[]>([
    {
      id: '1',
      pair: 'SHIRO/WETH',
      dex: 'ShiroNeko',
      price: 0.001413,
      change_1h: 4.63,
      change_24h: 29.68,
      txns_24h: 229,
      volume_24h: 253330,
      liquidity: 120410,
      fdv: 936350,
      icon: '🦊',
    },
    {
      id: '2',
      pair: 'SHIRO/WETH',
      dex: 'Shiro Neko',
      price: 0.003437,
      change_1h: -5.15,
      change_24h: -8.31,
      txns_24h: 1074,
      volume_24h: 2040000,
      liquidity: 2540000,
      fdv: 344180000,
      icon: '🐱',
    },
    {
      id: '3',
      pair: 'Terra/WETH',
      dex: 'Terra Ecosystem',
      price: 3.77,
      change_1h: 7.14,
      change_24h: -4.01,
      txns_24h: 722,
      volume_24h: 2310000,
      liquidity: 216920,
      fdv: 3770000,
      icon: '🌍',
    },
    {
      id: '4',
      pair: 'XYO/WETH',
      dex: 'XY Oracle',
      price: 0.02978,
      change_1h: 1.61,
      change_24h: 10.62,
      txns_24h: 762,
      volume_24h: 3990000,
      liquidity: 2140000,
      fdv: 418690000,
      icon: '🔮',
    },
    {
      id: '5',
      pair: 'BREVIS/WETH',
      dex: 'Brevis Network',
      price: 3.22,
      change_1h: -14.14,
      change_24h: 169.0,
      txns_24h: 21,
      volume_24h: 186940,
      liquidity: 168500,
      fdv: 2320000,
      icon: '🌐',
    },
    {
      id: '6',
      pair: 'XMW/WETH',
      dex: 'Morphware',
      price: 0.1234,
      change_1h: 1.58,
      change_24h: 11.57,
      txns_24h: 666,
      volume_24h: 2140000,
      liquidity: 3970000,
      fdv: 152750000,
      icon: '🧬',
    },
    {
      id: '7',
      pair: 'EMP/WETH',
      dex: 'Empyreal',
      price: 264.12,
      change_1h: -8.18,
      change_24h: -28.62,
      txns_24h: 1120,
      volume_24h: 7650000,
      liquidity: 4960000,
      fdv: 66760000,
      icon: '🏛️',
    },
    {
      id: '8',
      pair: 'MONET/WETH',
      dex: 'Claude Monet Memeory Coin',
      price: 0.003718,
      change_1h: 0.0,
      change_24h: 0.58,
      txns_24h: 100,
      volume_24h: 530330,
      liquidity: 346880,
      fdv: 684160,
      icon: '🎨',
    },
    {
      id: '9',
      pair: 'XVG/WETH',
      dex: 'XVG ERC-20',
      price: 0.0004271,
      change_1h: 0.0,
      change_24h: -5.55,
      txns_24h: 83,
      volume_24h: 171680,
      liquidity: 227160,
      fdv: 7070000,
      icon: '🔒',
    },
    {
      id: '10',
      pair: 'GINNAN/WETH',
      dex: 'Ginnan Neko',
      price: 0.008261,
      change_1h: -5.94,
      change_24h: -38.19,
      txns_24h: 22,
      volume_24h: 894720,
      liquidity: 40650,
      fdv: 82610,
      icon: '🍃',
    },
  ])

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [selectedNetwork])

  const formatNumber = (num: number, decimals = 2) => {
    if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(decimals)}M`
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(decimals)}K`
    }
    return `$${num.toFixed(decimals)}`
  }

  return (
    <div className="container mx-auto py-8">
      <CryptoDashboard />
      <Card>
        <CardHeader>
          <CardTitle>Trending DEX Pairs</CardTitle>
          <CardDescription>
            Pairs that have performed based on price, volume changes and user popularity in the last
            24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="flex flex-wrap gap-2">
              {networks.map((network) => (
                <TabsTrigger
                  key={network.id}
                  value={network.id}
                  onClick={() => setSelectedNetwork(network.id)}
                  className="flex items-center gap-2"
                >
                  <span>{network.icon}</span>
                  <span>{network.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value={selectedNetwork}>
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8">#</TableHead>
                      <TableHead>Pair</TableHead>
                      <TableHead>DEX</TableHead>
                      <TableHead className="text-right">Price USD</TableHead>
                      <TableHead className="text-right">1H</TableHead>
                      <TableHead className="text-right">24H</TableHead>
                      <TableHead className="text-right">24H Txns</TableHead>
                      <TableHead className="text-right">24H Volume</TableHead>
                      <TableHead className="text-right">Liquidity</TableHead>
                      <TableHead className="text-right">FDV</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pairs.map((pair, index) => (
                      <TableRow key={pair.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <StarIcon className="w-4 h-4 text-muted-foreground" />
                            {index + 1}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span>{pair.icon}</span>
                            <span>{pair.pair}</span>
                          </div>
                        </TableCell>
                        <TableCell>{pair.dex}</TableCell>
                        <TableCell className="text-right">${pair.price.toFixed(6)}</TableCell>
                        <TableCell className="text-right">
                          <Badge variant={pair.change_1h >= 0 ? 'success' : 'destructive'}>
                            <span className="flex items-center">
                              {pair.change_1h >= 0 ? (
                                <ArrowUpIcon className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowDownIcon className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(pair.change_1h).toFixed(2)}%
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant={pair.change_24h >= 0 ? 'success' : 'destructive'}>
                            <span className="flex items-center">
                              {pair.change_24h >= 0 ? (
                                <ArrowUpIcon className="w-3 h-3 mr-1" />
                              ) : (
                                <ArrowDownIcon className="w-3 h-3 mr-1" />
                              )}
                              {Math.abs(pair.change_24h).toFixed(2)}%
                            </span>
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{pair.txns_24h}</TableCell>
                        <TableCell className="text-right">
                          {formatNumber(pair.volume_24h)}
                        </TableCell>
                        <TableCell className="text-right">{formatNumber(pair.liquidity)}</TableCell>
                        <TableCell className="text-right">{formatNumber(pair.fdv)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
