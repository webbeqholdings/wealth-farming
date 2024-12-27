'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import * as React from 'react'
import { Icons } from '@/components/icons'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'

export function MainNavDropdown() {
  const pathname = usePathname()
  const [menuItems, setMenuItems] = useState([])
  useEffect(() => {
    const getMenuItems = async () => {
      try {
        // Fetch the data from the API
        const response = await fetch('/api/globals/main-menu')
        if (!response.ok) {
          throw new Error(`Failed to fetch menu items: ${response.statusText}`)
        }

        const data = await response.json()

        // Extract navigation links from the response
        // const fetchedMenuItems = data.navigationLinks.map(
        //   (link: { id: string; title: string; url: string }) => ({
        //     id: link.id,
        //     title: link.title,
        //     url: link.url,
        //   }),
        // )
        setMenuItems(data.menuItems) // Update state with fetched menu items
      } catch (error) {
        console.error('Error fetching menu items:', error)
      }
    }

    getMenuItems() // Call the async function inside useEffect
  }, [])

  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
        <Avatar>
          <AvatarImage src="https://i.postimg.cc/xdhJbxNs/Logo-Site-WF.png" />
          <AvatarFallback>WF</AvatarFallback>
        </Avatar>
        <span className="hidden font-bold lg:inline-block">{siteConfig.name}</span>
      </Link>

      {/* MAIN MENU */}
      <NavigationMenu>
        <NavigationMenuList>
          {menuItems.map((item) => {
            if (item.children.length) {
              return (
                <NavigationMenuItem key={item.id}>
                  <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1 lg:w-[600px] ">
                      {item.children.map((child: any) => (
                        <ListItem key={child.title} title={child.title} href={child.url}>
                          {child.description}
                        </ListItem>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              )
            }

            return (
              <NavigationMenuItem key={item.id}>
                <Link href={item.url} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            )
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}

const ListItem = React.forwardRef<React.ElementRef<'a'>, React.ComponentPropsWithoutRef<'a'>>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = 'ListItem'
