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
import { CheckCircle2, ArrowRight, Printer, Download, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'

export default function SuccessWithdrawPage() {
  const router = useRouter()

  // In a real application, this data would come from the server or state management
  const withdrawDetails = {
    amount: 500,
    currency: 'USD',
    method: 'Bank Transfer',
    date: new Date().toLocaleString(),
    transactionId: 'WTH87654321',
    estimatedArrival: '2-3 business days',
  }

  return (
    <>
      <SiteHeader />
      <div className="container mx-auto p-4">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
              <CardTitle className="text-2xl">Withdrawal Request Confirmed</CardTitle>
            </div>
            <CardDescription>
              Your withdrawal request has been successfully submitted
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Withdrawal Details</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Amount:</div>
                <div className="font-medium">
                  {withdrawDetails.currency} {withdrawDetails.amount.toFixed(2)}
                </div>
                <div>Method:</div>
                <div className="font-medium">{withdrawDetails.method}</div>
                <div>Date Requested:</div>
                <div className="font-medium">{withdrawDetails.date}</div>
                <div>Transaction ID:</div>
                <div className="font-medium">{withdrawDetails.transactionId}</div>
                <div>Estimated Arrival:</div>
                <div className="font-medium">{withdrawDetails.estimatedArrival}</div>
              </div>
            </div>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Processing Time</AlertTitle>
              <AlertDescription>
                Your withdrawal is being processed. Please allow {withdrawDetails.estimatedArrival}{' '}
                for the funds to appear in your account.
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              The requested amount has been deducted from your account balance. You will receive an
              email notification once the withdrawal has been processed.
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
                Print Confirmation
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
