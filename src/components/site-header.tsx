'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { cn } from '@/lib/utils'
import { MainNavDropdown } from '@/components/main-nav-dropdown'
import { MobileNav } from '@/components/mobile-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { Button, buttonVariants } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import userStatus from '@/lib/userStatus'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Facebook, Gift, DollarSign, UserCircle, Settings, LogOut, Wallet } from 'lucide-react'
import { getBalanceAmountByUser } from '@/lib/account'
import LanguageSwitch from './LanguageSwitcher'
import { useTranslation } from 'react-i18next';
import { me } from '@/lib/me'
export function SiteHeader() {
  const { isLoggedIn, loading, user } = userStatus()
  const [balance, setBalance] = useState(0)
  const router = useRouter() // Use Next.js router for navigation
  const { t } = useTranslation(); 
  useEffect(() => {
    const fetchData: any = async () => {
      const user = await me()
      if (!user) return
      const totalAmount: number = await getBalanceAmountByUser(user.id)
      setBalance(totalAmount)
      // @ts-nocheck
      localStorage.setItem('total_amount', String(totalAmount))
      localStorage.setItem('account_number', '%AccountNumber%')
    }

    fetchData() // Call the fetch function
  }, [loading, balance])
  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        router.push('/join') // Redirect to the home page after logout
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('An error occurred during logout:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNavDropdown />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-2 bg-muted p-2 rounded-md">
                  <Wallet className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    {balance.toLocaleString('en-US', {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,})}
                  </span>
                </div>
                <Button
                  variant="default"
                  className="inline-flex bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => router.push('/account/deposit')}
                >
                  {t('deposit')}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src={user.avatar?.url} alt="User" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={() => router.push('/user-profile')}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>{t('profile')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push('/account/referral')}>
                      <Gift className="mr-2 h-4 w-4" />
                      <span>{t('referral_reward')}</span>
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => router.push('/investment-contracts')}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      <span>{t('portfolio_title')}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('log_out')}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push('/join')}>Login</Button>
            )}
            <Link href="https://www.facebook.com/p/BeQ-Holdings-61555802044845/" target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'h-8 w-8 px-0',
                )}
              >
                <Facebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </div>
            </Link>
            <LanguageSwitch/>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
