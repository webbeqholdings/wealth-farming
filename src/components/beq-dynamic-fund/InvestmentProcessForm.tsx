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
  // rateConfig,
  contractEndAt,
  contractMultiPeriodEndAt,
  standardApplyProgramDays,
  canCancelContractAt,
  Term,
} from '@/lib/investment-products/dynamicFund'
import { getProducts } from '@/lib/investment-products/localApi'
import { createTransactionInvestment } from '@/lib/transaction'

import { useToast } from '@/hooks/use-toast'
import { notifyInvestment } from '@/lib/telegram'
import { useRouter } from 'next/navigation'
import userStatus from '@/lib/userStatus'

const minRangeDays = 15

export function InvestmentProcessForm({
  onCalculate,
  onRequest,
}: {
  onCalculate: (data: any) => void
  onRequest: (data: any) => void
}) {
  const { isLoggedIn, loading, user } = userStatus();
  const router = useRouter()
  const tomorrow = addDays(new Date(), 0)
  const [startDate, setStartDate] = useState<Date | undefined>(tomorrow)
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(startDate, minRangeDays))
  const [term, setTerm] = useState<Term>('Annually')
  const [depositAmount, setDepositAmount] = useState<number>(10000)
  const [periods, setPeriods] = useState<number>(1)
  const [dayCount, setDayCount] = useState<number>(0)
  const [rateConfig, setRateConfig] = useState([]);

  const { toast } = useToast()

  useEffect(() => {
    if (startDate && endDate) {
      const daysDifference = differenceInDays(endDate, startDate)
      if (daysDifference < minRangeDays) {
        setEndDate(addDays(startDate, minRangeDays))
      }

      setDayCount(daysDifference)
    }
    setEndDate(contractMultiPeriodEndAt(startDate, term, periods))
  }, [startDate, term, periods])

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await getProducts(); // Fetch rateConfig data
        setRateConfig(response);
      } catch (error) {
        console.error('Failed to fetch rates:', error);
      }
    };

    fetchRates();
  }, []);

  const handleStartDateSelect = (date: Date | undefined) => {
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

  const handleSubmit = (e: React.FormEvent) => {
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

      if (term == 'Annually') {
        profitData = buildProfitRecordsAnnualy(depositAmount, startDate, endDate)
      }

      if (term == 'Semester') {
        profitData = buildProfitRecordsSemester(depositAmount, startDate, endDate)
      }

      if (term == 'Quarterly') {
        profitData = buildProfitRecordsQuarterly(depositAmount, startDate, endDate)
      }

      if (term == 'Monthly') {
        profitData = buildProfitRecordsMonthly(depositAmount, startDate, endDate)
      }

      onCalculate(profitData)

      console.log('... ... profitData', profitData)
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

  const calculateBalance = (term: string) => {
    let build;
    if (term == 'Annually') {
      build = buildProfitRecordsAnnualy(depositAmount, startDate, endDate)
    }

    if (term == 'Semester') {
      build = buildProfitRecordsSemester(depositAmount, startDate, endDate)
    }

    if (term == 'Quarterly') {
      build = buildProfitRecordsQuarterly(depositAmount, startDate, endDate)
    }

    if (term == 'Monthly') {
      build = buildProfitRecordsMonthly(depositAmount, startDate, endDate)
    }
    const year = getYear(endDate);
    const month = format(endDate, 'MM');

    const dateProfitFilter = build[year].filter((item: any) => {
      return format(item.date, 'MM') === month;
    });
    if (!dateProfitFilter.length) {
      return 0;
    }
    return dateProfitFilter[0]?.balance;
  };

  const calculateProfit = (term: string) => {
    let build;
    if (term == 'Annually') {
      build = buildProfitRecordsAnnualy(depositAmount, startDate, endDate)
    }

    if (term == 'Semester') {
      build = buildProfitRecordsSemester(depositAmount, startDate, endDate)
    }

    if (term == 'Quarterly') {
      build = buildProfitRecordsQuarterly(depositAmount, startDate, endDate)
    }

    if (term == 'Monthly') {
      build = buildProfitRecordsMonthly(depositAmount, startDate, endDate)
    }
    const year = getYear(endDate);
    const month = format(endDate, 'MM');

    const dateProfitFilter = build[year].filter((item: any) => {
      return format(item.date, 'MM') === month;
    });
    if (!dateProfitFilter.length) {
      return 0;
    }
    return dateProfitFilter[0]?.profit;
  };

  const handleInvestment = async () => {

    // If the user is not logged in, redirect to the join page
    if (!isLoggedIn) {
      router.push('../../join');
      return; // Optional: Show a redirect message
    }

    if (startDate && endDate && depositAmount > 0) {
      const formData = {
        expectedReturn: calculateBalance(term),
        profit: calculateProfit(term),
        amount: depositAmount,
        term: term,
        startDate: startDate,
        endDate: endDate,
        periods: periods
      }
      const response: any = await createTransactionInvestment(formData)
      if (response.error) {
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive',
        });
        return;
      }

      notifyInvestment(response.data)
      toast({
        title: 'Success',
        description: 'Investment request has been submitted.',
        variant: 'default',
      });
      router.push('../../investment-contracts')
    } else {
      toast({
        title: 'Error',
        description: 'Please ensure all fields are filled out correctly.',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Kế hoạch đầu tư</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount">Số tiền USD tham gia</Label>
            <Input
              id="depositAmount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="term">Kì Hạn Rút Lãi</Label>
            <Select value={term} onValueChange={(value: Term) => setTerm(value)}>
              <SelectTrigger id="term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {rateConfig
                  .filter((item) => item.isShowForm == true)
                  .map((rate) => (
                    <SelectItem key={rate.term} value={rate.term}>
                      {rate.term}
                      <span className="text-gray-400 mx-3">{(rate.rate * 100).toFixed(2)}%</span>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Ngày tham gia</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={`w-full justify-start text-left font-normal ${!startDate && 'text-muted-foreground'
                    }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={handleStartDateSelect}
                  disabled={(date) => isBefore(date, tomorrow)}
                  defaultMonth={startDate || tomorrow}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="endDate">Ngày kết thúc hợp đồng</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={`w-full justify-start text-left font-normal ${!endDate && 'text-muted-foreground'
                    }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP') : 'Pick a date'}
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
            <Label htmlFor="periods">Số chu kì tham gia</Label>
            <Input
              id="periods"
              type="number"
              value={periods}
              onChange={(e) => setPeriods(Number(e.target.value))}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Tính Kết Quả
          </Button>
        </form>
        <Button
            type="button"
            onClick={() => handleInvestment()}
            className="w-full mt-2 bg-green-600 text-white hover:bg-green-500"
          >
            Submit Investment
          </Button>
      </CardContent>
    </Card>
  )
}