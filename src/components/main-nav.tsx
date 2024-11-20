'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export function MainNav() {
  const pathname = usePathname()

  const menuItems = [
    {
      href: '/invesment-products',
      text: 'Products',
    },
    {
      href: '/about-us',
      text: 'About Us',
    },
    {
      href: '/blog',
      text: 'Blog',
    },

    {
      href: '/events',
      text: 'Events',
    },
    {
      href: '/contact-us',
      text: 'Contact Us',
    },
  ]

  // #e9b560
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        {/* <Icons.logo className="h-6 w-6" /> */}
        <Avatar>
          <AvatarImage src="https://i.postimg.cc/xdhJbxNs/Logo-Site-WF.png" />
          {/* <AvatarImage src="https://i.postimg.cc/fLFT36Gy/logo-WF-bg-blue.png" /> */}
          <AvatarFallback>WF</AvatarFallback>
        </Avatar>
        <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
      </Link>

      {/* MAIN MENU */}
      <nav className="flex items-center gap-4 text-sm lg:gap-6" key="desktop-nav">
        {menuItems.map((item) => {
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'transition-colors hover:text-foreground/80',
                pathname === item.href ? 'text-foreground' : 'text-foreground/60',
              )}
            >
              {item.text}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
