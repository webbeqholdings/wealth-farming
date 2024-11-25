'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function MainNav() {
  const pathname = usePathname();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    const getMenuItems = async () => {
      try {
        // Fetch the data from the API
        const response = await fetch('/api/globals/header?depth=1&draft=false&locale=undefined');
        if (!response.ok) {
          throw new Error(`Failed to fetch menu items: ${response.statusText}`);
        }

        const data = await response.json();

        // Extract navigation links from the response
        const fetchedMenuItems = data.navigationLinks.map((link: {id: string, title: string, url: string}) => ({
          id: link.id,
          title: link.title,
          url: link.url,
        }));
        setMenuItems(fetchedMenuItems); // Update state with fetched menu items
      } catch (error) {
        console.error('Error fetching menu items:', error);
      }
    };

    getMenuItems(); // Call the async function inside useEffect
  }, []);

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
      <nav className="flex items-center gap-4 text-sm lg:gap-6" key="desktop-nav">
        {menuItems.map((item) => (
          <Link
            key={item.url}
            href={item.url}
            className={cn(
              'transition-colors hover:text-foreground/80',
              pathname === item.url ? 'text-foreground' : 'text-foreground/60',
            )}
          >
            {item.title} {/* Fixed here from item.text to item.title */}
          </Link>
        ))}
      </nav>
    </div>
  );
}
