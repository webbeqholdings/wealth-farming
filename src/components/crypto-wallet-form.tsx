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
import { CryptoWalletCombobox } from './crypto-wallet-combobox'
import { useTranslation } from 'react-i18next'

const formSchema = z.object({
  walletAddress: z.string().min(5, {
    message: 'Wallet address must be at least 5 characters.',
  }),
  network: z.string().min(1, {
    message: 'Please select a network.',
  }),
})

export function CryptoWalletForm({
  cryptoWallets,
  setCryptoWallets,
}: {
  cryptoWallets: any[]
  setCryptoWallets: React.Dispatch<React.SetStateAction<any[]>>
}) {
  const [cryptoWalletId, setCryptoWalletId] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const { user } = UserStatus()
  const { t } = useTranslation()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      walletAddress: '',
      network: '',
    },
  })

  async function handleDelete(accountId: string) {
    try {
      // Send a DELETE request to the API to delete the bank account
      const response = await fetch(`/api/crypto-wallets/${Number(accountId)}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', // Ensure we send JSON
        },
      })

      if (response.ok) {
        setIsDialogOpen(false)

        // Remove the deleted account from local state
        setCryptoWallets((prevAccounts) =>
          prevAccounts.filter((account) => account.id !== accountId),
        )

        // Show success toast message
        toast({
          title: 'Crypto Wallet Deleted',
          description: 'The crypto wallet has been successfully deleted.',
        })
      } else {
        throw new Error('Failed to delete crypto wallet')
      }
    } catch (error) {
      console.error('Error:', error)
      setIsDialogOpen(false)
      toast({
        title: 'Error',
        description: 'Failed to delete the crypto wallet. Please try again later.',
      })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newCryptoWallet = {
      user: Number(user?.id),
      wallet_address: values.walletAddress,
      network: values.network,
    }
    try {
      // Send the data to the API
      const response = await fetch('/api/crypto-wallets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify(newCryptoWallet), // Convert the object to a JSON string
      })

      // Check if the response is ok (status 200-299)
      if (response.ok) {
        // Update local state with the new account if necessary
        setCryptoWallets((prevAccounts) => [...prevAccounts, newCryptoWallet])

        // Reset the form and show success message
        form.reset()
        toast({
          title: 'Crypto Wallet Added',
          description: 'Your crypto wallet has been successfully added.',
        })
      } else {
        throw new Error('Failed to add crypto wallet')
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add crypto wallet. Please try again later.',
      })
      console.error('Error:', error)
    }
  }

  const handleDeleteClick = (accountId: string) => {
    setIsDialogOpen(true) // Open the dialog
    setCryptoWalletId(accountId)
  }

  // Handle cancel action in dialog
  const handleCancel = () => {
    setIsDialogOpen(false) // Close dialog without deleting
  }

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{t('add_crypto_wallet')}</CardTitle>
          <CardDescription>{t('crypto_details')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Wallet Address and Network Inline */}
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t('wallet_address')}</FormLabel>
                      <FormControl>
                        <Input placeholder={t('enter_wallet_address')} {...field} />
                      </FormControl>
                      <FormDescription>{t('crypto_wallet_address')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="network"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>{t('Network')}</FormLabel>
                      <FormControl>
                        <CryptoWalletCombobox value={field.value} onChange={field.onChange} />
                      </FormControl>
                      <FormDescription>{t('blockchain_network')}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Submit Button */}
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-black">
                {t('add_crypto_wallet')}
              </Button>
            </form>
          </Form>
        </CardContent>
        <Separator />
        <CardHeader>
          <CardTitle>{t('your_crypto_wallets')}</CardTitle>
          <CardDescription>{t('manage_crypto_wallets')}.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('wallet_address')}</TableHead>
                <TableHead>{t('Network')}</TableHead>
                <TableHead>{t('action')}</TableHead> {/* Add action column */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {cryptoWallets && cryptoWallets.map((account) => (
                <TableRow key={account.id}>
                  <TableCell>{account.wallet_address}</TableCell>
                  <TableCell>{account.network}</TableCell>
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
            <DialogTitle>{t('are_you_sure')}</DialogTitle>
            <DialogDescription>{t('delete_account_warning')}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleCancel} color="gray" size="sm">
              {t('cancel')}
            </Button>
            <Button onClick={() => handleDelete(cryptoWalletId)} color="red" size="sm">
              {t('delete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
