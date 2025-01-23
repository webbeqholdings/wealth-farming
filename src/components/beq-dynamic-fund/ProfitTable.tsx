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
interface ProfitLogItem {
  fromDate: Date
  toDate: Date
  rate: number
  balance: number
  profit: number
  days: number
  term: string
  message: string
}

export function ProfitTable({ data }: { data: ProfitLogItem[] }) {
  const { t } = useTranslation()
  const getMessage = (messageField: string | object): string => {
    if (typeof messageField === 'string') {
      try {
        const messageData = JSON.parse(messageField);
        return t(messageData.key, messageData.params || {}) as string;
      } catch (e) {
        return t(messageField);
      }
    }
    return '';
  };
  console.log("data:", typeof data);
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('from_date')}</TableHead>
              <TableHead>{t('balance')}</TableHead>
              <TableHead>{t('profit')}</TableHead>
              <TableHead>{t('rate')}</TableHead>
              <TableHead className="text-center">{t('trading_days')}</TableHead>
              <TableHead>{t('term_type')}</TableHead>
              <TableHead>{t('message')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{format(row.fromDate, 'd/MM/yyyy')}</TableCell>
                <TableCell>
                  {formatMoney(row.balance, { symbol: ' USD', symbolPosition: 'after' })}
                </TableCell>
                <TableCell>{row.profit.toFixed(2)}</TableCell>
                <TableCell>{row.rate.toFixed(2) + ' %'}</TableCell>
                <TableCell className="text-center">{row.days}</TableCell>
                <TableCell>{getMessage(row.term)}</TableCell>
                <TableCell>{row.message}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}