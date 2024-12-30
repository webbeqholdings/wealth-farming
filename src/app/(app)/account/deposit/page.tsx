'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import userStatus from '@/lib/userStatus'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Banknote, CreditCard } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TabMenu } from '@/components/w88/TabMenu'
import { accountConfig } from '@/config/accounts'
import { toast } from '@/hooks/use-toast'
import { notifyDeposit } from '@/lib/telegram'
import CurrencyConverter from '@/components/CurrencyConverter'

// Steps component definition
interface StepProps {
  title: string
  isCompleted?: boolean
  isActive?: boolean
}

function Step({ title, isCompleted, isActive }: StepProps) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
          isCompleted && 'bg-primary text-primary-foreground',
          isActive && 'bg-primary text-primary-foreground',
          !isCompleted && !isActive && 'border-2 border-input',
        )}
      >
        {isCompleted ? '✓' : ''}
      </div>
      <span className="mt-2 text-sm font-medium">{title}</span>
    </div>
  )
}

interface StepsProps {
  currentStep: number
  className?: string
  children: React.ReactElement<StepProps>[]
}

function Steps({ currentStep, className, children }: StepsProps) {
  return (
    <div className={cn('flex justify-between', className)}>
      {children.map((child, index) => (
        <Step
          key={index}
          title={child.props.title}
          isCompleted={index < currentStep - 1}
          isActive={index === currentStep - 1}
        />
      ))}
    </div>
  )
}

