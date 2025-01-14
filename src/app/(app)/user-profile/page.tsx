'use client'

import { useState, useEffect, useRef } from 'react'
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
import { toast } from '@/hooks/use-toast'
import {
  CreditCard,
  DollarSign,
  LineChart,
  Lock,
  UserPlus,
  Copy,
  Share2,
  Bell,
  AlertTriangle,
} from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import UserBankAccount from '@/components/UserBankAccount'
import { useRouter } from 'next/navigation'
import UserStatus from '@/lib/userStatus'
import TelegramButton from '@/components/TelegramButton'
import Spinner from '@/components/Spinner'
import { getAccountsByUser } from '@/lib/account'

export default function UserProfile() {
  const { isLoggedIn, loading, user } = UserStatus()
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [accounts, setAccounts] = useState([]);
  const [userInfo, setUserInfo] = useState({
    firstName: '',
    lastName: '',
    avatar_id: null,
    email: '',
    phone: '+1 (555) 123-4567',
    avatar: '/placeholder.svg?height=100&width=100',
    accountNumber: '****',
    balance: 0,
  })

  const [transactions, setTransactions] = useState([
    { id: 1, type: 'Deposit', amount: 0, date: '2024-03-01' },
    { id: 2, type: 'Withdraw', amount: 0, date: '2024-03-02' },
    { id: 3, type: 'Transfer', amount: 0, date: '2024-03-03' },
    { id: 4, type: 'Investment', amount: 0, date: '2024-03-05' },
  ])

  const [referralInfo, setReferralInfo] = useState({
    referralCode: 'ALICE2024',
    referrals: [
      { name: 'Bob Smith', status: 'Signed Up' },
      { name: 'Charlie Brown', status: 'Pending' },
      { name: 'David Jones', status: 'Active' },
    ],
    referralProgress: 60,
  })

  const [telegramNotifications, setTelegramNotifications] = useState({
    id: null,
    connected: false,
    username: '@alicejohnson',
    settings: {
      transactions: true,
    },
  })

  useEffect(() => {
    // Fetch data from your API
    const fetchData = async () => {
      try {
        // Delete the cookies stel_ssid and stel_token
        const totalAmount = localStorage.getItem('total_amount')
        const accountNumber = localStorage.getItem('account_number')
        const response = await fetch(`/api/users/${user.id}`)
        const data = await response.json()

        // Update the userInfo state based on the response
        setUserInfo({
          firstName: data.first_name,
          lastName: data.last_name,
          avatar_id: data.avatar?.id || null,
          email: data.email,
          phone: data.phone_contact || '', // Set default if phone is null
          avatar: data.avatar?.url || '/placeholder.svg?height=100&width=100', // Fallback to placeholder if avatar is missing
          accountNumber: accountNumber, // You can replace this with actual data if available
          balance: Number(totalAmount), // Replace with actual balance if provided by the API
        })

        if (data.telegram) {
          setTelegramNotifications((prevUser) => ({
            ...prevUser,
            connected: true,
            id: data.telegram.id,
            username: `${data.telegram.first_name} ${data.telegram.last_name}`,
          }))
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchData()
  }, [loading])

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch(`/api/transaction/recent?user_id=${user.id}`)
      const data = await response.json()
      setTransactions(data.data)
    }

    fetchTransactions()
  }, [loading])

  const handleUpdateProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Collect form data
    const formData = new FormData(event.currentTarget)
    const firstName = formData.get('first_name') as string
    const lastName = formData.get('last_name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string

    // Create an object to send in the PATCH request
    const updatedData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      phone_contact: phone,
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      // Handle the successful response
      const updatedUser = await response.json()

      // Optionally, update your local state (e.g., userInfo) with the updated data
      setUserInfo({
        ...userInfo,
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        email: updatedUser.email,
        phone: updatedUser.phone_contact,
      })

      toast({
        title: 'Update profile successfully',
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: 'Error',
        description: `${error}`
      })
    }
  }

  const uploadAvatar = async (formData: FormData, avatarId?: string) => {
    try {
      // Define the appropriate URL for media upload and PATCH request
      const mediaUrl = avatarId ? `/api/media/${avatarId}` : '/api/media'
      const response = await fetch(mediaUrl, {
        method: avatarId ? 'PATCH' : 'POST', // Use PATCH for updating, POST for new uploads
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Avatar upload failed')
      }

      const data = await response.json()
      return data.doc // Return the updated avatar URL
    } catch (error) {
      console.error('Error uploading avatar:', error)
      throw error // Re-throw to allow further handling in the caller function
    }
  }

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0]
    if (file) {
      const formData = new FormData()
      formData.append('file', file)

      try {
        if (userInfo.avatar === '/placeholder.svg?height=100&width=100') {
          // Upload a new avatar
          const uploadedAvatar = await uploadAvatar(formData) // Upload new avatar

          // Update user info with the new avatar
          const updateUserResponse = await fetch(`/api/users/${user.id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ avatar: uploadedAvatar.id }),
          })

          if (!updateUserResponse.ok) {
            throw new Error('User update failed')
          }

          const updatedUserInfo = await updateUserResponse.json()
          setUserInfo((prev) => ({
            ...prev,
            avatar: uploadedAvatar.url,
          }))
        } else {
          // Update existing avatar
          const uploadedAvatar = await uploadAvatar(formData, userInfo.avatar_id)

          setUserInfo((prev) => ({
            ...prev,
            avatar: uploadedAvatar.url,
          }))
        }
      } catch (error) {
        console.error('Error during avatar update process:', error)
      }
    }
  }

  // Trigger file input click on button click
  const handleButtonClick = () => {
    fileInputRef.current?.click() // Programmatically click the hidden file input
  }

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referral_code)
    alert('Referral code copied to clipboard!')
  }

  const shareReferralCode = () => {
    // In a real application, this would open a share dialog
    alert('Opening share dialog...')
  }

  const toggleTelegramNotification = (setting: keyof typeof telegramNotifications.settings) => {
    setTelegramNotifications((prevUser) => ({
      ...prevUser,
      settings: {
        ...prevUser.settings,
        [setting]: !prevUser.settings[setting],
      },
    }))
  }

  // Wallet Accounts
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await getAccountsByUser(user.id)
        // Transform API response into desired format
        const transformedAccounts = response.map((account: { account_name: string, amount: number }) => ({
          name: account.account_name,
          balance: account.amount, // Assuming you want to divide the amount to convert to another unit
          currency: 'USD', // Hardcoded as 'USD', replace with dynamic value if available in the API
        }));

        setAccounts(transformedAccounts); // Store the transformed accounts in state
      } catch (error) {
        console.error('Failed to fetch accounts:', error);
      }
    };
    fetchAccounts()
  }, [loading])

  // If still loading, show a loading indicator (or spinner)
  if (loading) {
    return <Spinner/> // You can replace this with a loading spinner component if desired
  }

  // If the user is not logged in, redirect to the join page
  if (!isLoggedIn) {
    router.push('/join')
    return <Spinner/> // Optional: Show a redirect message
  }

  // Placeholder for disconnect logic (unchanged)
  const handleDisconnectTelegram = async () => {
    try {
      await fetch(`/api/telegram?where[id][equals]=${telegramNotifications.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      setTelegramNotifications({
        id: null,
        connected: false,
        username: '@alicejohnson',
        settings: {
          transactions: true,
        },
      })
    } catch (error) {
      console.error('Error during avatar update process:', error)
    }
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
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={userInfo.avatar} alt={userInfo.firstName} />
                    <AvatarFallback>{userInfo.firstName + ' ' + userInfo.lastName}</AvatarFallback>
                  </Avatar>
                  <Button variant="outline" onClick={handleButtonClick}>
                    Change Avatar
                  </Button>
                  <input
                    ref={fileInputRef} // Assign the ref to the input
                    type="file"
                    onChange={handleAvatarChange}
                    className="hidden" // Keep the file input hidden
                  />
                </div>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="flex space-x-4">
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input
                        id="first_name"
                        name="first_name"
                        value={userInfo.firstName}
                        onChange={(e) => setUserInfo({ ...userInfo, firstName: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2 flex-1">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input
                        id="last_name"
                        name="last_name"
                        value={userInfo.lastName}
                        onChange={(e) => setUserInfo({ ...userInfo, lastName: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={userInfo.email}
                      readOnly={true}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={userInfo.phone}
                      onChange={(e) => setUserInfo({ ...userInfo, phone: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="mt-5">
                    Update Profile
                  </Button>
                </form>
              </div>
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

                <TabsContent value="details">
                  {/* Wallet Accounts */}
                      {accounts.map((account) => (
                        <>
                        <div className="flex items-center space-x-4 mt-4">
                          <CreditCard className="h-5 w-5 text-muted-foreground" />
                          <span>{account.name}</span>
                        </div>
                        <div className="flex items-center space-x-4 mt-2">
                          <DollarSign className="h-5 w-5 text-muted-foreground" />
                          <span>
                            {account.balance.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                        </>
                      ))}
                </TabsContent>
                <TabsContent value="transactions">
                  <ul className="space-y-2">
                    {transactions &&
                      transactions.map((transaction) => (
                        <li key={transaction.id} className="flex justify-between items-center">
                          <span>
                            {transaction.type.charAt(0).toUpperCase() +
                              transaction.type.slice(1).toLowerCase()}
                          </span>
                          <span
                            className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}
                          >
                            {transaction.amount.toLocaleString('en-US', {
                              style: 'currency',
                              currency: 'USD',
                            })}
                          </span>
                        </li>
                      ))}
                  </ul>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => router.push('/account/history')}
                variant="outline"
                className="w-full"
              >
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
                <Input id="referral-code" value={user.referral_code} readOnly />
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
                <span>{referralInfo.referralProgress}%</span>
              </div>
              <Progress value={referralInfo.referralProgress} className="w-full" />
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Your Referrals</h4>
              <ul className="space-y-2">
                {referralInfo.referrals.map((referral, index) => (
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
            {telegramNotifications.connected ? (
              <>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <span>Connected to Telegram</span>
                  </div>
                  <Badge>{telegramNotifications.username}</Badge>
                </div>

                {/* Add the link to the Telegram bot */}
                <div className="mt-4 flex justify-between items-center">
                  <span className="text-sm text-gray-500">Chat with us on Telegram:</span>
                  <a
                    href="https://t.me/dev_wealth_farming_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 text-sm font-semibold"
                  >
                    @dev_wealth_farming_bot
                  </a>
                </div>

                <div className="space-y-4 mt-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="transactions">Transaction Notifications</Label>
                    <Switch
                      id="transactions"
                      checked={telegramNotifications.settings.transactions}
                      onCheckedChange={() => toggleTelegramNotification('transactions')}
                    />
                  </div>
                </div>
                <div className="mt-6">
                  <Button
                    variant="destructive"
                    onClick={handleDisconnectTelegram}
                    className="w-full"
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Disconnect Telegram
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center space-y-4">
                <p className="mb-4">Connect your Telegram account to receive notifications</p>
                <TelegramButton userId={user.id} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
