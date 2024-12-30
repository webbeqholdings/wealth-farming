'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { BirthdayInput } from '@/components/auth/BirthdayInput'
import { Mail, Lock, Eye, EyeOff, PhoneCall } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useParams } from 'next/navigation'
import { formatToISODate } from '../page'

// Define Zod schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

const registerSchema = z.object({
  first_name: z.string().min(1, 'First Name is required'),
  last_name: z.string().min(1, 'Last Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export default function Page() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [activeTab, setActiveTab] = useState('register') // State to track the active tab
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const params = useParams()
  const urlReferralCode = params['ref-code']
  // Click Submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, type: '/login' | '') => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const first_name = formData.get('first_name') as string
    const last_name = formData.get('last_name') as string
    const referral_code = formData.get('referral_code') as string
    const phone_contact = formData.get('phone_contact') as string
    const date_of_birth = formData.get('date_of_birth') as string

    // Select schema based on form type
    const schema = type === '/login' ? loginSchema : registerSchema
    const actionAuth = type === '/login' ? 'login' : 'register'

    // Parse and validate data with Zod
    const result = schema.safeParse({ email, password, first_name, last_name })
    if (!result.success) {
      const errorMessages = result.error.errors.reduce(
        (acc, error) => {
          acc[error.path[0]] = error.message
          return acc
        },
        {} as { [key: string]: string },
      )
      setErrors(errorMessages)
      setIsLoading(false)
      return
    }

    let res: any

    try {
      // NextJS Api Custom
      if (actionAuth === 'login') {
        res = await fetch(`/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password }),
        })
        const data = await res.json()
        setIsLoading(false)

        if (data.status) {
          localStorage.setItem('user_id', data.user_id)
          return router.replace('/')
        }

        return toast({
          title: 'Error',
          description: 'An error occurred. Please try again!',
        })
      }

      // NextJS Api Custom
      if (actionAuth === 'register') {
        const formattedDateOfBirth = formatToISODate(date_of_birth)
        res = await fetch(`/api/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: password,
            first_name: first_name,
            last_name: last_name,
            parent_referral_code: referral_code,
            phone_contact: phone_contact,
            date_of_birth: formattedDateOfBirth,
          }),
        })
        const data = await res.json()

        setIsLoading(false)

        if (data.status) {
          localStorage.setItem('wait_otp_confirm', 'true')
          localStorage.setItem('user_id', data.user_id)
          return router.replace('/verify-otp')
        }

        return toast({
          title: 'Error',
          description: 'An error occurred. Please try again!',
        })
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again!',
      })
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <>
      <SiteHeader />
      <div className="container flex items-center justify-center min-h-screen">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Enter your credentials to access your account.</CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleSubmit(e, '/login')}>
                <CardContent className="space-y-2">
                  <div className="space-y-1 my-1">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        className="pl-10"
                        required
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 my-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        placeholder="Enter your password"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-10 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault()
                        router.push('/reset-password')
                      }}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full rounded-lg py-3 shadow-lg"
                  >
                    {isLoading ? 'Loading...' : 'Login'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Register</CardTitle>
                <CardDescription>Create a new account to get started.</CardDescription>
              </CardHeader>
              <form onSubmit={(e) => handleSubmit(e, '')}>
                <CardContent className="space-y-2">
                  <div className="flex space-x-4">
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="first_name">First Name</Label>
                      <Input id="first_name" name="first_name" required />
                      {errors.first_name && <p className="text-red-500">{errors.first_name}</p>}
                    </div>
                    <div className="flex-1 space-y-1">
                      <Label htmlFor="last_name">Last Name</Label>
                      <Input id="last_name" name="last_name" required />
                      {errors.last_name && <p className="text-red-500">{errors.last_name}</p>}
                    </div>
                  </div>

                  <div className="space-y-1 py-1">
                    <Label htmlFor="phone_contact">Phone Number</Label>
                    <div className="relative">
                      <PhoneCall className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="phone_contact"
                        name="phone_contact"
                        placeholder="Enter your phone"
                        type="text"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 py-1">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <Input
                        id="email"
                        name="email"
                        placeholder="Enter your email"
                        type="email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1 py-1">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        name="password"
                        required
                        className="flex h-9 w-full rounded-md border border-input bg-transparent pl-10 pr-10 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <BirthdayInput name="date_of_birth" />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="email">Referral Code</Label>
                    <Input
                      id="referral_code"
                      name="referral_code"
                      type="text"
                      value={urlReferralCode}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center">
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Register'}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <SiteFooter />
    </>
  )
}
