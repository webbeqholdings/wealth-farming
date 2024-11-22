'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Trash2 } from 'lucide-react'
import { Separator } from './ui/separator'

// List of Vietnamese banks
const vietnameseBanks = [
  { code: 'VCB', name: 'Vietcombank' },
  { code: 'TCB', name: 'Techcombank' },
  { code: 'VTB', name: 'VietinBank' },
  { code: 'BIDV', name: 'BIDV' },
  { code: 'ACB', name: 'Asia Commercial Bank' },
  { code: 'MBB', name: 'MB Bank' },
  { code: 'VPB', name: 'VPBank' },
  { code: 'STB', name: 'Sacombank' },
  { code: 'HDB', name: 'HDBank' },
  { code: 'TPB', name: 'TPBank' },
]

// Form schema
const formSchema = z.object({
  accountName: z.string().min(2, {
    message: 'Account name must be at least 2 characters.',
  }),
  accountNumber: z.string().min(10, {
    message: 'Account number must be at least 10 characters.',
  }),
  bankCode: z.string().min(2, {
    message: 'Please select a bank.',
  }),
})

// Bank account type
type BankAccount = z.infer<typeof formSchema> & { bankName: string }

// Example bank accounts
const exampleAccounts: BankAccount[] = [
  {
    accountName: 'Nguyen Van A',
    accountNumber: '1234567890',
    bankCode: 'VCB',
    bankName: 'Vietcombank',
  },
  { accountName: 'Tran Thi B', accountNumber: '2345678901', bankCode: 'BIDV', bankName: 'BIDV' },
  {
    accountName: 'Le Van C',
    accountNumber: '3456789012',
    bankCode: 'ACB',
    bankName: 'Asia Commercial Bank',
  },
  {
    accountName: 'Pham Thi D',
    accountNumber: '4567890123',
    bankCode: 'TCB',
    bankName: 'Techcombank',
  },
  { accountName: 'Hoang Van E', accountNumber: '5678901234', bankCode: 'VPB', bankName: 'VPBank' },
]

export default function UserBankAccount() {
  const [accounts, setAccounts] = useState<BankAccount[]>(exampleAccounts)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [accountToDelete, setAccountToDelete] = useState<BankAccount | null>(null)
  const { toast } = useToast()

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: '',
      accountNumber: '',
      bankCode: '',
    },
  })

  // Submit handler
  function onSubmit(values: z.infer<typeof formSchema>) {
    const selectedBank = vietnameseBanks.find((bank) => bank.code === values.bankCode)
    if (selectedBank) {
      const newAccount: BankAccount = {
        ...values,
        bankName: selectedBank.name,
      }
      setAccounts([...accounts, newAccount])
      form.reset()
      toast({
        title: 'Bank Account Added',
        description: 'Your bank account has been successfully added.',
      })
    }
  }

  // Delete handler
  function handleDelete(account: BankAccount) {
    setAccountToDelete(account)
    setDeleteConfirmOpen(true)
  }

  // Confirm delete
  function confirmDelete() {
    if (accountToDelete) {
      setAccounts(accounts.filter((a) => a.accountNumber !== accountToDelete.accountNumber))
      toast({
        title: 'Bank Account Deleted',
        description: 'Your bank account has been successfully deleted.',
      })
    }
    setDeleteConfirmOpen(false)
  }

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add Bank Account</CardTitle>
          <CardDescription>
            Enter your bank account details for deposits and withdrawals.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="accountName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Nguyen Van A" {...field} />
                    </FormControl>
                    <FormDescription>The name as it appears on your bank account.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="1234567890" {...field} />
                    </FormControl>
                    <FormDescription>Your bank account number.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bankCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bank" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {vietnameseBanks.map((bank) => (
                          <SelectItem key={bank.code} value={bank.code}>
                            {bank.code} - {bank.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>Select your bank from the list.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Add Bank Account</Button>
            </form>
          </Form>
        </CardContent>
        <Separator />
        <CardHeader>
          <CardTitle>Your Bank Accounts</CardTitle>
          <CardDescription>Manage your registered bank accounts.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Account Number</TableHead>
                <TableHead>Bank Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.accountNumber}>
                  <TableCell>{account.accountName}</TableCell>
                  <TableCell>{account.accountNumber}</TableCell>
                  <TableCell>{account.bankName}</TableCell>
                  <TableCell>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(account)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this bank account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
