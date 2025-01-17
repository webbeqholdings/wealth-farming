'use client'

import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { WithdrawDialog } from '@/components/withdraw-dialog'
import { TerminationDialog } from '@/components/termination-dialog'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { toast } from '@/hooks/use-toast'
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Info,
  BarChart,
  Globe,
  Shield,
} from 'lucide-react'
import { getInvestmentDetailsById, updateSetting } from '@/lib/contract'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { getPaymentTransfer } from '@/lib/paymentTransfer'
import { CircleHelp } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

interface Investment {
  id: string
  userId: string
  productName: string
  investedAmount: number
  minInvestment: number
  extendContract: number
  expectedReturn: number
  availableBalance: number
  rateOfReturn: number
  term: string
  periods: string
  profit: number
  startDate: Date
  endDate: Date
  setting: {
    auto_profit: number | null
    extend_contract: boolean | null
  }
  status: 'active' | 'completed' | 'pending' | 'inactive'
  lastWithdrawal?: string
}

export const InvestmentContractDetail: React.FC = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isTerminating, setIsTerminating] = useState(false)
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false)
  const [terminationDialogOpen, setTerminationDialogOpen] = useState(false)
  const [investmentDetails, setInvestmentDetails] = useState<Investment>()
  const [checkedStates, setCheckedStates] = useState<any>({})

  useEffect(() => {
    fetchData()
  }, [searchParams])

  const fetchData = async () => {
    const id = searchParams.get('id')
    const type = searchParams.get('type')
    if (type === 'investment') {
      const data = await getInvestmentDetailsById(Number(id))
      console.log(data)
      setInvestmentDetails(data.docs[0])
    }
  }

  // Handle Press Update in Setting
  async function handleChangeSetting(e: any) {
    // Prevent the browser from reloading the page
    e.preventDefault()

    // Read the form data
    const formData = new FormData(e.target)
    const formJson = Object.fromEntries(formData.entries())

    try {
      const paymentTransfer = await getPaymentTransfer()
      const minWithdrawal = paymentTransfer.minWithdrawal

      if (parseFloat(formJson.monthlyProfit.toString()) >= 10) {
        const formData = {
          id: formJson.id,
          setting: {
            auto_profit: formJson.monthlyProfit,
            extend_contract: formJson.extend_contract == 'on' ? true : false,
          },
        }

        const response = await updateSetting(formData)
        if (!response.success) {
          throw new Error('Failed to update setting')
        }
        fetchData()
        toast({
          title: 'Update setting successful',
        })
        router.push('/investment-contracts')
      } else {
        toast({
          title: 'Error',
          description: `The amount must be greater than or equal to the minimum withdrawal amount of ${minWithdrawal} USD.`,
        })
        fetchData()
        return
      }
    } catch (error) {
      console.error('Failed to update setting:', error)
      fetchData()
      // Revert state if API call fails
    }
  }

  // Handle toggle switch and API update
  const handleSwitchExtend = async (investment: any) => {
    const investmentId = investment.id
    const newCheckedState = !checkedStates[investmentId] // Toggle state

    // Optimistically update UI
    setCheckedStates((prevState: any) => ({
      ...prevState,
      [investmentId]: newCheckedState,
    }))
  }
  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">{investmentDetails?.productName}</CardTitle>
            <Badge variant={investmentDetails?.status === 'active' ? 'default' : 'secondary'}>
              {investmentDetails?.status}
            </Badge>
          </div>
          <CardDescription>Contract ID: {investmentDetails?.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <DollarSign className="mr-2 h-4 w-4 opacity-70" />
              <span className="font-semibold">Investment Amount:</span>
              <span className="ml-2">${investmentDetails?.investedAmount.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4 opacity-70" />
              <span className="font-semibold">Expected Return</span>
              <span className="ml-2">${investmentDetails?.expectedReturn.toLocaleString()}</span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="font-semibold">Start Date:</span>
              <span className="ml-2">
                {new Date(investmentDetails?.startDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
              <span className="font-semibold">End Date:</span>
              <span className="ml-2">
                {new Date(investmentDetails?.endDate).toLocaleDateString()}
              </span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <div>
              <span className="font-semibold">Rate Of Return:</span>
              <span className="ml-2">{investmentDetails?.rateOfReturn}%</span>
            </div>
            <div>
              <span className="font-semibold">Profit to Date:</span>
              <span className="ml-2 text-green-600">
                ${investmentDetails?.profit.toLocaleString()}
              </span>
            </div>
          </div>
          <Separator className="my-4" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="product-details">
              <AccordionTrigger>
                <div className="flex items-center">
                  <Info className="mr-2 h-4 w-4" />
                  Product Details
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* <div className="flex items-center">
                    <BarChart className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Type:</span>
                    <span className="ml-2">Investment</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Term:</span>
                    <span className="ml-2">{investmentDetails?.term}</span>
                  </div>
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Geography:</span>
                    <span className="ml-2">{investmentDetails}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Sector:</span>
                    <span className="ml-2">{investmentDetails.productDetails.sector}</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Minimum Investment:</span>
                    <span className="ml-2">
                      ${investmentDetails.productDetails.minimumInvestment.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Management Fee:</span>
                    <span className="ml-2">{investmentDetails.productDetails.managementFee}%</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Performance Fee:</span>
                    <span className="ml-2">{investmentDetails.productDetails.performanceFee}%</span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Redemption Fee:</span>
                    <span className="ml-2">{investmentDetails.productDetails.redemptionFee}%</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays className="mr-2 h-4 w-4 opacity-70" />
                    <span className="font-semibold">Lockup Period:</span>
                    <span className="ml-2">{investmentDetails.productDetails.lockupPeriod}</span>
                  </div> */}
                </div>
                <Separator className="my-4" />
                {/* <div>
                  <h4 className="font-semibold mb-2">Description:</h4>
                  <p>{investmentDetails.productDetails.description}</p>
                </div> */}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="destructive" onClick={() => setTerminationDialogOpen(true)}>
            <AlertTriangle className="mr-2 h-4 w-4" />
            Terminate Contract
          </Button>
          <Button onClick={() => setWithdrawDialogOpen(true)}>
            <DollarSign className="mr-2 h-4 w-4" />
            Withdraw Profit
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">Settings</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 ">
              <form method="POST" onSubmit={handleChangeSetting}>
                <div className="grid gap-2 ">
                  <input name={'id'} defaultValue={investmentDetails?.id} hidden />
                  <div className="grid grid-cols-4 items-center gap-4 font-medium">
                    <Label className="col-span-2">Profit Withdraw</Label>
                    <div className="col-span-2 flex items-center rounded-md ">
                      <span className="px-3 text-gray-500">$</span>
                      <input
                        name="monthlyProfit"
                        defaultValue={investmentDetails?.setting?.auto_profit ?? 0}
                        className="h-8 w-24 rounded-md"
                        type="number"
                      />
                    </div>
                    <Label className="col-span-2">
                      <div className="relative flex items-center space-x-2 cursor-pointer">
                        <span>Extend Contract</span>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <CircleHelp size={16} strokeWidth={1.25} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                Enable automatic profit withdrawal for each term by extending your
                                contract.
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </Label>

                    <div>
                      <label className="flex items-center justify-center space-x-2 cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            name="extend_contract"
                            className="sr-only"
                            onChange={() => handleSwitchExtend(investmentDetails)}
                            checked={checkedStates[investmentDetails?.id] || false}
                          />
                          <div
                            className={`w-10 h-6 bg-gray-200 rounded-full shadow-inner ${
                              checkedStates[investmentDetails?.id] ? 'bg-green-500' : 'bg-gray-300'
                            }`}
                          ></div>
                          <div
                            className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${
                              checkedStates[investmentDetails?.id] ? 'translate-x-4' : ''
                            }`}
                          ></div>
                        </div>
                      </label>
                    </div>
                    <div className="col-span-4 flex justify-center">
                      <button
                        className="col-span-2 mt-2 py-2 px-4 bg-primary rounded-md font-semibold "
                        type="submit"
                      >
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>

      {withdrawDialogOpen && investmentDetails && (
        <WithdrawDialog
          isOpen={withdrawDialogOpen}
          onClose={() => setWithdrawDialogOpen(false)}
          contract={investmentDetails}
          setActiveTab={() => {}}
        />
      )}
      {terminationDialogOpen && investmentDetails && (
        <TerminationDialog
          isOpen={terminationDialogOpen}
          onClose={() => setTerminationDialogOpen(false)}
          contract={investmentDetails}
          setActiveTab={() => {}}
        />
      )}
    </div>
  )
}

export default InvestmentContractDetail
