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
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [method, setMethod] = useState('bank')
  const [accountNumber, setAccountNumber] = useState('')
  const [accounts, setAccounts] = useState([]);
  const [banks, setBanks] = useState([]);
  const [selectBank, setSelectBank] = useState(null);
  const [fromAccount, setFromAccount] = useState(null);
  const [selectedBalance, setSelectedBalance] = useState(0)

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleFromAccountChange = (accountId: string) => {
    const numericAccountId = Number(accountId); // Convert the string to a number
    const selectedAccount = accounts.find((account) => account.id === numericAccountId);
    setFromAccount(numericAccountId.toString()); // Store the numeric ID in state
    setSelectedBalance(selectedAccount?.amount || 0);
  };

  const handleBankChange = (bankId: string) => {
    setSelectBank(bankId.toString()); // Convert the string to a number
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`/api/accounts?where[user][equals]=${userId}`); // Replace with dynamic user ID if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setAccounts(data.docs); // Store the accounts in state
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchAccounts();
  }, []);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`/api/banks?where[user][equals]=${userId}`); // Replace with dynamic user ID if necessary
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setBanks(data.docs); // Store the accounts in state
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };

    fetchBanks();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would process the deposit
    try {
      const userId = localStorage.getItem('user_id');
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
          user_id: userId,
          bank_id: selectBank,
          amount: amount,
          status: "pending",
          from_account: fromAccount,
          type: "deposit"
        }), // Convert the request body to JSON
      });

      if (!response.ok) {
        // Parse the error response to retrieve the error message
        const errorResponse = await response.json();
        const errorMessage = errorResponse.response?.error || 'An unknown error occurred';
        throw new Error(errorMessage);
    }
      toast({
        title: 'Transaction created successfully',
      })
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast({
        title: `${error}`,
      })
    }
    router.push('/account/history') // Assuming there's a dashboard page to redirect to
  }

  const quickAmounts = [
    { label: '500K', value: 500000 },
    { label: '1M', value: 1000000 },
    { label: '10M', value: 10000000 },
    { label: '50M', value: 50000000 },
    { label: '100M', value: 100000000 },
  ]

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString())
  }

  return (
    <>
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
                  <Label htmlFor="fromAccount">From Account</Label>
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
                  <p className="text-sm text-muted-foreground">Balance: ${selectedBalance}</p>
                </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount">Deposit Amount</Label>
                    <div className="flex space-x-2">
                      <Select value={currency} onValueChange={setCurrency}>
                        <SelectTrigger className="w-[100px]">
                          <SelectValue placeholder="Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Quick Amount</Label>
                    <div className="flex flex-wrap gap-2">
                      {quickAmounts.map((quickAmount) => (
                        <Button
                          key={quickAmount.label}
                          variant="outline"
                          type="button"
                          onClick={() => handleQuickAmount(quickAmount.value)}
                        >
                          {quickAmount.label}
                        </Button>
                      ))}
                    </div>
                  </div>
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
                        {currency} {Number(amount).toLocaleString()}
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
