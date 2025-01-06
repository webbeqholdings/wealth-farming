'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getPaymentTransfer } from '@/lib/paymentTransfer'

interface CurrencyConverterProps {
  setUSDCurrency: React.Dispatch<React.SetStateAction<number>>
}

type Currency = 'USD' | 'USDT' | 'VND'

export default function CurrencyConverter({ setUSDCurrency }: CurrencyConverterProps) {
  const [exchangeRates, setExchangeRates] = useState<{ [key in Currency]: number }>({
    USD: 1,
    USDT: 1,
    VND: 25300,
  })
  const [values, setValues] = useState<Record<Currency, string>>({
    USD: '',
    USDT: '',
    VND: '',
  })

  useEffect(() => {
    const fetchExchangeRates = async () => {
      try {
        const result = await getPaymentTransfer()
        if (result) {
          setExchangeRates({
            USD: 1,
            USDT: result.usdToUsdt,
            VND: result.usdToVnd,
          })
        }
      } catch (error) {
        console.error('Error fetching exchange rates:', error)
      }
    }
    fetchExchangeRates()
  }, [])

  const formatCurrency = (value: string, currency: string): string => {
    const numValue = parseFloat(value)
    if (isNaN(numValue)) {
      return ''
    }

    if (currency === 'USDT') {
      return `USDT ${numValue.toFixed(2)}`
    }

    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })

    return formatter.format(numValue)
  }

  const convert = useCallback(
    (amount: string, from: Currency) => {
      const numAmount = parseFloat(amount)
      if (isNaN(numAmount)) {
        return { USD: '', USDT: '', VND: '' }
      }

      const inUSD = numAmount / exchangeRates[from]
      return {
        USD: inUSD.toFixed(2),
        USDT: inUSD.toFixed(2),
        VND: (inUSD * exchangeRates.VND).toFixed(2),
      }
    },
    [exchangeRates],
  )

  const handleChange = (currency: Currency) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      const newValues = value === '' ? { USD: '', USDT: '', VND: '' } : convert(value, currency)
      setValues({ ...newValues, [currency]: value })
      setUSDCurrency(Number(newValues.USD))
    }
  }

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Currency Converter</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTitle className="text-red-500">Heads up!</AlertTitle>
          <AlertDescription>System only use USD currency. </AlertDescription>
        </Alert>
        {(Object.keys(exchangeRates) as Currency[]).map((currency) => (
          <div key={currency} className="space-y-2">
            <Label htmlFor={currency} className="flex justify-between items-center">
              <span>{currency}</span>
              <span className="text-sm">
                {values[currency] ? formatCurrency(values[currency], currency) : '-'}
              </span>
            </Label>
            <Input
              id={currency}
              type="text"
              inputMode="decimal"
              placeholder={`Enter amount in ${currency}`}
              value={values[currency]}
              onChange={handleChange(currency)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
