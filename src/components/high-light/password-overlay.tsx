'use client'

import type React from 'react'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Lock, LogOut } from 'lucide-react'

const CORRECT_PASSWORD = 'wf6868'
const AUTH_KEY = 'dashboard_auth'

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated in localStorage
    const authStatus = localStorage.getItem(AUTH_KEY)
    setIsAuthenticated(authStatus === 'true')
    setIsLoading(false)
  }, [])

  const login = (password: string) => {
    const isValid = password === CORRECT_PASSWORD
    if (isValid) {
      localStorage.setItem(AUTH_KEY, 'true')
      setIsAuthenticated(true)
    }
    return isValid
  }

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, isLoading, login, logout }
}

export function LogoutButton() {
  const { logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/dashboard')
  }

  return (
    <Button variant="outline" size="sm" onClick={handleLogout}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  )
}

export default function PasswordOverlay({ children }: { children: React.ReactNode }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { isAuthenticated, isLoading, login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = login(password)
    if (!isValid) {
      setError('Incorrect password. Please try again.')
      setPassword('')
    }
  }

  if (isLoading) {
    return <SkeletonDashboard />
  }

  if (isAuthenticated) {
    return <>{children}</>
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Enter Password</CardTitle>
          <CardDescription className="text-center">
            Wealth Farming High Light Overview
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                autoComplete="off"
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Unlock Dashboard
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

function SkeletonDashboard() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex-1 p-6 md:p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 w-40 bg-muted rounded-md animate-pulse" />
          <div className="h-8 w-24 bg-muted rounded-md animate-pulse" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
          {Array(4)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
            ))}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="h-8 w-64 bg-muted rounded-md animate-pulse" />
            <div className="h-8 w-48 bg-muted rounded-md animate-pulse" />
          </div>
          <div className="h-[500px] bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  )
}
