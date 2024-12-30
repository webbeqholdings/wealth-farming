'use client'

import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useToast } from '@/hooks/use-toast'
import UserStatus from '@/lib/userStatus'
import { AccountTabs } from './account-tabs'

// Form schema
const formSchema = z.object({
  accountName: z.string().min(2, {
    message: 'Account name must be at least 2 characters.',
  }),
  accountNumber: z.string().min(2, {
    message: 'Please input a Account Number.',
  }),
  bankName: z.string().min(2, {
    message: 'Please input a bank.',
  }),
  branch: z.string().min(2, {
    message: 'Please input a bank.',
  }),
})

export default function UserBankAccount() {
  const { isLoggedIn, loading, user } = UserStatus()
  const [bankAccounts, setBankAccounts] = useState([])
  const [cryptoWallets, setCryptoWallets] = useState([])
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
    async function fetchData() {
      try {
        const bankResponse = await fetch(`/api/banks?where[user][equals]=${user.id}`)
        const bankData = await bankResponse.json()

        const cryptoResponse = await fetch(`/api/crypto-wallets?where[user][equals]=${user.id}`)
        const cryptoData = await cryptoResponse.json()

        // Assuming the first document is the user bank account
        const userBank = bankData.docs[0] // Modify this if you need to handle multiple banks
        const userCrypto = cryptoData.docs[0]

        setBankAccounts(bankData.docs)
        setCryptoWallets(cryptoData.docs)
        // Populate form with the fetched data
        form.setValue('accountName', userBank.name)
        form.setValue('accountNumber', userBank.account_number)
        form.setValue('bankName', userBank.bank_name)
        form.setValue('branch', userBank.branch)
      } catch (error) {
        console.log(error)
      }
    }

    fetchData()
  }, [form, toast, loading])

  return (
    <div>
      <AccountTabs
        bankAccounts={bankAccounts}
        setBankAccounts={setBankAccounts}
        cryptoWallets={cryptoWallets}
        setCryptoWallets={setCryptoWallets}
      />
    </div>
  )
}