export default function DepositPage() {
  const { isLoggedIn, loading, user } = userStatus()
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [method, setMethod] = useState('bank')
  const [accountNumber, setAccountNumber] = useState('')
  const [accounts, setAccounts] = useState([])
  const [banks, setBanks] = useState([])
  const [selectBank, setSelectBank] = useState(null)
  const [fromAccount, setFromAccount] = useState(null)
  const [selectedBalance, setSelectedBalance] = useState(0)
  const [exchangeRate, setExchangeRate] = useState(1) // Default exchange rate
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const quickAmounts = [
    { label: '500K', value: 500000 },
    { label: '1M', value: 1000000 },
    { label: '10M', value: 10000000 },
    { label: '50M', value: 50000000 },
    { label: '100M', value: 100000000 },
  ]

  const [convertedQuickAmounts, setConvertedQuickAmounts] = useState(quickAmounts)
  const [USDCurrency, setUSDCurrency] = useState<number>(0)
  const handleNextStep = () => {
    if (validateStep()) {
      if (step < 3) setStep(step + 1)
    } else {
      toast({
        title: 'Please correct the highlighted errors.',
        description: 'Some fields are missing or invalid.',
      })
    }
  }

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFromAccountChange = (accountId: string) => {
    const numericAccountId = Number(accountId) // Convert the string to a number
    const selectedAccount = accounts.find((account) => account.id === numericAccountId)
    setFromAccount(numericAccountId.toString()) // Store the numeric ID in state
    setSelectedBalance(selectedAccount?.amount || 0)
  }

  const handleBankChange = (bankId: string) => {
    setSelectBank(bankId.toString()) // Convert the string to a number
  }

  const validateStep = () => {
    const newErrors: { [key: string]: string } = {}

    if (step === 1) {
      if (!fromAccount) newErrors.fromAccount = 'Please select an account.'
      if (!USDCurrency || Number(USDCurrency) <= 0)
        newErrors.USDCurrency = 'Please enter a valid deposit amount.'
      if (!selectBank) newErrors.selectBank = 'Please select a bank.'
    }

    if (step === 3) {
      if (!USDCurrency || Number(USDCurrency) <= 0)
        newErrors.USDCurrency = 'Amount is required for confirmation.'
      if (!fromAccount) newErrors.fromAccount = 'Account selection is missing for confirmation.'
      if (!selectBank) newErrors.selectBank = 'Bank selection is missing for confirmation.'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Fetch exchange rate when the currency changes
  useEffect(() => {
    const fetchExchangeRate = async () => {
      if (currency === 'USD') {
        try {
          const response = await fetch('/api/units?where[unit_code][equals]=USD')
          const data = await response.json()
          setExchangeRate(1 / data.docs[0].amount) // Convert VND to USD
        } catch (error) {
          console.error('Error fetching exchange rate:', error)
          setExchangeRate(1) // Default to 1 if the fetch fails
        }
      } else {
        setExchangeRate(1) // Default to 1 for VND
      }
    }

    fetchExchangeRate()
  }, [currency])

  // Update the displayed quickAmounts when the currency or exchange rate changes
  useEffect(() => {
    const updatedQuickAmounts = quickAmounts.map((item) => ({
      ...item,
      value: currency === 'USD' ? parseFloat((item.value * exchangeRate).toFixed(2)) : item.value,
    }))
    setConvertedQuickAmounts(updatedQuickAmounts)
  }, [currency, exchangeRate])

  const handleQuickAmount = (value: any) => {
    setAmount(value.toString())
  }

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/accounts?where[user][equals]=${user.id}`) // Replace with dynamic user ID if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setAccounts(data.docs) // Store the accounts in state
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }

    fetchAccounts()
  }, [loading])

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`/api/banks?where[user][equals]=${user.id}`) // Replace with dynamic user ID if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const data = await response.json()
        setBanks(data.docs) // Store the accounts in state
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }

    fetchBanks()
  }, [loading])

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <div>Loading...</div> // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join')
    return <div>Redirecting...</div> // Optional: Show a redirect message
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep()) {
      toast({
        title: 'Form validation failed',
        description: 'Please review the form and fix errors before submitting.',
      })
      return
    }

    try {
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
          user_id: Number(user.id),
          bank_id: Number(selectBank),
          amount: Number(USDCurrency),
          status: 'pending',
          from_account: Number(fromAccount),
          type: 'deposit',
          currency: currency,
        }), // Convert the request body to JSON
      })

      const data = await response.json()
      notifyDeposit(data.data) // Call notifyDeposit and get its response
      if (!response.ok) {
        // Parse the error response to retrieve the error message
        const errorResponse = await response.json()
        const errorMessage = errorResponse.response?.error || 'An unknown error occurred'
        throw new Error(errorMessage)
      }
      toast({
        title: 'Transaction created successfully',
        description: 'Your deposit is being processed.',
      })
    } catch (error) {
      console.error('Error creating transaction:', error)
      toast({
        title: 'Transaction failed',
        description: String(error),
      })
    }
    router.push('/account/history') // Assuming there's a dashboard page to redirect to
  }

  return (
    <>
      {/* Render Steps and Errors */}
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Deposit</h1>
        <TabMenu items={accountConfig.tabList} defaultValue="deposit" />
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Deposit Funds</CardTitle>
            <CardDescription>Add money to your account securely</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps currentStep={step} className="mb-8">
              <Step title="Amount" />
              <Step title="Method" />
              <Step title="Confirm" />
            </Steps>
            <form onSubmit={handleSubmit}>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromAccount">Account</Label>
                    <Select value={fromAccount} onValueChange={handleFromAccountChange}>
                      <SelectTrigger id="fromAccount">
                        <SelectValue placeholder="Select account" />
                      </SelectTrigger>
                      <SelectContent>
                        {accounts.map((account) => (
                          <SelectItem key={account.id} value={account.id.toString()}>
                            {account.account_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-muted-foreground">
                      Balance:{' '}
                      {selectedBalance.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      })}
                    </p>
                    {errors.fromAccount && (
                      <p className="text-red-500 text-sm">{errors.fromAccount}</p>
                    )}
                  </div>

                  <CurrencyConverter setUSDCurrency={setUSDCurrency} />
                  {errors.USDCurrency && (
                    <p className="text-red-500 text-sm">{errors.USDCurrency}</p>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="fromAccount">Your Bank Account</Label>
                    <Select value={selectBank} onValueChange={handleBankChange}>
                      <SelectTrigger id="bank">
                        <SelectValue placeholder="Select bank" />
                      </SelectTrigger>
                      <SelectContent>
                        {banks.map((bank) => (
                          <SelectItem key={bank.id} value={bank.id.toString()}>
                            {bank.bank_name} - {bank.account_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {banks.length <= 0 ? (
                      <div className="mt-4">
                        <div
                          onClick={() => {
                            router.push('/user-profile')
                          }}
                          className="text-blue-600 hover:text-blue-800 cursor-pointer"
                        >
                          Don&apos;t see your bank? Register
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                    {errors.selectBank && (
                      <p className="text-red-500 text-sm">{errors.selectBank}</p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <RadioGroup value={method} onValueChange={setMethod}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="bank" id="bank" />
                      <Label htmlFor="bank" className="flex items-center space-x-2">
                        <Banknote className="h-4 w-4" />
                        <span>Bank Transfer</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="vnpay" id="vnpay" disabled />
                      <Label htmlFor="vnpay" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>VNPay (not available)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="momo" id="momo" disabled />
                      <Label htmlFor="momo" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Momo (not available)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="paypal" id="paypal" disabled />
                      <Label htmlFor="paypal" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>PayPal (not available)</span>
                      </Label>
                    </div>
                  </RadioGroup>

                  {method === 'bank' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Bank Transfer QR Code</Label>
                        <div className="flex justify-center">
                          <Image
                            src="https://i.postimg.cc/y8XwnHrX/image.png"
                            alt="Bank Transfer QR Code"
                            width={200}
                            height={200}
                            className="border rounded-lg"
                          />
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                          Scan this QR code with your banking app to make the transfer
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Confirm your deposit</AlertTitle>
                    <AlertDescription>
                      Please review the details below before confirming your deposit.
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Amount:</span>
                      <span className="font-semibold">
                        {currency} {Number(USDCurrency).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Method:</span>
                      <span className="font-semibold">Bank Transfer</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span className="font-semibold">
                        **** **** **** {accountNumber.slice(-4)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-between">
            {step > 1 && (
              <Button variant="outline" onClick={handlePreviousStep}>
                Back
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNextStep}>Next</Button>
            ) : (
              <Button onClick={handleSubmit}>Confirm Deposit</Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
