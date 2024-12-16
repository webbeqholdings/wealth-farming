'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { useRouter } from 'next/navigation'
import { Mail } from 'lucide-react'

const Page = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const router = useRouter()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsLoading(true)
    setErrors({})
    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    try {
      const response = await fetch('/api/password/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }), // Send email in the request body
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem('user_id', data.user.id)
        router.replace('/verify-password')
      } else {
        // Handle error response
        const errorData = await response.json()
        setErrors({ form: errorData.message || 'Failed to send reset instructions' })
      }
    } catch (error) {
      console.error('An error occurred:', error)
      setErrors({ form: 'An error occurred. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <SiteHeader />
      <div className="container flex items-center justify-center min-h-screen">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Reset Password</CardTitle>
            <CardDescription>Enter your email to receive reset otp.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>
              {errors.form && <p className="text-red-500">{errors.form}</p>}
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Reset password'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
      <SiteFooter />
    </div>
  )
}

export default Page
