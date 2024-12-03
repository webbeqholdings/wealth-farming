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

const formSchema = z.object({
  fromAccount: z.string().min(1, { message: 'Please select the source account' }),
  toAccount: z.string().min(1, { message: 'Please select the destination account' }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Please enter a valid positive number',
  }),
})

type FormData = z.infer<typeof formSchema>

export default function TransferPage() {
  const {isLoggedIn, loading, user} = UserStatus();
  const router = useRouter()
  const [fromBalance, setFromBalance] = useState(0)
  const [toBalance, setToBalance] = useState(0)
  const [fromAccount, setFromAccount] = useState(null)
  const [toAccount, setToAccount] = useState(null)
  const [amount, setAmount] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)
  const [listFromAccounts, setListFromAccounts] = useState([]);
  const [listToAccounts, setListToAccounts] = useState([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccount: '',
      toAccount: '',
      amount: '',
    },
  })

  const handleFromAccountChange = (accountId: string) => {
    // setFromBalance(accountBalances[value as keyof typeof accountBalances] || 0)
    const selectedAccount = listFromAccounts.find((account) => account.id === Number(accountId));
    setFromAccount(accountId.toString());
    setFromBalance(selectedAccount?.amount || 0);
  }

  const handleToAccountChange = (accountId: string) => {
    const selectedAccount = listToAccounts.find((account) => account.id === Number(accountId));
    setToAccount(accountId.toString());
    setToBalance(selectedAccount?.amount || 0);
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/accounts?where[user][equals]=${user.id}`); // Replace with dynamic user ID if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setListFromAccounts(data.docs); // Store the accounts in state
        setListToAccounts(data.docs); // Store the accounts in state
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, [loading]);

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join');
    return <div>Redirecting...</div>; // Optional: Show a redirect message
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
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
          user_id: user.id,
          amount: amount,
          status: "completed",
          from_account: fromAccount,
          to_account: toAccount,
          type: "transfer"
        }), // Convert the request body to JSON
      });

      if (!response.ok) {
        // Parse the error response to retrieve the error message
        const errorResponse = await response.json();
        const errorMessage = errorResponse.response?.error || 'An unknown error occurred';
        throw new Error(errorMessage);
      }
      toast({
        title: 'Transfer successful',
      })
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: `${error}`,
      })
    }
    router.push('/account/history')
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
              <form onSubmit={handleTransfer}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromAccount">From Account</Label>
                    <Select value={fromAccount} onValueChange={handleFromAccountChange}>
                      <SelectTrigger id="fromAccount">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {listToAccounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id.toString()}
                            disabled={toAccount === account.id.toString()} // Disable the selected `fromAccount`
                          >
                            {account.account_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Balance: ${fromBalance}</p>
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
                        {listToAccounts.map((account) => (
                          <SelectItem
                            key={account.id}
                            value={account.id.toString()}
                            disabled={fromAccount === account.id.toString()} // Disable the selected `fromAccount`
                          >
                            {account.account_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">Balance: ${toBalance}</p>
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
