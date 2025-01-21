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
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('Month')}</TableHead>
              <TableHead>{t('Balance')}</TableHead>
              <TableHead>{t('Profit')}</TableHead>
              <TableHead>{t('Interest Earned')}</TableHead>
              <TableHead>{t('Rate')}</TableHead>
              <TableHead className="text-center">{t('Trading Days')}</TableHead>
              <TableHead>{t('Term Type')}</TableHead>
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
                <TableCell>{t(row.termType)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
