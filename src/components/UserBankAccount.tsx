'use client'

import { useEffect, useState } from 'react'
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
import { useToast } from '@/hooks/use-toast'
import { Trash2 } from 'lucide-react'
import { Separator } from './ui/separator'
import UserStatus from '@/lib/userStatus'

// Form schema
const formSchema = z.object({
  accountName: z.string().min(2, {
    message: 'Account name must be at least 2 characters.',
  }),
  accountNumber: z.string().min(10, {
    message: 'Account number must be at least 10 characters.',
  }),
  bankName: z.string().min(2, {
    message: 'Please input a bank.',
  }),
  branch: z.string().min(2, {
    message: 'Please input a bank.',
  }),
})


export default function UserBankAccount() {
  const {isLoggedIn, loading, user} = UserStatus()
  const [accounts, setAccounts] = useState([])
  const [bankId, setBankId] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Manage dialog visibility
  const { toast } = useToast()

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
    },
  })

  // Fetch bank account data when the component mounts
  useEffect(() => {
    async function fetchBankData() {
      try {
        const response = await fetch(`/api/banks?where[user][equals]=${user.id}`)
        const data = await response.json()

        // Assuming the first document is the user bank account
        const userBank = data.docs[0] // Modify this if you need to handle multiple banks

        setAccounts(data.docs)
        // Populate form with the fetched data
        form.setValue('accountName', userBank.name)
        form.setValue('accountNumber', userBank.account_number)
        form.setValue('bankName', userBank.bank_name)
        form.setValue('branch', userBank.branch)
      } catch (error) {
        console.log(error)
      }
    }

    fetchBankData()
  }, [form, toast, loading])

  async function handleDelete(accountId: string) {
    try {
      // Send a DELETE request to the API to delete the bank account
      const response = await fetch(`/api/banks/${Number(accountId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Ensure we send JSON
        },
      });

      if (response.ok) {
        setIsDialogOpen(false);
      
        // Remove the deleted account from local state
        setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== accountId));

        // Show success toast message
        toast({
          title: 'Bank Account Deleted',
          description: 'The bank account has been successfully deleted.',
        });
      } else {
        throw new Error('Failed to delete bank account');
      }
    } catch (error) {
      console.error('Error:', error);
      setIsDialogOpen(false);
      toast({
        title: 'Error',
        description: 'Failed to delete the bank account. Please try again later.',
      });
    }
  }


  // Submit handler
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newAccount = {
      user: Number(user.id),
      name: values.accountName,
      account_number: values.accountNumber,
      bank_name: values.bankName,
      branch: values.branch,
    };
    try {
      // Send the data to the API
      const response = await fetch('/api/banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(newAccount), // Convert the object to a JSON string
      });

      // Check if the response is ok (status 200-299)
      if (response.ok) {
        const data = await response.json(); // Parse the response data if needed

        // Update local state with the new account if necessary
        setAccounts((prevAccounts) => [...prevAccounts, newAccount]);

        // Reset the form and show success message
        form.reset();
        toast({
          title: 'Bank Account Added',
          description: 'Your bank account has been successfully added.',
        });
      } else {
        throw new Error('Failed to add bank account');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add bank account. Please try again later.',
      });
      console.error('Error:', error);
    }
  }

  // Handle delete button click
  const handleDeleteClick = (accountId: string) => {
    setIsDialogOpen(true); // Open the dialog
    setBankId(accountId);
  };

  // Handle cancel action in dialog
  const handleCancel = () => {
    setIsDialogOpen(false); // Close dialog without deleting
  };


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
                name="bankName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your bank name" {...field} />
                    </FormControl>
                    <FormDescription>Your bank name.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="branch"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Branch</FormLabel>
                    <FormControl>
                      <Input placeholder="Your branch" {...field} />
                    </FormControl>
                    <FormDescription>Your branch.</FormDescription>
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
                <TableHead>Branch</TableHead>
                <TableHead>Action</TableHead> {/* Add action column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.name}</TableCell>
                  <TableCell>{account.account_number}</TableCell>
                  <TableCell>{account.bank_name}</TableCell>
                  <TableCell>{account.branch}</TableCell>
                  <TableCell>
                    {/* Delete button */}
                    <Button
                      onClick={() => handleDeleteClick(account.id)}
                      color="red"
                      size="sm"
                    >
                      <Trash2 /> {/* Icon inside the button */}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {/* Confirmation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action will permanently delete the bank account. Do you want to proceed?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCancel} color="gray" size="sm">Cancel</Button>
            <Button onClick={() => handleDelete(bankId)} color="red" size="sm">Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
