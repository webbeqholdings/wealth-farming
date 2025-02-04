'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BankAccountForm } from './bank-account-form'
import { CryptoWalletForm } from './crypto-wallet-form'
import { useTranslation } from 'react-i18next'

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
  const { t } = useTranslation()
  return (
    <Tabs defaultValue="bank" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="bank">{t('bank_account')}</TabsTrigger>
        <TabsTrigger value="crypto">{t('crypto_wallet')}</TabsTrigger>
      </TabsList>
      <TabsContent value="bank">
        <BankAccountForm bankAccounts={bankAccounts} setBankAccounts={setBankAccounts} />
      </TabsContent>
      <TabsContent value="crypto">
        <CryptoWalletForm cryptoWallets={cryptoWallets} setCryptoWallets={setCryptoWallets} />
      </TabsContent>
    </Tabs>
  )
}
