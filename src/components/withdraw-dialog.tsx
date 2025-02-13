import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { withdrawInvestment } from '@/lib/contract';
import { notifyWithdrawlContracts } from '@/lib/telegram';
import { getPaymentTransfer } from '@/lib/paymentTransfer'
import { endOfMonth, addMonths, endOfYear, differenceInDays } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { format } from 'date-fns';

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

export function WithdrawDialog({ isOpen, onClose, contract, setActiveTab}: WithdrawDialogProps) {
  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();
  const [withdrawAvailability, setWithdrawAvailability] = useState(false)
  const [nextWithdrawDay, setNextWithdrawDay] = useState<Date>(new Date(contract.endDate))

  useEffect(() => {
    const today = new Date();
    const initialEndDate = new Date(contract.startDate);

    if (initialEndDate.getTime() > today.getTime()){
      setNextWithdrawDay(getExpectedEndDate(contract.term, initialEndDate));
      setWithdrawAvailability(false);
      return
    }

    setNextWithdrawDay(initialEndDate);
    setNextWithdrawDay((prevWithdrawDay) => {
      let updatedWithdrawDay = prevWithdrawDay;
      while (updatedWithdrawDay.getTime() < today.getTime()) {
        updatedWithdrawDay = getExpectedEndDate(contract.term, updatedWithdrawDay);
      }
      setWithdrawAvailability(updatedWithdrawDay.toDateString() === today.toDateString() 
      && initialEndDate.toDateString() !== today.toDateString());
      return updatedWithdrawDay;
    });
  }, [contract]);

  // Calculate expected end dates for each term
  const getExpectedEndDate = (term: string, start: Date) => {
    const currentMonth = start.getMonth();
    const currentDate = start.getDate();
    switch (term) {
      case 'monthly':
        if (currentDate == 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 1, 1)
          return new Date(returnDate - 1);
        }
        if (currentDate > 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 2, 1)
          return new Date(returnDate - 1);
        }
      case 'quarterly': {
        if (currentDate == 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 3, 1)
          return new Date(returnDate - 1);
        }
        if (currentDate > 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 4, 1)
          return new Date(returnDate - 1);
        }
      }
      case 'semester': {
        if (currentDate == 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 6, 1)
          return new Date(returnDate - 1);
        }
        if (currentDate > 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 7, 1)
          return new Date(returnDate - 1);
        }
      }
      case 'annually': {
        if (currentDate == 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 12, 1)
          return new Date(returnDate - 1);
        }
        if (currentDate > 1){
          const returnDate: any = new Date(start.getFullYear(), currentMonth + 13, 1)
          return new Date(returnDate - 1);
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
        termDescription = 'first_month';
        break;
      case 'quarterly':
        termDescription = 'first_quarter';
        break;
      case 'semester':
        termDescription = 'first_semester';
        break;
      case 'annually':
        termDescription = 'first_year';
        break;
      default:
        throw new Error('Unsupported term.');
    }

    return termDescription;
  };

  const message = toastMessage(contract.term);

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
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[425px] bg-white border-gray-300 shadow-md">

      <>{!withdrawAvailability && <> 
        <DialogHeader>
          <DialogTitle className="text-gray-900">{t('withdraw_funds')}</DialogTitle>
          <DialogDescription className="text-gray-600">
            {t('withdrawal_condition')} {format(nextWithdrawDay, 'MM/dd/yyyy')}.
          </DialogDescription>
          </DialogHeader>
      </>}</>

      <>{withdrawAvailability && <>
        <DialogHeader>
          <DialogTitle className="text-gray-900">{t('withdraw_funds')}</DialogTitle>
          <DialogDescription className="text-gray-600">
          {t('withdraw_funds_available', { productName: contract.productName })}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleWithdraw}>
          <div className="grid gap-4">
            <div className="bg-yellow-100 text-yellow-800 text-sm rounded-md p-3">
              <strong>{t('note')} </strong>
              {t('withdrawal_profit_condition', { condition: t(message) })}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount" className="text-gray-700">
                {t('amount')}
              </Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t('withdrawal_amount_input')}
                className="bg-white border-gray-300"
                min={0}
                max={contract.profit}
                required
              />
              <p className="text-sm text-gray-500">
                {t('profit_amount', {amount: contract.profit.toFixed(2)})}
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
              {t('Cancel')}
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !amount ||
                parseFloat(amount) >= contract.profit
              }
              className="bg-blue-500 text-white hover:bg-blue-600"
            >
              {t(isLoading ? 'processing' : 'portfolio_tab_withdraw')}
            </Button>
          </DialogFooter>
        </form>
        </>}</>
      </DialogContent>
    </Dialog>
  );
}