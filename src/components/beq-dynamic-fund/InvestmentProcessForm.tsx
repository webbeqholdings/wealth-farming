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
import { buildProfitRecordsAnnualy } from '@/lib/profitCalculator'

import { useToast } from '@/hooks/use-toast'
type Term = 'less than 1 month' | '1 month' | 'quarterly' | 'semester' | 'annually'

interface Rate {
  term: Term
  rate: number
}

const rates: Rate[] = [
  { term: 'less than 1 month', rate: 0.04 },
  { term: '1 month', rate: 0.0595 },
  { term: 'quarterly', rate: 0.0615 },
  { term: 'semester', rate: 0.0635 },
  { term: 'annually', rate: 0.0655 },
]

const minRangeDays = 50

export function InvestmentProcessForm({ onCalculate }: { onCalculate: (data: any) => void }) {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [term, setTerm] = useState<Term>('less than 1 month')
  const [depositAmount, setDepositAmount] = useState<number>(10000)
  const [dayCount, setDayCount] = useState<number>(0)
  const tomorrow = addDays(new Date(), 1)
  const { toast } = useToast()

  useEffect(() => {
    if (startDate && endDate) {
      const daysDifference = differenceInDays(endDate, startDate)
      if (daysDifference < minRangeDays) {
        setEndDate(addDays(startDate, minRangeDays))
      }

      setDayCount(daysDifference)
    }
  }, [startDate, endDate])

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
    if (startDate && endDate && depositAmount) {
      const daysDifference = differenceInDays(endDate, startDate)
      if (daysDifference < 50) {
        toast({
          title: 'Error',
          description: `The investment period must be at least ${minRangeDays} days.`,
        })
        return
      }

      const profitData = buildProfitRecordsAnnualy(depositAmount, startDate, endDate)
      onCalculate(profitData)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Process</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="depositAmount">Deposit Amount</Label>
            <Input
              id="depositAmount"
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(Number(e.target.value))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="term">Term</Label>
            <Select value={term} onValueChange={(value: Term) => setTerm(value)}>
              <SelectTrigger id="term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                {rates.map((rate) => (
                  <SelectItem key={rate.term} value={rate.term}>
                    {rate.term} ({(rate.rate * 100).toFixed(2)}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
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
            <Label htmlFor="endDate">End Date</Label>
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
          <p>{dayCount} Days</p>
          <Button type="submit" className="w-full">
            Calculate Investment
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
