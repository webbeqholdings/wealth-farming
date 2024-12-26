import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { withdrawInvestment } from '@/lib/contract';
import { notifyWithdrawlContracts } from '@/lib/telegram';
import { buildProfitRecordsSemester, isValidForStandardApplyCancelContract } from '@/lib/investment-products/dynamicFund';
import { format, getYear, differenceInDays, isAfter } from 'date-fns';

interface TerminationDialogProps {
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
  };
  setActiveTab: (tab: string) => void;
}

export function TerminationDialog({ isOpen, onClose, contract, setActiveTab }: TerminationDialogProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const today = new Date();

  const calculateProfit = () => {
    const startDate = new Date(contract.startDate);
    const investedAmount = contract.availableBalance;

    const build = buildProfitRecordsSemester(investedAmount, startDate, today);
    const year = getYear(today);
    const month = format(today, 'MM');

    const dateProfitFilter = build[year].filter((item: any) => {
      return format(item.date, 'MM') === month;
    });
    if (!dateProfitFilter.length) {
      return 0;
    }

    return dateProfitFilter[0]?.profit + contract.availableBalance;
  };

  const handleDialogClose = () => {
    setAmount('');
    onClose();
  };

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault();
    // const startDate = new Date(contract.startDate);
    // if (differenceInDays(today, startDate) < 90) {
    //   toast({
    //     title: 'Error',
    //     description: 'Contract termination can only occur after 90 days.',
    //     variant: 'destructive',
    //   });
    //   return;
    // }
    // setIsLoading(true);

    const totalProfit = calculateProfit();

    try {
      const formData = new FormData();
      formData.append('amount', calculateProfit());
      formData.append('contractId', contract.id);
      formData.append('userId', contract.userId);
      formData.append('totalProfit', totalProfit.toString());

      const result = await withdrawInvestment(formData);
      notifyWithdrawlContracts(result.data);
      if (result.success) {
        toast({
          title: 'Withdrawal Successfully',
          description: `Total Profit: ${totalProfit.toFixed(2)} USD`,
        });
        setActiveTab('withdraw');
        handleDialogClose();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to process withdrawal. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-300 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Terminate Contract</DialogTitle>
          <DialogDescription className="text-gray-600">
            Are you sure you want to terminate the contract for {contract.productName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4">
            <p className="text-yellow-500 text-sm">
              Warning: Terminating this contract will result in no further benefits. Proceed with caution.
            </p>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-gray-700">
                Amount
              </Label>
              <Input
                id="amount"
                value={calculateProfit().toFixed(2)}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount to withdraw"
                className="bg-white border-gray-300"
                required
                disabled
              />
              <p className="text-sm text-gray-500 pb-4">
                Balance Available: ${calculateProfit().toFixed(2)}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={handleDialogClose}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading
              }
              className="bg-red-500 text-white hover:bg-red-600"
            >
              {isLoading ? 'Processing...' : 'Confirm Termination'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>

  );
}