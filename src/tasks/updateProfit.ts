import type { TaskHandler } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';
import calculateProfit from '@/lib/calculateProfit';
import { endOfMonth, addMonths, differenceInDays, endOfYear, endOfQuarter } from 'date-fns';
import { withdrawInvestment } from '@/lib/contract';
import { getPaymentTransfer } from '@/lib/paymentTransfer';
import { contractEndAt } from '@/lib/investment-products/dynamicFund'

export const updateProfitHandler: TaskHandler<{
    input: {};
    output: { updatedContracts: number };
}> = async ({ input, job, req }) => {
    const payload = await getPayload({
        config,
    });

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

    function checkEndOfCurrentMonth(): boolean {
        const date = new Date()
        const year = date.getFullYear();
        const month = date.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();
        return date.getDate() === lastDay;
    }

    function getAppearingMonths(inputDate: Date | string, step: number) {
        if (step < 1 || step > 12) {
            throw new Error("Step must be between 1 and 12");
        }
        const date = typeof inputDate === "string" ? new Date(inputDate) : new Date(inputDate);
        const monthsSet = new Set<number>();
        for (let i = 0; i < 12; i++) {
            monthsSet.add((date.getMonth() + step) - 1);
            date.setMonth((date.getMonth() + step));
        }
        // return a normalize month list 0-11 
        return Array.from(monthsSet).map(month => month % 12);
    }
    function checkEndOfPeriodTerm(inputDate: Date | string, term: "monthly" | "quarterly" | "semester" | "yearly" | string): boolean {
        const date = typeof inputDate === "string" ? new Date(inputDate) : inputDate;
        const currentDate = new Date();
    
        // Xác định ngày bắt đầu hợp đồng
        const scheduleContract = date.getDate() !== 1;
        const contractStart = scheduleContract ? new Date(date.getFullYear(), date.getMonth() + 1, 1) : date;
    
        // Nếu không phải cuối tháng, trả về false ngay
        if (!checkEndOfCurrentMonth()) return false;
    
        // Kiểm tra điều kiện theo từng kỳ hạn
        if (term === "monthly") {
            return !scheduleContract || !(currentDate.getMonth() === date.getMonth() && currentDate.getFullYear() === date.getFullYear());
        }
    
        if (term === "quarterly" || term === "semester") {
            const period = term === "quarterly" ? 3 : 6;
            const withdrawableMonths = getAppearingMonths(contractStart, period);
            return withdrawableMonths.includes(currentDate.getMonth()) && (!scheduleContract || !(currentDate.getMonth() === date.getMonth() && currentDate.getFullYear() === date.getFullYear()));
        }
    
        return (contractStart.getMonth() - 1 === currentDate.getMonth()) && (currentDate.getFullYear() > contractStart.getFullYear());
    }

    // Fetch all active contracts
    const contractsResponse = await payload.find({
        collection: 'contracts',
        where: {
            status: {
                equals: 'active',
            },
        },
        limit: 1000, // Adjust the limit as per your requirements
    });

    const contracts = contractsResponse.docs;

    // Iterate through each contract to update profit and balance
    for (const contract of contracts) {
        const { product_log, amount, term, start_date, user, config_log } = contract;
        let profitToday = 0;
        let balanceToday = 0;
        // Ensure product_log is an object and has rate_of_return
        if (typeof product_log !== 'object' || product_log === null || !('data' in product_log) || typeof product_log.data !== 'object' || !('rate_of_return' in product_log.data) || typeof product_log.data.rate_of_return !== 'number' || amount === undefined) {
            console.warn(`Skipping contract ID: ${contract.id} due to missing or invalid product_log`);
            continue;
        }
        const parsedStartDate = new Date(start_date);

        if (isNaN(parsedStartDate.getTime())) {
            throw new Error('Invalid start_date provided');
        }
        profitToday = calculateProfit(term, amount, new Date(start_date), 'profit');
        balanceToday = calculateProfit(term, amount, new Date(start_date), 'balance');

        await payload.update({
            collection: 'contracts',
            id: contract.id,
            data: {
                profit: profitToday,
                balance: balanceToday,
            },
        });

        console.log(
            `Updated contract ID: ${contract.id} | Total Profit: ${profitToday.toFixed(
                2
            )}`
        );

        // Auto withdraw
        if (
            typeof config_log === 'object' && config_log !== null &&
            'extend_contract' in config_log && config_log.extend_contract == true &&
            checkEndOfPeriodTerm(start_date, term) && 'auto_profit' in config_log && Number(config_log.auto_profit) >= 0 &&
            typeof user === 'object' && user !== null
        ) {
            const paymentTransfer = await getPaymentTransfer();
            const minWithdrawal = paymentTransfer.minWithdrawal;
            const amount = config_log.auto_profit != null ? Number(config_log.auto_profit) : 0
            if (amount >= minWithdrawal) {
                const formData = {
                    amount: amount,
                    contractId: contract.id,
                    userId: user.id
                }
                const mesg = await withdrawInvestment(formData);
                console.log(
                    `Auto withdraw for: ${contract.id} | Withdraw amount: ${amount} | Message : ${mesg.message}`
                );
            }
            else {
                console.log(
                    `Auto withdraw for: ${contract.id} | Withdraw failed - amount < minWithdrawal`
                );
            }
        }
    }

    await payload.jobs.queue({
        task: 'updateProfit',
        input: {
            title: 'my title',
        },
    })

    return {
        output: {
            updatedContracts: contracts.length,
        },
    };
};