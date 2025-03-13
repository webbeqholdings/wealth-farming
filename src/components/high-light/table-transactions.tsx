import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TableTransactions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>Recent financial transactions across all accounts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.id}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>{transaction.category}</TableCell>
                <TableCell
                  className={`text-right ${transaction.amount > 0 ? 'text-emerald-500' : 'text-red-500'}`}
                >
                  {transaction.amount > 0 ? '+' : ''}
                  {transaction.amount.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>156</strong> transactions
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
          <Button variant="outline" size="sm">
            Next
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

// Sample data
const transactions = [
  {
    id: 'TRX-001',
    description: 'Payment from Client A',
    date: 'Mar 15, 2023',
    category: 'Income',
    amount: 5250.0,
  },
  {
    id: 'TRX-002',
    description: 'Office Supplies',
    date: 'Mar 14, 2023',
    category: 'Expense',
    amount: -125.5,
  },
  {
    id: 'TRX-003',
    description: 'Software Subscription',
    date: 'Mar 13, 2023',
    category: 'Expense',
    amount: -49.99,
  },
  {
    id: 'TRX-004',
    description: 'Payment from Client B',
    date: 'Mar 12, 2023',
    category: 'Income',
    amount: 3200.0,
  },
  {
    id: 'TRX-005',
    description: 'Server Hosting',
    date: 'Mar 10, 2023',
    category: 'Expense',
    amount: -299.0,
  },
  {
    id: 'TRX-006',
    description: 'Employee Payroll',
    date: 'Mar 5, 2023',
    category: 'Expense',
    amount: -8500.0,
  },
  {
    id: 'TRX-007',
    description: 'Payment from Client C',
    date: 'Mar 3, 2023',
    category: 'Income',
    amount: 4750.0,
  },
  {
    id: 'TRX-008',
    description: 'Marketing Campaign',
    date: 'Mar 2, 2023',
    category: 'Expense',
    amount: -1200.0,
  },
  {
    id: 'TRX-009',
    description: 'Office Rent',
    date: 'Mar 1, 2023',
    category: 'Expense',
    amount: -2000.0,
  },
  {
    id: 'TRX-010',
    description: 'Consulting Services',
    date: 'Feb 28, 2023',
    category: 'Income',
    amount: 1800.0,
  },
]
