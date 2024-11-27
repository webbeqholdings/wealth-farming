'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

import { MainNav } from '@/components/main-nav';
import { MobileNav } from '@/components/mobile-nav';
import { ModeToggle } from '@/components/mode-toggle';
import { Button, buttonVariants } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Facebook,
  Youtube,
  Instagram,
  DollarSign,
  UserCircle,
  Settings,
  LogOut,
} from 'lucide-react';

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [balance, setBalance] = useState(10000.5);
  const router = useRouter(); // Use Next.js router for navigation

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem('user_id');
        const response = await fetch(`/api/accounts?where[user][equals]=${userId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Calculate the total amount
        const totalAmount = data.docs.reduce((sum: number, account: {amount: number} ) => sum + account.amount, 0);
        
        setBalance(totalAmount); // Update the balance state
      } catch (err) {
        console.log(err);
      }
    };

    fetchData(); // Call the fetch function
  }, []);
  // Check for user current
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const response = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        // Check if user is null
        if (data.user) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setIsLoggedIn(false); // Set logged-in state to false
        router.push('/'); // Redirect to the home page after logout
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('An error occurred during logout:', error);
    }
  };



  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-2">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex items-center space-x-2 bg-muted p-2 rounded-md">
                  <DollarSign className="h-4 w-4 text-green-500" />
                  <span className="font-medium">
                    {balance.toLocaleString('en-US', { style: 'currency', currency: 'vnd' })}
                  </span>
                </div>
                <Button
                  variant="default"
                  className="hidden md:inline-flex bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => router.push('/account/deposit')}
                >
                  Deposit
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="h-8 w-8 cursor-pointer">
                      <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                      <AvatarFallback>U</AvatarFallback>
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
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={() => router.push('/join')}>Login</Button>
            )}
            <Link href="#" target="_blank" rel="noreferrer">
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
            <Link href="#" target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'h-8 w-8 px-0',
                )}
              >
                <Youtube className="h-4 w-4" />
                <span className="sr-only">Youtube</span>
              </div>
            </Link>
            <Link href="#" target="_blank" rel="noreferrer">
              <div
                className={cn(
                  buttonVariants({
                    variant: 'ghost',
                  }),
                  'h-8 w-8 px-0',
                )}
              >
                <Instagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </div>
            </Link>
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
