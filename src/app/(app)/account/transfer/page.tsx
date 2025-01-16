'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import UserStatus from '@/lib/userStatus'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TabMenu } from '@/components/w88/TabMenu'
import { accountConfig } from '@/config/accounts'
import { Label } from '@/components/ui/label'
import { ArrowDownIcon, ArrowRightIcon } from 'lucide-react'
import { ReCaptcha } from '@/components/ReCaptcha'
import { ReCaptchaV3 } from '@/components/ReCaptchaV3'
import { getAccountsByUserId } from '@/lib/account'
import { createTransfer } from '@/lib/transaction'
import Spinner from '@/components/Spinner'

const formSchema = z.object({
  fromAccount: z.string().min(1, { message: 'Please select the source account' }),
  toAccount: z.string().min(1, { message: 'Please select the destination account' }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Please enter a valid positive number',
  }),
})

type FormData = z.infer<typeof formSchema>

export default function TransferPage() {
  const { isLoggedIn, loading, user } = UserStatus()
  const router = useRouter()
  const [fromBalance, setFromBalance] = useState(0)
  const [toBalance, setToBalance] = useState(0)
  const [fromAccount, setFromAccount] = useState(null)
  const [toAccount, setToAccount] = useState(null)
  const [amount, setAmount] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [listFromAccounts, setListFromAccounts] = useState([])
  const [listToAccounts, setListToAccounts] = useState([])
  const [listAccounts, setListAccounts] = useState([])

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccount: '',
      toAccount: '',
      amount: '',
    },
  })

  const handleFromAccountChange = (accountId: string) => {
    const selectedAccount = listAccounts.find((account) => account.id === Number(accountId))
    setFromAccount(accountId.toString())
    setFromBalance(selectedAccount?.amount || 0)

    if (toAccount === accountId) {
      const availableToAccounts = listAccounts.filter((account) => account.id !== Number(accountId))
      if (availableToAccounts.length > 0) {
        setToAccount(availableToAccounts[0].id.toString())
        setToBalance(availableToAccounts[0].amount || 0)
      } else {
        setToAccount(null)
        setToBalance(0)
      }
    }
  }

  const handleToAccountChange = (accountId: string) => {
    const selectedAccount = listAccounts.find((account) => account.id === Number(accountId))
    setToAccount(accountId.toString())
    setToBalance(selectedAccount?.amount || 0)

    if (fromAccount === accountId) {
      const availableFromAccounts = listAccounts.filter(
        (account) => account.id !== Number(accountId),
      )
      if (availableFromAccounts.length > 0) {
        setFromAccount(availableFromAccounts[0].id.toString())
        setFromBalance(availableFromAccounts[0].amount || 0)
      } else {
        setFromAccount(null)
        setFromBalance(0)
      }
    }
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let accountsData = []
        if (user && user.id) {
          accountsData = await getAccountsByUserId(user.id)
        }
        setListAccounts(accountsData)
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }

    fetchAccounts()
  }, [loading])

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <Spinner /> // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join')
    return <Spinner /> // Optional: Show a redirect message
  }

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault()

    // if (!recaptchaToken) {
    //   toast({
    //     title: 'reCAPTCHA Required',
    //     description: 'Please complete the reCAPTCHA verification.',
    //     variant: 'destructive',
    //   })
    //   return
    // }
    try {
      // const response = await fetch('/api/transaction/create', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json', // Specify JSON content type
      //   },
      //   body: JSON.stringify({
      //     user_id: user.id,
      //     amount: amount,
      //     status: 'completed',
      //     from_account: fromAccount,
      //     to_account: toAccount,
      //     type: 'transfer',
      //   }), // Convert the request body to JSON
      // })

      // if (!response.ok) {
      //   // Parse the error response to retrieve the error message
      //   const errorResponse = await response.json()
      //   console.error('Error creating transaction:', errorResponse)
      //   const errorMessage = errorResponse.response?.error || 'An unknown error occurred'
      //   throw new Error(errorMessage)
      // }
      const response = await createTransfer({
        user_id: user.id,
        amount: amount,
        account_from: fromAccount,
        account_to: toAccount,
      })

      if (response.isSuccess) {
        toast({
          title: 'Transfer Successful',
        })
      }
    } catch (error) {
      console.error('Error creating transaction:', error)
      toast({
        title: 'Error',
        description: `${error}`,
      })
    }
    router.push('/account/history/transfer')
    form.reset()
  }
  console.log(process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V2_KEY)
  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Transfer</h1>
        <TabMenu items={accountConfig.tabList} defaultValue="transfer" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Transfer Funds</CardTitle>
            <CardDescription>Move money between your accounts</CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fromAccount">From Account</Label>
                  <Select value={fromAccount} onValueChange={handleFromAccountChange}>
                    <SelectTrigger id="fromAccount">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {listAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.account_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Balance:{' '}
                    {fromBalance.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>

                <div className="flex justify-center">
                  <ArrowDownIcon className="h-6 w-6" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="toAccount">To Account</Label>
                  <Select value={toAccount} onValueChange={handleToAccountChange}>
                    <SelectTrigger id="toAccount">
                      <SelectValue placeholder="Select account" />
                    </SelectTrigger>
                    <SelectContent>
                      {listAccounts.map((account) => (
                        <SelectItem key={account.id} value={account.id.toString()}>
                          {account.account_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Balance:{' '}
                    {toBalance.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                    })}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    placeholder="Enter amount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <ReCaptchaV3 sitekey={process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3_KEY} />
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleTransfer}>
              Transfer
            </Button>
          </CardFooter>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
