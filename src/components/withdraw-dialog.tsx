'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { withdrawInvestment } from './withdrawInvestment'
import { useToast } from '@/hooks/use-toast'

interface WithdrawDialogProps {
  isOpen: boolean
  onClose: () => void
  contract: {
    id: string
    productName: string
    availableBalance: number
  }
}

export function WithdrawDialog({ isOpen, onClose, contract }: WithdrawDialogProps) {
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault()
    setIsLoading(true)

    const formData = new FormData()
    formData.append('amount', amount)
    formData.append('contractId', contract.id)

    try {
      const result = await withdrawInvestment(formData)
      if (result.success) {
        toast({
          title: "Withdrawal Initiated",
          description: result.message,
        })
        onClose()
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process withdrawal. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-300 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Withdraw Funds</DialogTitle>
          <DialogDescription className="text-gray-600">
            Withdraw available funds from {contract.productName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-gray-700">Amount</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="bg-white border-gray-300"
                max={contract.availableBalance}
                required
              />
              <p className="text-sm text-gray-500">
                Available balance: ${contract.availableBalance.toLocaleString()}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={onClose} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !amount}
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {isLoading ? "Processing..." : "Withdraw"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
