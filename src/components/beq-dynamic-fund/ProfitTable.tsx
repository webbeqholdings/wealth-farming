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
  const getMessage = (messageField: string | object): string => {
    if (typeof messageField === 'string') {
      try {
        const messageData = JSON.parse(messageField);
        return t(messageData.key, messageData.params || {}) as string;
      } catch {
        return t(messageField);
      }
    }
    if (typeof messageField === 'object') {
      const { key, params } = messageField as { key: string; params?: Record<string, unknown> };
      return t(key, params || {});
    }
    return '';
  };
  
  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('month')}</TableHead>
              <TableHead>{t('balance')}</TableHead>
              <TableHead>{t('profit')}</TableHead>
              <TableHead>{t('interest_earned')}</TableHead>
              <TableHead>{t('rate')}</TableHead>
              <TableHead className="text-center">{t('trading_days')}</TableHead>
              <TableHead>{t('term_type')}</TableHead>
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
                <TableCell>{getMessage(row.termType)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
