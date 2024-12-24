import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { withdrawInvestment } from '@/lib/contract';
import { calculateTotalProfit } from '@/lib/profitCalculator'
import { notifyWithdrawlContracts } from '@/lib/telegram';

interface WithdrawDialogProps {
  isOpen: boolean;
  onClose: () => void;
  contract: {
    id: string;
    userId: string;
    productName: string;
    availableBalance: number;
    minInvestment: number;
    startDate: string; // ISO Date string
    endDate: string; // ISO Date string
  };
  setActiveTab: (tab: string) => void;
}

export function WithdrawDialog({ isOpen, onClose, contract, setActiveTab }: WithdrawDialogProps) {
  const [amount, setAmount] = useState('');
  const [withdrawType, setWithdrawType] = useState<'part' | 'all'>('part');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleWithdrawTypeChange = (type: 'part' | 'all') => {
    setWithdrawType(type);
    if (type === 'all') {
      setAmount(calculateProfit().toString());
    } else {
      setAmount('');
    }
  };

  const calculateProfit = () => {
    const startDate = new Date(contract.startDate);
    const today = new Date();
    const investedAmount = contract.availableBalance;
  
    return calculateTotalProfit(investedAmount, startDate, today);
  };

  const handleDialogClose = () => {
    setWithdrawType('part');
    setAmount('');
    onClose();
  };

  async function handleWithdraw(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);

    const totalProfit = calculateProfit();

    try {
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('contractId', contract.id);
      formData.append('userId', contract.userId);
      formData.append('totalProfit', totalProfit.toString());

      const result = await withdrawInvestment(formData);
      notifyWithdrawlContracts(result.data)
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

  const validatePartialWithdraw = () => {
    const numericAmount = parseFloat(amount);
    return (
      numericAmount > 0 &&
      numericAmount <= calculateProfit() &&
      calculateProfit() - numericAmount >= contract.minInvestment
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-300 shadow-md">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Withdraw Funds</DialogTitle>
          <DialogDescription className="text-gray-600">
            Withdraw available funds from {contract.productName}
          </DialogDescription>
        </DialogHeader>
        <div className="flex space-x-4">
          <Button
            variant={withdrawType === 'part' ? 'default' : 'outline'}
            onClick={() => handleWithdrawTypeChange('part')}
          >
            Part
          </Button>
          <Button
            variant={withdrawType === 'all' ? 'default' : 'outline'}
            onClick={() => handleWithdrawTypeChange('all')}
          >
            All
          </Button>
        </div>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4 py-4">
            {withdrawType === 'part' && (
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
                  max={calculateProfit()}
                  required
                />
                <p className="text-sm text-gray-500">
                  Minimum balance after withdrawal: ${contract.minInvestment.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  Available balance: ${calculateProfit().toFixed(2)}
                </p>
              </div>
            )}
            {withdrawType === 'all' && (
              <div className="grid gap-2">
                <Label htmlFor="amount" className="text-gray-700">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={calculateProfit().toFixed(2)}
                  placeholder="Enter amount to withdraw"
                  className="bg-white border-gray-300"
                  min={calculateProfit()}
                  max={calculateProfit()}
                  required
                  disabled
                />
                <p className="text-sm text-gray-500">
                  Available balance: ${calculateProfit().toLocaleString()}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleDialogClose} className="border-gray-300 text-gray-700">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading || !amount || (withdrawType === 'part' && !validatePartialWithdraw())
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
