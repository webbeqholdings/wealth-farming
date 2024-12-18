import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { MarketWorkingDays } from '@/components/MarketWorkingDays'
import { MarketHolidays } from '@/components/MarketHolidays'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
export default function MarketDaysPage() {
  return (
    <>
      <SiteHeader />

      <div className="container mx-auto py-10 ">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <Home className="h-4 w-4 mr-2" />
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/explore-tools">Explore Tools</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Market Trading Information</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex items-center justify-center min-h-screen">
          <div>
            <h1 className="text-3xl font-bold mb-6 text-center">Market Trading Information</h1>
            <Tabs defaultValue="working-days" className="w-[800px]">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="working-days">Market Working Days</TabsTrigger>
                <TabsTrigger value="holidays">Market Holidays</TabsTrigger>
              </TabsList>
              <TabsContent value="working-days">
                <MarketWorkingDays />
              </TabsContent>
              <TabsContent value="holidays">
                <MarketHolidays />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      <SiteFooter />
    </>
  )
}
