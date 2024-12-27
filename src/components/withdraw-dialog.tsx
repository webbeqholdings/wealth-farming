import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { withdrawInvestment } from '@/lib/contract';
import { notifyWithdrawlContracts } from '@/lib/telegram';
import { format, getYear, differenceInDays, isAfter } from 'date-fns';
import {
  buildProfitRecordsAnnualy,
  buildProfitRecordsQuarterly,
  buildProfitRecordsSemester,
  buildProfitRecordsMonthly,
} from '@/lib/investment-products/dynamicFund'

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
  };
  setActiveTab: (tab: string) => void;
}

export function WithdrawDialog({ isOpen, onClose, contract, setActiveTab }: WithdrawDialogProps) {
  const [amount, setAmount] = useState('');
  const [withdrawType, setWithdrawType] = useState<'part' | 'all'>('part');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const today = new Date();

  const isWithdrawalAllowed = () => {
    const endDate = new Date(contract.endDate);
    return isAfter(today, endDate); // Check if today is after the contract end date
  };

  const calculateProfit = (term: string, today: Date) => {
    let build;
    if (term == 'Annually') {
      build = buildProfitRecordsAnnualy(contract.availableBalance, contract.startDate, today)
    }

    if (term == 'Semester') {
      build = buildProfitRecordsSemester(contract.availableBalance, contract.startDate, today)
    }

    if (term == 'Quarterly') {
      build = buildProfitRecordsQuarterly(contract.availableBalance, contract.startDate, today)
    }

    if (term == 'Monthly') {
      build = buildProfitRecordsMonthly(contract.availableBalance, contract.startDate, today)
    }
    const year = getYear(today);
    const month = format(today, 'MM');

    const dateProfitFilter = build[year].filter((item: any) => {
      return format(item.date, 'MM') === month;
    });
    if (!dateProfitFilter.length) {
      return 0;
    }
    return dateProfitFilter[0]?.profit;
  };

  const handleDialogClose = () => {
    setWithdrawType('part');
    setAmount('');
    onClose();
  };

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault();
    if (!isWithdrawalAllowed()) {
      toast({
        title: 'Error',
        description: 'Withdrawl can only occur after the contract deadline.',
        variant: 'destructive',
      });
      return;
    }

    if (contract.status === 'inactive') {
      toast({
        title: 'Invalid Contract',
        description: 'The selected contract is inactive and cannot be processed.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsLoading(true);

    const totalProfit = calculateProfit(contract.term, contract.endDate);

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('contractId', contract.id);
      formData.append('userId', contract.userId);
      formData.append('totalProfit', totalProfit.toString());

      const result = await withdrawInvestment(formData);
      notifyWithdrawlContracts(result.data);
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
          <DialogTitle className="text-gray-900">Withdraw Funds</DialogTitle>
          <DialogDescription className="text-gray-600">
            Withdraw available funds from {contract.productName}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4">
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
                max={calculateProfit(contract.term, new Date())}
                required
              />
              <p className="text-sm text-gray-500">
                Profit: ${calculateProfit(contract.term, new Date()).toFixed(2)}
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
                isLoading ||
                !amount ||
                parseFloat(amount) > calculateProfit(contract.term, new Date())
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