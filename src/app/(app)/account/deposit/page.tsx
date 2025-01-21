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
import CurrencyConverter, { useCurrencyConverter } from '@/components/CurrencyConverter'
import { getAccountsByUserId } from '../../../../lib/account'
import { getPaymentTransfer } from '@/lib/paymentTransfer'
import Spinner from '@/components/Spinner'
import { useTranslation } from 'react-i18next';

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
  const { convertUSDtoVND } = useCurrencyConverter(() => { });
  const { t } = useTranslation();
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
  const [depositScreenshot, setDepositScreenshot] = useState<FormData>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bankQRCode, setBankQRCode] = useState();
  const [bankAccountNumber, setBankAccountNumber] = useState();
  const [bankAccountName, setBankAccountName] = useState();
  const [cryptoWalletQrCodeUrl, setCryptoWalletQrCodeUrl] = useState();
  const [cryptoWalletAddress, setCryptoWalletAddress] = useState();
  const [cryptoWalletNetwork, setCryptoWalletNetwork] = useState();
  const [minDeposit, setMinDeposit] = useState(0);
  const quickAmounts = [
    { label: '500K', value: 500000 },
    { label: '1M', value: 1000000 },
    { label: '10M', value: 10000000 },
    { label: '50M', value: 50000000 },
    { label: '100M', value: 100000000 },
  ]

  const [convertedQuickAmounts, setConvertedQuickAmounts] = useState(quickAmounts)
  const [USDCurrency, setUSDCurrency] = useState<number>(0)
  const handleNextStep = async () => {
    if (!validateStep()) {
      toast({
        title: 'Error',
        description: 'Some fields are missing or invalid.'
      })
    }
    if (USDCurrency < minDeposit && Number(USDCurrency) > 0) {
      toast({
        title: `Error`,
        description: `The amount must be greater than or equal to the minimum withdrawal amount of ${minDeposit} USD.`
      })
    } else if (validateStep()) {
      if (step < 3) setStep(step + 1)
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

    if (step === 2) {
      if (!depositScreenshot) {
        newErrors.depositScreenshot = 'Please upload a valid deposit screenshot.';
      }
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
  useEffect(() => {
    const fetchPaymentTransfer = async () => {
      const paymentTransfer = await getPaymentTransfer();
      setMinDeposit(paymentTransfer.minDeposit)
      setBankQRCode(paymentTransfer.bankQrCode.url)
      setCryptoWalletQrCodeUrl(paymentTransfer.cryptoWalletQrCode.url)
      setCryptoWalletNetwork(paymentTransfer.cryptoWalletNetwork)
      setCryptoWalletAddress(paymentTransfer.cryptoWalletAddress)
      setBankAccountName(paymentTransfer.bankAccountDescription)
      setBankAccountNumber(paymentTransfer.bankAccountNumber)
    }

    fetchPaymentTransfer()
  }, [loading])

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

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        if (user && user?.id) {
          const accountsData = await getAccountsByUserId(user.id)
          if (accountsData) {
            setAccounts(accountsData)
          }
        }
      } catch (error) {
        console.error('Failed to fetch accounts:', error)
      }
    }

    fetchAccounts()
  }, [loading])

  useEffect(() => {
    const fetchBanks = async () => {
      try {
        if (!user?.id) {
          return
        }
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
    return <Spinner />
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join')
    return <Spinner /> // Optional: Show a redirect message
  }

  const handleDepositScreenshotChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)
      setDepositScreenshot(formData)
    } else {
      toast({
        title: 'Error',
        description: 'Please select a file to upload.'
      });
    }
  };


  const uploadScreenshot = async (formData: FormData) => {
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Screenshot upload failed')
      }

      const data = await response.json()

      // Ensure the `id` is returned properly
      if (!data?.doc?.id) {
        throw new Error('Media upload response does not contain an id')
      }

      return data.doc.id // Return the extracted `id`
    } catch (error) {
      console.error('Error uploading screenshot:', error)
      throw error
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isSubmitting) return
    setIsSubmitting(true)

    if (!validateStep()) {
      toast({
        title: 'Error',
        description: 'Please review the form and fix errors before submitting.'
      })
      return
    }

    try {
      let depositScreenshotId = null // Initialize to null

      // Upload screenshot if present
      if (depositScreenshot) {
        depositScreenshotId = await uploadScreenshot(depositScreenshot)
      }

      // Construct the request payload
      const payload = {
        user_id: Number(user.id),
        bank_id: Number(selectBank),
        amount: Number(USDCurrency),
        status: 'pending',
        from_account: Number(fromAccount),
        type: 'deposit',
        currency: currency,
        deposit_screenshot: depositScreenshotId, // Include the screenshot ID
      }

      // Make the API request
      const response = await fetch('/api/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()
      notifyDeposit(data.data) // Call notifyDeposit and get its response

      if (!response.ok) {
        const errorMessage = data.response?.error || 'An unknown error occurred'
        throw new Error(errorMessage)
      }

      toast({
        title: 'Transaction created successfully',
      })

      router.push('/account/history/deposit') // Redirect to history page with tab = 'deposit'
    } catch (error) {
      console.error('Error creating transaction:', error)
      toast({
        title: 'Error',
        description: String(error),
      })
    } finally {
      setIsSubmitting(false)
    }
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
            <CardTitle>{t('deposit_title')}</CardTitle>
            <CardDescription>{t('deposit_decs')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Steps currentStep={step} className="mb-8">
              <Step title="Amount" />
              <Step title="Method" />
              <Step title="Confirm" />
            </Steps>
            <form>
              {step === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fromAccount">{t('account')}</Label>
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
                      {t('balance')}:{' '}
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
                    <Label htmlFor="fromAccount">{t('bank_account')}</Label>
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
                          {t('deposit_no_bank')}
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
                      <RadioGroupItem value="crypto" id="crypto" />
                      <Label htmlFor="crypto" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Crypto Wallet</span>
                      </Label>
                    </div>
                    {/* <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="vnpay" id="vnpay" />
                      <Label htmlFor="vnpay" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>VNPay (not available)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="momo" id="momo" />
                      <Label htmlFor="momo" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>Momo (not available)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 opacity-50">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>PayPal (not available)</span>
                      </Label>
                    </div> */}
                  </RadioGroup>
                  {method === 'bank' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="flex justify-center">
                          SCAN THIS QR CODE
                        </Label>
                        <div className="flex justify-center">
                          <img
                            //src={bankQRCode || "https://via.placeholder.com/300"  }
                            src={ process.env.PAYMENT_QR_API_VN+"?accountName=TA%20THI%20MY%20PHUONG&amount=" + convertUSDtoVND(USDCurrency, 0)+ "&addInfo=" + encodeURIComponent(user.first_name + ' ' + user.last_name +  ' ' + user.phone_contact + " Deposit WF")}
                            alt="Bank Transfer QR Code"
                            width={400}
                            height={400}
                            className="border rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium text-gray-700">{bankAccountName}</p>
                          <p className="text-sm font-medium text-gray-700">{bankAccountNumber}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="deposit_screenshot" className="text-sm font-medium text-gray-700">
                          Upload Your Deposit
                        </Label>
                        <Input
                          id="deposit_screenshot"
                          name="deposit_screenshot"
                          type="file"
                          onChange={handleDepositScreenshotChange}
                          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500">
                          {t('deposit_form_file_notice')}
                        </p>
                        {errors.depositScreenshot && (
                          <p className="text-red-500 text-sm">{errors.depositScreenshot}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {method === 'crypto' && (
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <Label className="flex justify-center">
                          SCAN THIS QR CODE
                        </Label>
                        <div className="flex justify-center">
                          <Image
                            src={cryptoWalletQrCodeUrl || "https://via.placeholder.com/300"}
                            alt="Crypto Wallet QR Code"
                            width={300}
                            height={300}
                            className="border rounded-lg shadow-md"
                          />
                        </div>
                        <div className="space-y-1 text-center">
                          <p className="text-sm font-medium text-gray-700">{cryptoWalletNetwork}</p>
                          <p className="text-sm font-medium text-gray-700">{cryptoWalletAddress}</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <Label htmlFor="deposit_screenshot" className="text-sm font-medium text-gray-700">
                          {t("deposit_form_file")}
                        </Label>
                        <Input
                          id="deposit_screenshot"
                          name="deposit_screenshot"
                          type="file"
                          onChange={handleDepositScreenshotChange}
                          className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                        <p className="text-xs text-gray-500">
                          {t("deposit_form_file_notice")}
                        </p>
                        {errors.depositScreenshot && (
                          <p className="text-red-500 text-sm">{errors.depositScreenshot}</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              {step === 3 && (
                <div className="space-y-4">
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{t("deposit_cofirm_alert")}</AlertTitle>
                    <AlertDescription>
                      {t('deposit_cofirm_alert_decs')}
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('money_amount')}:</span>
                      <span className="font-semibold">
                        {currency} {Number(USDCurrency).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('method')}:</span>
                      <span className="font-semibold">{method == 'bank' ? 'Bank Transfer' : 'Crypto Wallet'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t("card_number")}:</span>
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
                {t('back')}
              </Button>
            )}
            {step < 3 ? (
              <Button onClick={handleNextStep}>{t("Next")}</Button>
            ) : (
              <Button
                type="submit"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={cn(isSubmitting && 'cursor-not-allowed opacity-50')}
              >
                {isSubmitting ? 'Processing...' : 'Submit'}
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
