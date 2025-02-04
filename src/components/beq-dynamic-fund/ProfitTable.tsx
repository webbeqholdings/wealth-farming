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
import { capitalizeWords } from '@/utilities/formatText'
import { useDynamicFundData } from './DataProvider'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ProfitChart } from './ProfitChart'
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

export function ProfitTable() {
  const { data } = useDynamicFundData();
  const profitData = data?.profitData; // Assuming profitData is an array

  // Check if profitData is defined and has at least one entry
  if (!profitData || profitData.length === 0) {
    return <>No data</>;
  }

  // Access the first entry's profitLogs
  const profitLogs = profitData[0].profitLogs;
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

  const profitDataChart = profitLogs.map((item: { toDate: string | number | Date; balance: any }) => ({
    time: new Date(item.toDate),
    balance: item.balance
  }));

  return (
    <>
      <Tabs defaultValue="table" className="space-y-4">
        <TabsList>
          <TabsTrigger value="table">Bảng Lãi</TabsTrigger>
          <TabsTrigger value="chart">Biểu Đồ</TabsTrigger>
        </TabsList>
        <TabsContent value="table" className="space-y-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{capitalizeWords(t('start_date'))}</TableHead>
                <TableHead>{capitalizeWords(t('end_date'))}</TableHead>
                <TableHead className="text-center">{capitalizeWords(t('trading_days'))}</TableHead>
                <TableHead>{capitalizeWords(t('balance'))}</TableHead>
                <TableHead>{capitalizeWords(t('profit'))}</TableHead>
                <TableHead>{capitalizeWords(t('rate'))}</TableHead>
                <TableHead>{capitalizeWords(t('term_type'))}</TableHead>
                <TableHead>{capitalizeWords(t('message'))}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profitLogs.map((row: ProfitLogItem, index: number) => (
                <TableRow key={index}>
                  <TableCell>{format(row.fromDate, 'd/MM/yyyy')}</TableCell>
                  <TableCell>{format(row.toDate, 'd/MM/yyyy')}</TableCell>
                  <TableCell className="text-center">{row.days}</TableCell>
                  <TableCell>
                    {formatMoney(row.balance, { symbol: ' USD', symbolPosition: 'after' })}
                  </TableCell>
                  <TableCell>{row.profit.toFixed(2)}</TableCell>
                  <TableCell>{(row.rate * 100).toFixed(2) + ' %'}</TableCell>
                  <TableCell>{getMessage(row.term)}</TableCell>
                  <TableCell>{row.message}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
        <TabsContent value="chart" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Biểu Đồ Lợi Nhuận</CardTitle>
              <CardDescription>Biểu diễn số dư theo thời gian</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <ProfitChart profitData={profitDataChart} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs >
    </>
  )
}