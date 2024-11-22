'use client'

import { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Progress } from '@/components/ui/progress'
import {
  CalendarIcon,
  CreditCard,
  DollarSign,
  LineChart,
  Lock,
  Mail,
  Phone,
  User,
  UserPlus,
  Copy,
  Share2,
  Bell,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import BankAccountsPage from '../account/bank-account/page'
import UserBankAccount from '@/components/UserBankAccount'

export default function UserProfile() {
  const [user, setUser] = useState({
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1 (555) 123-4567',
    avatar: '/placeholder.svg?height=100&width=100',
    accountNumber: '**** **** **** 1234',
    balance: 5000,
    transactions: [
      { id: 1, description: 'Deposit', amount: 1000, date: '2024-03-01' },
      { id: 2, description: 'Online Purchase', amount: -50, date: '2024-03-02' },
      { id: 3, description: 'Transfer', amount: -200, date: '2024-03-03' },
      { id: 4, description: 'Salary', amount: 3000, date: '2024-03-05' },
    ],
    referralCode: 'ALICE2024',
    referrals: [
      { name: 'Bob Smith', status: 'Signed Up' },
      { name: 'Charlie Brown', status: 'Pending' },
      { name: 'David Jones', status: 'Active' },
    ],
    referralProgress: 60,
    telegramNotifications: {
      connected: true,
      username: '@alicejohnson',
      settings: {
        transactions: true,
        balanceUpdates: false,
        securityAlerts: true,
        promotions: false,
      },
    },
  })

  const handleUpdateProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // In a real application, this would send the updated data to the server
    alert('Profile updated successfully!')
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode)
    alert('Referral code copied to clipboard!')
  }

  const shareReferralCode = () => {
    // In a real application, this would open a share dialog
    alert('Opening share dialog...')
  }

  const toggleTelegramNotification = (
    setting: keyof typeof user.telegramNotifications.settings,
  ) => {
    setUser((prevUser) => ({
      ...prevUser,
      telegramNotifications: {
        ...prevUser.telegramNotifications,
        settings: {
          ...prevUser.telegramNotifications.settings,
          [setting]: !prevUser.telegramNotifications.settings[setting],
        },
      },
    }))
  }

  const disconnectTelegram = () => {
    setUser((prevUser) => ({
      ...prevUser,
      telegramNotifications: {
        ...prevUser.telegramNotifications,
        connected: false,
        username: '',
      },
    }))
  }

  const connectTelegram = () => {
    // In a real application, this would initiate the Telegram bot connection process
    alert('Connecting to Telegram...')
    setUser((prevUser) => ({
      ...prevUser,
      telegramNotifications: {
        ...prevUser.telegramNotifications,
        connected: true,
        username: '@alicejohnson',
      },
    }))
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Profile</h1>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Manage your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>
                      {user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline">Change Avatar</Button>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </div>
                <Button type="submit">Update Profile</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>View your account details and recent transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Account Details</TabsTrigger>
                  <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span>Account Number: {user.accountNumber}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <span>Current Balance: ${user.balance.toFixed(2)}</span>
                  </div>
                </TabsContent>
                <TabsContent value="transactions">
                  <ul className="space-y-2">
                    {user.transactions.map((transaction) => (
                      <li key={transaction.id} className="flex justify-between items-center">
                        <span>{transaction.description}</span>
                        <span
                          className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}
                        >
                          ${Math.abs(transaction.amount).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Statement
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-6">
          <UserBankAccount />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>Manage your account security</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <Lock className="h-5 w-5 text-muted-foreground" />
                <span>Two-Factor Authentication</span>
              </div>
              <Button variant="outline">Enable</Button>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <LineChart className="h-5 w-5 text-muted-foreground" />
                <span>Login Activity</span>
              </div>
              <Button variant="outline">View</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Invite & Earn</CardTitle>
            <CardDescription>Invite friends and earn rewards</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="referral-code">Your Referral Code</Label>
              <div className="flex space-x-2">
                <Input id="referral-code" value={user.referralCode} readOnly />
                <Button variant="outline" size="icon" onClick={copyReferralCode}>
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy referral code</span>
                </Button>
                <Button variant="outline" size="icon" onClick={shareReferralCode}>
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share referral code</span>
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span>Referral Progress</span>
                <span>{user.referralProgress}%</span>
              </div>
              <Progress value={user.referralProgress} className="w-full" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Your Referrals</h4>
              <ul className="space-y-2">
                {user.referrals.map((referral, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{referral.name}</span>
                    <Badge variant={referral.status === 'Active' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite More Friends
            </Button>
          </CardFooter>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Telegram Notifications</CardTitle>
            <CardDescription>Manage your Telegram notification settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {user.telegramNotifications.connected ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span>Connected to Telegram</span>
                  </div>
                  <Badge>{user.telegramNotifications.username}</Badge>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="transactions">Transaction Notifications</Label>
                    <Switch
                      id="transactions"
                      checked={user.telegramNotifications.settings.transactions}
                      onCheckedChange={() => toggleTelegramNotification('transactions')}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="balanceUpdates">Balance Updates</Label>
                    <Switch
                      id="balanceUpdates"
                      checked={user.telegramNotifications.settings.balanceUpdates}
                      onCheckedChange={() => toggleTelegramNotification('balanceUpdates')}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="securityAlerts">Security Alerts</Label>
                    <Switch
                      id="securityAlerts"
                      checked={user.telegramNotifications.settings.securityAlerts}
                      onCheckedChange={() => toggleTelegramNotification('securityAlerts')}
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="promotions">Promotions and Offers</Label>
                    <Switch
                      id="promotions"
                      checked={user.telegramNotifications.settings.promotions}
                      onCheckedChange={() => toggleTelegramNotification('promotions')}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center">
                <p className="mb-4">Connect your Telegram account to receive notifications</p>
                <Button onClick={connectTelegram}>Connect Telegram</Button>
              </div>
            )}
          </CardContent>
          {user.telegramNotifications.connected && (
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={disconnectTelegram}>
                Disconnect Telegram
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
