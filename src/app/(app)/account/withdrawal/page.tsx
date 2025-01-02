'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import UserStatus from '@/lib/userStatus'
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
import { CreditCard, DollarSign, Landmark, AlertCircle, ArrowDownCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { TabMenu } from '@/components/w88/TabMenu'
import { accountConfig } from '@/config/accounts'
import { toast } from '@/hooks/use-toast'
import { notifyWithdrawl } from '@/lib/telegram'
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

export default function WithdrawPage() {
  const {isLoggedIn, loading, user} = UserStatus();
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('VND')
  const [method, setMethod] = useState('bank')
  const [cardNumber, setCardNumber] = useState('')
  const [banks, setBanks] = useState([])
  const [accounts, setAccounts] = useState([]);
  const [selectBank, setSelectBank] = useState(null)

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleBankChange = (bankId: string) => {
    setSelectBank(bankId.toString());
  };

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch(`/api/accounts?where[user][equals]=${user.id}&where[account_name][equals]=Main`); // Replace with dynamic user ID if necessary
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
  }, [loading]);

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const response = await fetch(`/api/banks?where[user][equals]=${user.id}`); // Replace with dynamic user ID if necessary
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
  }, [loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would process the withdrawal
    try {
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
          user_id: user.id,
          bank_id: selectBank,
          amount: -amount,
          status: "pending",
          from_account: accounts[0].id,
          type: "withdraw",
          currency: currency
        }), // Convert the request body to JSON
      });
      let data = await response.json()
      if (!response.ok) {
        // Parse the error response to retrieve the error message
        const errorMessage = data.response?.error || 'An unknown error occurred';
        console.log('errorMessage: ', errorMessage);
        toast({
          title: `${errorMessage}`,
        })
        throw new Error(errorMessage);
      }
      notifyWithdrawl(data.data)
      toast({
        title: 'Transaction created successfully',
      })
      router.push('/account/history') // Assuming there's a dashboard page to redirect to
    } catch (error) {
      console.log('Error creating transaction:', error);
      toast({
        title: `${error}`,
      })
    }
  }

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join');
    return <div>Redirecting...</div>; // Optional: Show a redirect message
  }

  return (
    <>
        <SiteHeader />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-6">My Withdrawal</h1>
          <TabMenu items={accountConfig.tabList} defaultValue="withdrawal" />
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Withdraw Funds</CardTitle>
              <CardDescription>Securely withdraw money from your account</CardDescription>
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
                      <Label htmlFor="amount">Withdrawal Amount</Label>
                      <div className="flex space-x-2">
                        <Select value={currency} onValueChange={setCurrency}>
                          <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Currency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="VND">VND</SelectItem>
                            <SelectItem value="USD">USD</SelectItem>
                            {/* <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem> */}
                          </SelectContent>
                        </Select>
                        <Input
                          id="amount"
                          type="number"
                          placeholder="0"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Withdrawal Limits</AlertTitle>
                      <AlertDescription>
                        Daily limit: $10,000. Monthly limit: $50,000. Ensure you have sufficient funds
                        in your account.
                      </AlertDescription>
                    </Alert>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <RadioGroup value={method} onValueChange={setMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank">Bank Transfer</Label>
                      </div>
                      {/* <div className="flex items-center space-x-2">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card">Credit/Debit Card</Label>
                    </div> */}
                    </RadioGroup>

                    {method === 'bank' && (
                      <div className="space-y-4">
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

                    {method === 'card' && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input
                            id="cardNumber"
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                          />
                        </div>
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Card Withdrawal Notice</AlertTitle>
                          <AlertDescription>
                            Withdrawals to cards may take 3-5 business days to process. Some banks may
                            charge additional fees.
                          </AlertDescription>
                        </Alert>
                      </div>
                    )}
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-4">
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Confirm your withdrawal</AlertTitle>
                      <AlertDescription>
                        Please review the details below before confirming your withdrawal request.
                      </AlertDescription>
                    </Alert>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Amount:</span>
                        <span className="font-semibold">
                          {currency} {amount}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Method:</span>
                        <span className="font-semibold">
                          {method === 'card' ? 'Credit/Debit Card' : 'Bank Transfer'}
                        </span>
                      </div>
                      {method === 'card' && (
                        <div className="flex justify-between">
                          <span>Card Number:</span>
                          <span className="font-semibold">**** **** **** {cardNumber.slice(-4)}</span>
                        </div>
                      )}
                    </div>
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Important</AlertTitle>
                      <AlertDescription>
                        By confirming, you agree to our withdrawal terms and conditions. This action
                        cannot be undone.
                      </AlertDescription>
                    </Alert>
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
                <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
                  <ArrowDownCircle className="mr-2 h-4 w-4" />
                  Confirm Withdrawal
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
        <SiteFooter />
    </>
  )
}
