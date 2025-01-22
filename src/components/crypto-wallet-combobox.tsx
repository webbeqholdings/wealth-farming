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
import { useTranslation } from 'react-i18next';
const networks = [{ value: 'trc20', label: 'TRC20 (USDT)' }] as const

export function CryptoWalletCombobox({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation();

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
            {t(value
              ? networks.find((network) => network.value === value)?.label
              : 'select_network')}
            <ChevronsUpDown className="opacity-100" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full sm:w-[300px] md:w-[400px] lg:w-[500px] xl:w-[650px] 2xl:w-[700px] p-0">
          <Command>
            <CommandInput placeholder="Search network..." className="h-9" />
            <CommandList>
              <CommandEmpty>No bank found.</CommandEmpty>
              <CommandGroup>
                {networks.map((network) => (
                  <CommandItem
                    key={network.value}
                    value={network.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? '' : currentValue)
                      setOpen(false)
                    }}
                  >
                    {network.label}
                    <Check
                      className={cn(
                        'ml-auto',
                        value === network.value ? 'opacity-100' : 'opacity-0',
                      )}
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
