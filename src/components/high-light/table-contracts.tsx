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

export default function TableContracts() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Contracts</CardTitle>
        <CardDescription>View and manage all active contracts.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow key={contract.id}>
                <TableCell className="font-medium">{contract.id}</TableCell>
                <TableCell>{contract.client}</TableCell>
                <TableCell>${contract.value.toLocaleString()}</TableCell>
                <TableCell>{contract.startDate}</TableCell>
                <TableCell>{contract.endDate}</TableCell>
                <TableCell className="text-right">
                  <div
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      contract.status === 'Active'
                        ? 'bg-emerald-100/10 text-emerald-500'
                        : contract.status === 'Pending'
                          ? 'bg-yellow-100/10 text-yellow-500'
                          : 'bg-red-100/10 text-red-500'
                    }`}
                  >
                    {contract.status}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter className="flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          Showing <strong>1-10</strong> of <strong>28</strong> contracts
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
const contracts = [
  {
    id: 'CTR-7890',
    client: 'Acme Inc.',
    value: 125000,
    startDate: 'Jan 15, 2023',
    endDate: 'Jan 14, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7891',
    client: 'Globex Corp',
    value: 85000,
    startDate: 'Feb 1, 2023',
    endDate: 'Jan 31, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7892',
    client: 'Initech',
    value: 65000,
    startDate: 'Mar 10, 2023',
    endDate: 'Mar 9, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7893',
    client: 'Massive Dynamic',
    value: 145000,
    startDate: 'Apr 5, 2023',
    endDate: 'Apr 4, 2024',
    status: 'Pending',
  },
  {
    id: 'CTR-7894',
    client: 'Stark Industries',
    value: 250000,
    startDate: 'May 20, 2023',
    endDate: 'May 19, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7895',
    client: 'Wayne Enterprises',
    value: 180000,
    startDate: 'Jun 15, 2023',
    endDate: 'Jun 14, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7896',
    client: 'Umbrella Corp',
    value: 95000,
    startDate: 'Jul 1, 2023',
    endDate: 'Jun 30, 2024',
    status: 'Expired',
  },
  {
    id: 'CTR-7897',
    client: 'Cyberdyne Systems',
    value: 120000,
    startDate: 'Aug 10, 2023',
    endDate: 'Aug 9, 2024',
    status: 'Active',
  },
  {
    id: 'CTR-7898',
    client: 'Oscorp Industries',
    value: 75000,
    startDate: 'Sep 5, 2023',
    endDate: 'Sep 4, 2024',
    status: 'Pending',
  },
  {
    id: 'CTR-7899',
    client: 'LexCorp',
    value: 110000,
    startDate: 'Oct 1, 2023',
    endDate: 'Sep 30, 2024',
    status: 'Active',
  },
]
