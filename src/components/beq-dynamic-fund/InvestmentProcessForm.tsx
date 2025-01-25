'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { format, differenceInDays, isBefore, addDays, getYear } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  buildProfitRecordsAnnualy,
  buildProfitRecordsQuarterly,
  buildProfitRecordsSemester,
  buildProfitRecordsMonthly,
  buildProfitLogsAnnualy,
  buildProfitLogsQuarterly,
  buildProfitLogsSemester,
  buildProfitLogsMonthly,
  contractEndAt,
  contractMultiPeriodEndAt,
  standardApplyProgramDays,
  canCancelContractAt,
} from '@/lib/investment-products/dynamicFund'
import { createInvestment } from '@/lib/transaction'
import { getPublicProducts } from '@/lib/investment-products/dynamicFundQuery'

import { useToast } from '@/hooks/use-toast'
import { notifyInvestment } from '@/lib/telegram'
import { useRouter } from 'next/navigation'
import userStatus from '@/lib/userStatus'
import { checkContractLarger90Days } from '@/lib/contract'
import { useTranslation } from 'react-i18next'

const minRangeDays = 5
const now = new Date()
const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0)
const tomorrow = addDays(startOfDay, 1)

export function InvestmentProcessForm({
  onCalculate,
  onRequest,
}: {
  onCalculate: (data: any) => void
  onRequest: (data: any) => void
}) {
  const { t } = useTranslation()
  const { isLoggedIn } = userStatus()
  const router = useRouter()

  const [startDate, setStartDate] = useState<Date | undefined>(tomorrow)
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(startDate, minRangeDays))
  const [term, setTerm] = useState<any>('annually')
  const [productName, setProductName] = useState('BeQ Dynamic Fund Annually')
  const [depositAmount, setDepositAmount] = useState<number>(10000)
  const [periods, setPeriods] = useState<number>(1)
  const [dayCount, setDayCount] = useState<number>(0)
  const [rateConfig, setRateConfig] = useState([])
  const [isSiteLoading, setIsSiteLoading] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    if (startDate === undefined) {
      setStartDate(tomorrow)
    }

    if (isSiteLoading) {
      const fetchRates = async () => {
        try {
          setIsSiteLoading(true)
          const MonthlyAvalable = await checkContractLarger90Days()
          const response: any = await getPublicProducts()
          if (MonthlyAvalable) {
            setRateConfig(response)
          } else {
            const no90Term = response.slice(1, 4)
            setRateConfig(no90Term)
          }
        } finally {
          setIsSiteLoading(false)
        }
      }

      fetchRates()
    }

    if (startDate && endDate) {
      const daysDifference = differenceInDays(endDate, startDate)
      if (daysDifference < minRangeDays) {
        setEndDate(addDays(startDate, minRangeDays))
      }

      setDayCount(daysDifference)
    }
    setEndDate(contractMultiPeriodEndAt(startDate, term, periods))
  }, [startDate, term, periods])

  const handleStartDateSelect = (date: Date | undefined) => {
    if (date === undefined) {
      date = tomorrow
    }

    setStartDate(date)
    if (endDate && date) {
      const daysDifference = differenceInDays(endDate, date)
      if (daysDifference < minRangeDays) {
        setEndDate(addDays(date, minRangeDays))
      }
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    if (date && startDate) {
      const daysDifference = differenceInDays(date, startDate)
      if (daysDifference < minRangeDays) {
        return
      }
    }
    setEndDate(date)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let profitData = []

    if (startDate && endDate && depositAmount) {
      const daysDifference = differenceInDays(endDate, startDate)
      if (daysDifference < minRangeDays) {
        return toast({
          title: 'Error',
          description: `The investment period must be at least ${minRangeDays} days.`,
        })
      }

      if (term == 'annually') {
        let data = await buildProfitLogsAnnualy(depositAmount, startDate, endDate)
        profitData.push(data)
      }

      if (term == 'semester') {
        let data = await buildProfitLogsSemester(depositAmount, startDate, endDate)
        profitData.push(data)
      }

      if (term == 'quarterly') {
        let data = await buildProfitLogsQuarterly(depositAmount, startDate, endDate)
        profitData.push(data)
      }

      if (term == 'monthly') {
        let data = await buildProfitLogsMonthly(depositAmount, startDate, endDate)
        profitData.push(data)
      }
      onCalculate(profitData)

      onRequest({
        amount: depositAmount,
        term: term,
        startDate: startDate,
        endDate: endDate,
        periods: periods,
        dataExtra: {
          rateConfig: rateConfig,
          standardApplyProgramDays: standardApplyProgramDays,
          profitData: profitData,
          contractEndAt: contractEndAt(startDate, term),
          canCancelContractAt: canCancelContractAt(startDate), // +90 days
        },
      })
    }
  }

  const calculateBalance = async (term: string) => {
    let build
    if (term == 'annually') {
      build = await buildProfitLogsAnnualy(depositAmount, startDate, endDate)
    }

    if (term == 'semester') {
      build = await buildProfitLogsSemester(depositAmount, startDate, endDate)
    }

    if (term == 'quarterly') {
      build = await buildProfitLogsQuarterly(depositAmount, startDate, endDate)
    }

    if (term == 'monthly') {
      build = await buildProfitLogsMonthly(depositAmount, startDate, endDate)
    }

    return build?.balance
  }

  const handleInvestment = async () => {
    // If the user is not logged in, redirect to the join page
    if (!isLoggedIn) {
      router.push('../../join')
      return // Optional: Show a redirect message
    }

    if (startDate && endDate && depositAmount > 0) {
      const formData = {
        productName: productName,
        expected_return: calculateBalance(term),
        amount: depositAmount,
        term: term,
        startDate: startDate,
        endDate: endDate,
        periods: periods,
      }
      const response: any = await createInvestment(formData)
      if (!response.isSuccess) {
        toast({
          title: 'Error',
          description: response.msg,
        })
        return
      }
      notifyInvestment(response.data.contract)
      toast({
        title: 'Success',
        description: 'Investment request has been submitted.',
      })
      router.push('../../investment-contracts')
    } else {
      toast({
        title: 'Error',
        description: 'Please ensure all fields are filled out correctly.',
      })
    }
  }

  if (isSiteLoading) return <div className="text-center">Loading rate configurations...</div>

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('investment_plan')}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount">{t('usd_amount_invested')}</Label>
            <Input
              id="depositAmount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="term">{t('interest_withdrawal_period')}</Label>
            <Select
              value={term}
              onValueChange={(value: string) => {
                const selectedRate = rateConfig.find((rate) => rate.term === value)
                if (selectedRate) {
                  setTerm(selectedRate.term)
                  setProductName(selectedRate.product_name) // Update the product ID here
                }
                setEndDate(contractMultiPeriodEndAt(startDate, term, periods))
              }}
            >
              <SelectTrigger id="term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {rateConfig &&
                  rateConfig.map((rate) => (
                    <SelectItem key={rate.term} value={rate.term}>
                      {rate.product_name}
                      <span className="text-gray-400 mx-3">
                        {(rate.rate_of_return * 100).toFixed(2)}% / {t('month')}
                      </span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">{t('join_date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={`w-full justify-start text-left font-normal ${
                    !startDate && 'text-muted-foreground'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'd/MM/yyyy') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                  disabled={(date) => {
                    return isBefore(date, tomorrow)
                  }}
                  defaultMonth={startDate || tomorrow}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">{t('contract_end_date')}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={`w-full justify-start text-left font-normal ${
                    !endDate && 'text-muted-foreground'
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'd/MM/yyyy') : t('pick_date')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={handleEndDateSelect}
                  initialFocus
                  disabled={(date) =>
                    startDate ? isBefore(date, addDays(startDate, minRangeDays)) : false
                  }
                  defaultMonth={endDate || (startDate ? addDays(startDate, 14) : new Date())}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="periods">{t('investment_periods')}</Label>
            <Input
              id="periods"
              type="number"
              value={periods}
              onChange={(e) => setPeriods(Number(e.target.value))}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {t('calculate_result')}
          </Button>
        </form>
        <Button
          type="button"
          onClick={() => handleInvestment()}
          className="w-full mt-2 bg-green-600 text-white hover:bg-green-500"
        >
          {t('submit_investment')}
        </Button>
      </CardContent>
    </Card>
  )
}
