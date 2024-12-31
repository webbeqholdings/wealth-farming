'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import bankvn from '@/config/bank-vn.json'
const banks = bankvn.data

export function BankCombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="w-100">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="flex h-9 w-full justify-between items-center rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="text-left flex-1">
              {value
                ? `${banks.find((bank) => bank.code === value)?.name} (${banks.find((bank) => bank.code === value)?.code})`
                : 'Select bank...'}
            </span>
            <ChevronsUpDown className="ml-2 opacity-100" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100%] p-0">
          <Command>
            <CommandInput placeholder="Search bank..." className="h-9" />
            <CommandList>
              <CommandEmpty>No bank found.</CommandEmpty>
              <CommandGroup>
                {banks.map((bank) => (
                  <CommandItem
                    key={bank.code}
                    value={bank.code}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    {`${bank.name} (${bank.code})`}
                    <Check
                      className={cn('ml-auto', value === bank.code ? 'opacity-100' : 'opacity-0')}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
