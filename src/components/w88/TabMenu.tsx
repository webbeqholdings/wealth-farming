'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTranslation } from 'react-i18next';
interface TabItem {
  label: string
  value: string
  href: string
}

interface TabMenuProps {
  items: TabItem[]
  defaultValue?: string
}

export function TabMenu({ items, defaultValue }: TabMenuProps) {
  const router = useRouter()
  const { t } = useTranslation(); 
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(defaultValue || items[0].value)

  useEffect(() => {
    const currentTab = items.find((item) => item.href === pathname)
    if (currentTab) {
      setActiveTab(currentTab.value)
    }
  }, [pathname, items])

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    const selectedTab = items.find((item) => item.value === value)
    if (selectedTab) {
      router.push(selectedTab.href)
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <TabsList
        className="grid w-full"
        style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
      >
        {items.map((item) => (
          <TabsTrigger key={item.value} value={item.value}>
            {t("menu_"+item.label)}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
