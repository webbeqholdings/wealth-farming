'use client'

import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight, Printer, Download } from 'lucide-react'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function SuccessDepositPage() {
  const router = useRouter()

  // In a real application, this data would come from the server or state management
  const depositDetails = {
    amount: 1000,
    currency: 'USD',
    method: 'Credit Card',
    date: new Date().toLocaleString(),
    transactionId: 'DEP12345678',
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <CardTitle className="text-2xl">Deposit Successful</CardTitle>
            </div>
            <CardDescription>
              Your funds have been successfully added to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Transaction Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Amount:</div>
                <div className="font-medium">
                  {depositDetails.currency} {depositDetails.amount.toFixed(2)}
                </div>
                <div>Method:</div>
                <div className="font-medium">{depositDetails.method}</div>
                <div>Date:</div>
                <div className="font-medium">{depositDetails.date}</div>
                <div>Transaction ID:</div>
                <div className="font-medium">{depositDetails.transactionId}</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your deposit has been processed and the funds are now available in your account. It
              may take a few moments for the balance to update across all services.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-2 sm:flex-row sm:justify-between sm:space-x-2 sm:space-y-0">
            <Button onClick={() => router.push('/dashboard')} className="w-full sm:w-auto">
              Go to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <div className="flex w-full space-x-2 sm:w-auto">
              <Button variant="outline" className="flex-1 sm:flex-initial">
                <Printer className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button variant="outline" className="flex-1 sm:flex-initial">
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      <SiteFooter />
    </>
  )
}
