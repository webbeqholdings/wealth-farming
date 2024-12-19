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
interface ProfitData {
  date: Date
  balance: number
  profit: number
  interestEarned: number
  rate: number
  termType: string
  days?: number
}

export function ProfitTable({ data }: { data: ProfitData[] }) {
  return (
    <>
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
            {data.map((row, index) => (
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
    </>
  )
}
