import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { withdrawInvestment } from '@/lib/contract';
import { notifyWithdrawlContracts } from '@/lib/telegram';
import { standardApplyProgramDays } from '@/lib/investment-products/dynamicFund';

interface TerminationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: {
    id: string;
    userId: string;
    productName: string;
    availableBalance: number;
    investedAmount: number;
    minInvestment: number;
    startDate: Date; // ISO Date string
    endDate: Date; // ISO Date string
    term: string
    status: string
  };
  setActiveTab: (tab: string) => void;
}

export function TerminationDialog({ isOpen, onClose, contract, setActiveTab }: TerminationDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const parsedStartDate = new Date(contract.startDate);

  if (isNaN(parsedStartDate.getTime())) {
    throw new Error('Invalid start_date provided');
  }

  const daysSinceStart = Math.abs(Math.floor((new Date().getTime() - parsedStartDate.getTime()) / (1000 * 60 * 60 * 24)));

  const handleDialogClose = () => {
    onClose();
  };

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault();
    if (contract.status === 'inactive') {
      toast({
        title: 'Error',
        description: 'The selected contract is inactive and cannot be processed.',
      });
      return;
    }

    try {
      const formData = {
        amount: contract.availableBalance,
        contractId: contract.id,
        userId: contract.userId
      }

      const result = await withdrawInvestment(formData);
      if (result.success) {
        notifyWithdrawlContracts(result.data);
        toast({
          title: 'Withdrawal Successful',
          description: `Amount: $${contract.availableBalance.toFixed(2)} USD`,
        });
        setActiveTab('withdraw');
        handleDialogClose();
      } else {
        toast({
          title: 'Error',
          description: `${result.message}`,
        });
      }

    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] bg-white border border-gray-300 rounded-lg shadow-lg">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Terminate Contract
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            You are about to terminate the contract for {contract.productName}. Please review the details below before proceeding.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-6">
            {daysSinceStart < standardApplyProgramDays && (
              <div className="bg-yellow-100 text-yellow-800 text-sm rounded-md p-3">
                <strong>Note:</strong> Withdrawals made within the first 90 days will be subject to a profit rate of <strong>20% annually</strong>.
              </div>
            )}
            <div className="bg-yellow-50 text-yellow-800 text-sm rounded-md p-3">
              <strong>Warning:</strong> Terminating this contract will result in no further benefits. Proceed with caution.
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="font-medium text-gray-800">
                Withdrawal Amount
              </Label>
              <Input
                id="amount"
                value={contract.availableBalance.toFixed(2)}
                placeholder="Enter amount to withdraw"
                className="bg-gray-100 border border-gray-300 rounded-lg p-2.5"
                required
                disabled
              />
              <p className="text-sm text-gray-600 mt-1">
                Balance Available: <strong>${contract.availableBalance.toFixed(2)}</strong>
              </p>
            </div>
          </div>
          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={handleDialogClose}
              className="px-4 py-2 rounded-md text-gray-700 border-gray-300"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              {isLoading ? 'Processing...' : 'Confirm Termination'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}