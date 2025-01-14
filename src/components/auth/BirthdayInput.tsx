'use client'

import React, { useState } from 'react'
import Cleave from 'cleave.js/react'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'

interface BirthdayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export function BirthdayInput({
  label = 'birth_date',
  className,
  ...props
}: BirthdayInputProps) {
  const [value, setValue] = useState('')
  const [isValid, setIsValid] = useState(true)
  const { t } = useTranslation()

  const validateDate = (dateString: string) => {
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/
    const match = dateString.match(regex)

    if (!match) return false

    const day = parseInt(match[1], 10)
    const month = parseInt(match[2], 10) - 1 // JS months are 0-indexed
    let year = parseInt(match[3], 10) //
    const currentYear = new Date().getFullYear()

    if (year > currentYear) {
      year = currentYear // Now this assignment is valid
      dateString = `${String(day).padStart(2, '0')}-${String(month + 1).padStart(2, '0')}-${year}`
      setValue(dateString) // Update the input value
    }

    const date = new Date(year, month, day)

    return (
      date.getDate() === day &&
      date.getMonth() === month &&
      date.getFullYear() === year &&
      date <= new Date() // Ensure date is not in the future
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    setIsValid(newValue.length < 10 || validateDate(newValue))
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="birthday">{t(label)}</Label>
      <Cleave
        id="birthday"
        name={props.name}
        placeholder="DD-MM-YYYY"
        options={{
          date: true,
          datePattern: ['d', 'm', 'Y'],
          delimiter: '-',
        }}
        value={value}
        onChange={handleChange}
        className={cn(
          'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
          !isValid && 'border-red-500',
          className,
        )}
        {...props}
      />
      {!isValid && (
        <p className="text-sm text-red-500">Please enter a valid date in DD-MM-YYYY format.</p>
      )}
    </div>
  )
}
