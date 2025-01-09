import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { withdrawInvestment } from '@/lib/contract';
import { notifyWithdrawlContracts } from '@/lib/telegram';
import { getPaymentTransfer } from '@/lib/paymentTransfer'
import { endOfMonth, addMonths, endOfYear, differenceInDays } from 'date-fns';

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: {
    id: string;
    userId: string;
    productName: string;
    availableBalance: number;
    minInvestment: number;
    startDate: Date; // ISO Date string
    endDate: Date; // ISO Date string
    term: string
    status: string
    profit: number
  };
  setActiveTab: (tab: string) => void;
}

export function WithdrawDialog({ isOpen, onClose, contract, setActiveTab }: WithdrawDialogProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate expected end dates for each term
  const getExpectedEndDate = (term: string, start: Date) => {
    const currentMonth = start.getMonth();
    const currentDate = start.getDate();
    switch (term) {
      case 'monthly':
        if (currentMonth == 1 && currentDate == 1) {
          return endOfMonth(start); // End of the current month
        }
        if ((currentMonth == 1 && currentDate > 1) || (currentMonth > 1 && currentMonth < 12)) {
          const nextMonthStart: any = new Date(start.getFullYear(), currentMonth + 1, 1); // First day of the month after next
          return new Date(nextMonthStart - 1); // Subtract 1 millisecond to get the last day of the next month
        }
        if (currentMonth == 12 && currentDate > 1) {
          const nextYear = start.getFullYear() + 1;
          return new Date(nextYear, 1, 31);
        }
      case 'quarterly': {
        // End of the current quarter
        if (currentMonth == 1 && currentDate == 1) {
          return new Date(start.getFullYear(), 3, 31);
        }
        if ((currentMonth == 4 && currentDate == 1) || (currentMonth == 1 && currentDate > 1) || (currentMonth >= 2 && currentMonth <= 3)) {
          return new Date(start.getFullYear(), 6, 30);
        }
        if ((currentMonth == 7 && currentDate == 1) || (currentMonth == 4 && currentDate > 1) || (currentMonth >= 5 && currentMonth <= 6)) {
          return new Date(start.getFullYear(), 9, 30);
        }
        if ((currentMonth == 10 && currentDate == 1) || (currentMonth == 7 && currentDate > 1) || (currentMonth >= 8 && currentMonth <= 9)) {
          return new Date(start.getFullYear(), 12, 31);
        }
        if ((currentMonth == 10 && currentDate > 1) || (currentMonth > 10)) {
          const nextYear = start.getFullYear() + 1;
          return new Date(nextYear, 3, 31);
        }
      }
      case 'semester': {
        // Determine the semester and return its last date
        if (currentMonth == 1 && currentDate == 1) {
          return new Date(start.getFullYear(), 6, 30);
        }
        if ((currentMonth == 7 || currentDate == 1) || (currentMonth == 1 && currentDate > 1) || (currentMonth >= 2 && currentMonth <= 6)) {
          return new Date(start.getFullYear(), 12, 31);
        }
        if ((currentMonth == 7 && currentDate > 1) || (currentMonth > 7)) {
          const nextYear = start.getFullYear() + 1;
          return new Date(nextYear, 6, 30);
        }
      }
      case 'annually': {
        // End of the year
        if (currentMonth == 1 && currentDate == 1) {
          return endOfYear(start);
        }
        if ((currentMonth == 1 && currentDate > 1) || currentMonth > 1) {
          const nextYear = start.getFullYear() + 1;
          return new Date(nextYear, 12, 31);
        }
      }
      default:
        throw new Error('Unsupported term. Valid terms: monthly, quarterly, semester, yearly.');
    }
  };

  const getBeginningOfNextMonth = (startDate: any) => {
    const start = new Date(startDate);

    // Check if the start date is the beginning of the month
    if (start.getDate() === 1) {
      // If it's already the first day, return it
      return start;
    }

    // Move to the first day of the next month
    const nextMonth = new Date(start.getFullYear(), start.getMonth() + 1, 1);

    return nextMonth;
  }

  const checkTermFullness = (startDate: any, term: any) => {
    const start = getBeginningOfNextMonth(startDate);

    // Calculate total days in the expected term
    const expectedEndDate = getExpectedEndDate(term, start);
    const totalTermDays = differenceInDays(expectedEndDate, start) + 1;
    // Calculate actual duration of the contract
    const actualDurationDays = differenceInDays(new Date(), start) + 1;
    return actualDurationDays >= totalTermDays
  };

  const toastMessage = (term: any) => {
    let termDescription;

    switch (term) {
      case 'monthly':
        termDescription = 'first month';
        break;
      case 'quarterly':
        termDescription = 'first quarter';
        break;
      case 'semester':
        termDescription = 'first semester';
        break;
      case 'annually':
        termDescription = 'first year';
        break;
      default:
        throw new Error('Unsupported term.');
    }

    return termDescription;
  };

  const handleDialogClose = () => {
    setAmount('');
    onClose();
  };

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault();
    if (!checkTermFullness(contract.startDate, contract.term)) {
      toast({
        title: 'Error',
        description: `Withdrawal can only occur after ${toastMessage(contract.term)}.`,
      });

      return;

    }
    if (contract.status === 'inactive') {
      toast({
        title: 'Error',
        description: 'The selected contract is inactive and cannot be processed.',
      });
      return;
    }
    setIsLoading(true);

    try {
      const paymentTransfer = await getPaymentTransfer();
      const minWithdrawal = paymentTransfer.minWithdrawal;

      if (parseFloat(amount) < minWithdrawal) {
        toast({
          title: 'Error',
          description: `The amount must be greater than or equal to the minimum withdrawal amount of ${minWithdrawal} USD.`,
        });
        return;
      }

      const formData = {
        amount: amount,
        contractId: contract.id,
        userId: contract.userId
      }

      const result = await withdrawInvestment(formData);
      // notifyWithdrawlContracts(result.data);
      if (result.success) {
        toast({
          title: 'Withdrawal Successfully', 
          description: `Total Profit: ${amount} USD`,
        });
        setActiveTab('withdraw');
        handleDialogClose();
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
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-300 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Withdraw Funds</DialogTitle>
          <DialogDescription className="text-gray-600">
            Withdraw available funds from {contract.productName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4">
            <div className="bg-yellow-100 text-yellow-800 text-sm rounded-md p-3">
              <strong>Note:</strong> Withdrawals profit can only be made after the {toastMessage(contract.term)}.
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-gray-700">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="bg-white border-gray-300"
                min={0}
                max={contract.profit}
                required
              />
              <p className="text-sm text-gray-500">
                Profit: ${contract.profit.toFixed(2)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={handleDialogClose}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !amount ||
                parseFloat(amount) > contract.profit
              }
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {isLoading ? 'Processing...' : 'Withdraw'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}