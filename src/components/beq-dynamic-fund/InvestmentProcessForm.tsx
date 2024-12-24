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
import { format, differenceInDays, isBefore, addDays } from 'date-fns'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  buildProfitRecordsAnnualy,
  buildProfitRecordsQuarterly,
  buildProfitRecordsSemester,
  buildProfitRecordsMonthly,
  rateConfig,
  contractEndAt,
  contractMultiPeriodEndAt,
  standardApplyProgramDays,
  canCancelContractAt,
  Term,
} from '@/lib/investment-products/dynamicFund'

import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'

const minRangeDays = 15

export function InvestmentProcessForm({
  onCalculate,
  onRequest,
}: {
  onCalculate: (data: any) => void
  onRequest: (data: any) => void
}) {
  const tomorrow = addDays(new Date(), 0)
  const [startDate, setStartDate] = useState<Date | undefined>(tomorrow)
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(startDate, minRangeDays))
  const [term, setTerm] = useState<Term>('Annually')
  const [depositAmount, setDepositAmount] = useState<number>(10000)
  const [periods, setPeriods] = useState<number>(1)
  const [dayCount, setDayCount] = useState<number>(0)

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

  const onChangeTerm = (e: Term) => {
    console.log('hello nice')
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
                  className={`w-full justify-start text-left font-normal ${
                    !startDate && 'text-muted-foreground'
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
                  className={`w-full justify-start text-left font-normal ${
                    !endDate && 'text-muted-foreground'
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
      </CardContent>
    </Card>
  )
}
