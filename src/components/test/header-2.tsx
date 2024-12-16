'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Coins, Menu, User, LogOut, Settings, UserCircle, DollarSign } from 'lucide-react'

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false) // This should be replaced with your actual auth logic
  const [balance, setBalance] = useState(10000.5) // This should be fetched from your backend
  const pathname = usePathname()

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Investments', href: '/investments' },
    { name: 'Markets', href: '/markets' },
    { name: 'Learn', href: '/learn' },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Coins className="h-8 w-8 text-primary" />
              <span className="ml-2 text-xl font-bold">Wealth Farming Fund</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-primary text-primary-foreground'
                    : 'text-foreground hover:bg-muted'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-2 bg-muted p-2 rounded-md">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </span>
                </div>
                <Button variant="default" className="bg-green-500 hover:bg-green-600 text-white">
                  Deposit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-10 w-10 cursor-pointer">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="John Doe" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => setIsLoggedIn(true)}>Login</Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {navItems.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </DropdownMenuItem>
                ))}
                {isLoggedIn && (
                  <>
                    <DropdownMenuItem>
                      <DollarSign className="mr-2 h-4 w-4 text-green-500" />
                      <span>
                        {balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setIsLoggedIn(false)}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
