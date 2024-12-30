'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BankAccountForm } from './bank-account-form'
import { CryptoWalletForm } from './crypto-wallet-form'

interface AccountTabsProps {
  bankAccounts: any[]
  cryptoWallets: any[]
  setBankAccounts: React.Dispatch<React.SetStateAction<any[]>>
  setCryptoWallets: React.Dispatch<React.SetStateAction<any[]>>
}

export function AccountTabs({
  bankAccounts,
  setBankAccounts,
  cryptoWallets,
  setCryptoWallets,
}: AccountTabsProps) {
  return (
    <Tabs defaultValue="bank" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="bank">Bank Account</TabsTrigger>
        <TabsTrigger value="crypto">Crypto Wallet</TabsTrigger>
      </TabsList>
      <TabsContent value="bank">
        <BankAccountForm accounts={bankAccounts} setAccounts={setBankAccounts} />
      </TabsContent>
      <TabsContent value="crypto">
        <CryptoWalletForm accounts={cryptoWallets} setAccounts={setCryptoWallets} />
      </TabsContent>
    </Tabs>
  )
}
