import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { formatMoney } from '@/utilities/formatMoney'
import { useDynamicFundData } from './DataProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfitChart } from './ProfitChart'

interface ProfitItem {
  date: Date
  balance: number
  profit: number
  interestEarned: number
  rate: number
  days: number
  termType: string
}

type ProfitData = Record<string, ProfitItem[]>

export function ProfitTable() {
  const { data } = useDynamicFundData()
  const profitData: ProfitData = (data as { profitData: ProfitData }).profitData
  if (!profitData) return <>No data</>

  const formattedProfitData = Object.entries(profitData).flatMap(([year, items]) =>
    items.map((item: ProfitItem) => ({
      time: item.date,
      balance: item.balance,
    })),
  )

  return (
    <>
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Bảng Lãi</TabsTrigger>
          <TabsTrigger value="chart">Biểu Đồ</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="space-y-4">
          {Object.entries(profitData).map(([year, item]) => {
            return (
              <div key={year} className="mb-10">
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                  {`Năm ${year}`}
                </h2>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Month</TableHead>
                        <TableHead>Balance</TableHead>
                        <TableHead>Profit</TableHead>
                        <TableHead>Interest Earned</TableHead>
                        <TableHead>rate</TableHead>
                        <TableHead className="text-center">Trading Days</TableHead>
                        <TableHead>Term Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {item.map((row: any, index: any) => (
                        <TableRow key={index}>
                          <TableCell>{format(row.date, 'MM, yyyy')}</TableCell>
                          <TableCell>
                            {formatMoney(row.balance, { symbol: ' USD', symbolPosition: 'after' })}
                          </TableCell>
                          <TableCell>{row.profit.toFixed(2)}</TableCell>
                          <TableCell>{row.interestEarned.toFixed(2)}</TableCell>
                          <TableCell>{row.rate.toFixed(2) + ' %'}</TableCell>
                          <TableCell className="text-center">{row.days}</TableCell>
                          <TableCell>{row.termType}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )
          })}
        </TabsContent>
        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biểu Đồ Lợi Nhuận</CardTitle>
              <CardDescription>Biểu diễn số dư theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ProfitChart profitData={formattedProfitData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}
