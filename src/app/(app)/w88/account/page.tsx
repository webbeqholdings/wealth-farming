'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowRightIcon, PiggyBankIcon, ArrowDownIcon, ArrowUpIcon } from 'lucide-react'
import { TabMenu } from '@/components/w88/TabMenu'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function MyAccountPage() {
  const [activeTab, setActiveTab] = useState('transfer')

  const settingsTabs = [
    { label: 'Profile', value: 'profile', href: '/settings/profile' },
    { label: 'Security', value: 'security', href: '/settings/security' },
    { label: 'Notifications', value: 'notifications', href: '/settings/notifications' },
  ]

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">My Account</h1>

        <TabMenu items={settingsTabs} defaultValue="profile" />

        <div className="mt-6">
          {activeTab === 'transfer' && (
            <Card>
              <CardHeader>
                <CardTitle>Transfer Funds</CardTitle>
                <CardDescription>
                  Move funds between your accounts or to other users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Choose an option to transfer your funds:</p>
                <div className="space-y-4">
                  <Button className="w-full justify-between" variant="outline">
                    Internal Transfer
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                  <Button className="w-full justify-between" variant="outline">
                    External Transfer
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'deposit' && (
            <Card>
              <CardHeader>
                <CardTitle>Deposit Funds</CardTitle>
                <CardDescription>Add money to your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="steps">
                  <div className="step">
                    <div className="step-circle">1</div>
                    <p>Choose deposit method</p>
                  </div>
                  <div className="step">
                    <div className="step-circle">2</div>
                    <p>Enter deposit amount</p>
                  </div>
                  <div className="step">
                    <div className="step-circle">3</div>
                    <p>Confirm transaction</p>
                  </div>
                </div>
                <Button className="w-full mt-6">
                  Start Deposit Process
                  <PiggyBankIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === 'withdraw' && (
            <Card>
              <CardHeader>
                <CardTitle>Withdraw Funds</CardTitle>
                <CardDescription>Withdraw money from your account</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="steps">
                  <div className="step">
                    <div className="step-circle">1</div>
                    <p>Select withdrawal method</p>
                  </div>
                  <div className="step">
                    <div className="step-circle">2</div>
                    <p>Enter withdrawal amount</p>
                  </div>
                  <div className="step">
                    <div className="step-circle">3</div>
                    <p>Confirm withdrawal</p>
                  </div>
                </div>
                <Button className="w-full mt-6">
                  Start Withdrawal Process
                  <ArrowUpIcon className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
