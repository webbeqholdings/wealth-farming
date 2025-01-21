'use client'

import * as React from 'react'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { BankCombobox } from './bank-combobox'
import { Separator } from '@radix-ui/react-dropdown-menu'
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
import UserStatus from '@/lib/userStatus'
import { useTranslation } from 'react-i18next';

const formSchema = z.object({
  accountName: z.string().min(2, {
    message: 'Account name must be at least 2 characters.',
  }),
  accountNumber: z.string().min(5, {
    message: 'Account number must be at least 5 characters.',
  }),
  bankName: z.string().min(1, {
    message: 'Please select a bank.',
  }),
  branch: z.string().min(2, {
    message: 'Branch must be at least 2 characters.',
  }),
})

export function BankAccountForm({
  accounts,
  setAccounts,
}: {
  accounts: any[]
  setAccounts: React.Dispatch<React.SetStateAction<any[]>>
}) {
  const { t } = useTranslation();
  const [bankId, setBankId] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false) // Manage dialog visibility
  const { toast } = useToast()

  const { user } = UserStatus()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      accountName: '',
      accountNumber: '',
      bankName: '',
      branch: '',
    },
  })

  async function handleDelete(accountId: string) {
    try {
      // Send a DELETE request to the API to delete the bank account
      const response = await fetch(`/api/banks/${Number(accountId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Ensure we send JSON
        },
      })

      if (response.ok) {
        setIsDialogOpen(false)

        // Remove the deleted account from local state
        setAccounts((prevAccounts) => prevAccounts.filter((account) => account.id !== accountId))

        // Show success toast message
        toast({
          title: 'Bank Account Deleted',
          description: 'The bank account has been successfully deleted.',
        })
      } else {
        throw new Error('Failed to delete bank account')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsDialogOpen(false)
      toast({
        title: 'Error',
        description: 'Failed to delete the bank account. Please try again later.',
      })
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
    }
    try {
      // Send the data to the API
      const response = await fetch('/api/banks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(newAccount), // Convert the object to a JSON string
      })

      // Check if the response is ok (status 200-299)
      if (response.ok) {
        const data = await response.json() // Parse the response data if needed

        // Update local state with the new account if necessary
        setAccounts((prevAccounts) => [...prevAccounts, newAccount])

        // Reset the form and show success message
        form.reset()
        toast({
          title: 'Bank Account Added',
          description: 'Your bank account has been successfully added.',
        })
      } else {
        throw new Error('Failed to add bank account')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add bank account. Please try again later.',
      })
      console.error('Error:', error)
    }
  }

  // Handle delete button click
  const handleDeleteClick = (accountId: string) => {
    setIsDialogOpen(true) // Open the dialog
    setBankId(accountId)
  }

  // Handle cancel action in dialog
  const handleCancel = () => {
    setIsDialogOpen(false) // Close dialog without deleting
  }

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('Add Bank Account')}</CardTitle>
          <CardDescription>
            {t('Enter your bank account details for deposits and withdrawals.')}
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
                    <FormLabel>{t('Account Name')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter account name")} {...field} />
                    </FormControl>
                    <FormDescription>{t('The name as it appears on your bank account.')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('Account Number')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t("Enter account number")} {...field} />
                    </FormControl>
                    <FormDescription>{t('Your bank account number.')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bank Name and Branch on the Same Line */}
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="bankName"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t('Bank Name')}</FormLabel>
                      <FormControl>
                        <BankCombobox value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>{t('Your bank name.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="branch"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t('Branch')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t("Enter branch name")} {...field} />
                      </FormControl>
                      <FormDescription>{t('Your branch.')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-black">
                {t('Add Bank Account')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <Separator />
        <CardHeader>
          <CardTitle>{t('Your Bank Accounts')}</CardTitle>
          <CardDescription>{t('Manage your registered bank accounts.')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('Account Name')}</TableHead>
                <TableHead>{t('Account Number')}</TableHead>
                <TableHead>{t('Bank Name')}</TableHead>
                <TableHead>{t('Branch')}</TableHead>
                <TableHead>{t('Action')}</TableHead> {/* Add action column */}
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
                    <Button onClick={() => handleDeleteClick(account.id)} color="red" size="sm">
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
            <DialogTitle>{t('Are you sure?')}</DialogTitle>
            <DialogDescription>
              {t('This action will permanently delete the bank account. Do you want to proceed?')}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCancel} color="gray" size="sm">
              {t('Cancel')}
            </Button>
            <Button onClick={() => handleDelete(bankId)} color="red" size="sm">
              {t('Delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
