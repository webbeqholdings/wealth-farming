'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
const accountBalances = {
  account1: 5000,
  account2: 3000,
  account3: 7000,
}

export default function TransferPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const [fromBalance, setFromBalance] = useState(0)
  const [toBalance, setToBalance] = useState(0)
  const [fromAccount, setFromAccount] = useState('')
  const [toAccount, setToAccount] = useState('')
  const [amount, setAmount] = useState('')
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fromAccount: '',
      toAccount: '',
      amount: '',
    },
  })

  const handleFromAccountChange = (value: string) => {
    console.log('from account change')
    setFromAccount(value)
    setFromBalance(accountBalances[value as keyof typeof accountBalances] || 0)
  }

  const handleToAccountChange = (value: string) => {
    console.log('to account change')
    setToAccount(value)
    setToBalance(accountBalances[value as keyof typeof accountBalances] || 0)
  }

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault()

    if (!recaptchaToken) {
      toast({
        title: 'reCAPTCHA Required',
        description: 'Please complete the reCAPTCHA verification.',
        variant: 'destructive',
      })
      return
    }

    toast({
      title: 'Transfer successful',
    })

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
                      <SelectItem value="account1">Main Account</SelectItem>
                      <SelectItem value="account2">Savings Account</SelectItem>
                      <SelectItem value="account3">Investment Account</SelectItem>
                    </SelectContent>
                  </Select>
                  {fromBalance > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Balance: ${fromBalance.toLocaleString()}
                    </p>
                  )}
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
                      <SelectItem value="account1">Main Account</SelectItem>
                      <SelectItem value="account2">Savings Account</SelectItem>
                      <SelectItem value="account3">Investment Account</SelectItem>
                    </SelectContent>
                  </Select>
                  {toBalance > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Balance: ${toBalance.toLocaleString()}
                    </p>
                  )}
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
