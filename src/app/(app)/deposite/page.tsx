'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { CreditCard, DollarSign, Landmark, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

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
  const [method, setMethod] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [routingNumber, setRoutingNumber] = useState('')

  const handleNextStep = () => {
    if (step < 3) setStep(step + 1)
  }

  const handlePreviousStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real application, this would process the deposit
    alert('Deposit processed successfully!')
    router.push('/dashboard') // Assuming there's a dashboard page to redirect to
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-2xl mx-auto">
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
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <RadioGroup value={method} onValueChange={setMethod}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card">Credit/Debit Card</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank">Bank Transfer</Label>
                  </div>
                </RadioGroup>

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
                    <div className="flex space-x-4">
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="text"
                          placeholder="MM/YY"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2 flex-1">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          type="text"
                          placeholder="123"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {method === 'bank' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="accountNumber">Account Number</Label>
                      <Input
                        id="accountNumber"
                        type="text"
                        placeholder="Your bank account number"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="routingNumber">Routing Number</Label>
                      <Input
                        id="routingNumber"
                        type="text"
                        placeholder="Your bank routing number"
                        value={routingNumber}
                        onChange={(e) => setRoutingNumber(e.target.value)}
                      />
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
                  {method === 'bank' && (
                    <div className="flex justify-between">
                      <span>Account Number:</span>
                      <span className="font-semibold">
                        **** **** **** {accountNumber.slice(-4)}
                      </span>
                    </div>
                  )}
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
  )
}
