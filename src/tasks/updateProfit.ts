import type { TaskHandler } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';
import calculateProfit from '@/lib/calculateProfit';
import { endOfMonth, addMonths, differenceInDays, endOfYear, endOfQuarter } from 'date-fns';
import { withdrawInvestment } from '@/lib/contract';
import { getPaymentTransfer } from '@/lib/paymentTransfer';
import { object } from 'zod';
import { contractMultiPeriodEndAt } from '@/lib/investment-products/dynamicFund'
import { differenceInMonths } from '@/utilities/formatDateTime'

export const updateProfitHandler: TaskHandler<{
    input: {};
    output: { updatedContracts: number };
}> = async ({ input, job, req }) => {
    const payload = await getPayload({
        config,
    });

    // // Calculate expected end dates for each term
    // const getExpectedEndDate = (term: string, start: Date) => {
    //     const currentMonth = start.getMonth();
    //     const currentDate = start.getDate();
    //     switch (term) {
    //         case 'monthly': {
    //             if (currentMonth === 1 && currentDate === 1) {
    //                 return endOfMonth(start); // End of the current month
    //             }
    //             if ((currentMonth === 1 && currentDate > 1) || (currentMonth > 1 && currentMonth < 12)) {
    //                 const nextMonthStart = new Date(Date.UTC(start.getUTCFullYear(), currentMonth, 1));
    //                 return new Date(Date.UTC(nextMonthStart.getUTCFullYear(), nextMonthStart.getUTCMonth() + 1, 0)); // Last day of the next month
    //             }
    //             if (currentMonth === 12 && currentDate > 1) {
    //                 const nextYear = start.getUTCFullYear() + 1;
    //                 return new Date(Date.UTC(nextYear, 0, 31)); // Last day of January next year
    //             }
    //             break;
    //         }
    //         case 'quarterly': {
    //             if (currentMonth === 1 && currentDate === 1) {
    //                 return new Date(Date.UTC(start.getUTCFullYear(), 2, 31)); // End of March
    //             }
    //             if ((currentMonth === 4 && currentDate === 1) || (currentMonth === 1 && currentDate > 1) || (currentMonth >= 2 && currentMonth <= 3)) {
    //                 return new Date(Date.UTC(start.getUTCFullYear(), 5, 30)); // End of June
    //             }
    //             if ((currentMonth === 7 && currentDate === 1) || (currentMonth === 4 && currentDate > 1) || (currentMonth >= 5 && currentMonth <= 6)) {
    //                 return new Date(Date.UTC(start.getUTCFullYear(), 8, 30)); // End of September
    //             }
    //             if ((currentMonth === 10 && currentDate === 1) || (currentMonth === 7 && currentDate > 1) || (currentMonth >= 8 && currentMonth <= 9)) {
    //                 return new Date(Date.UTC(start.getUTCFullYear(), 11, 31)); // End of December
    //             }
    //             if ((currentMonth === 10 && currentDate > 1) || currentMonth > 10) {
    //                 const nextYear = start.getUTCFullYear() + 1;
    //                 return new Date(Date.UTC(nextYear, 2, 31)); // End of March next year
    //             }
    //             break;
    //         }
    //         case 'semester': {
    //             if (currentMonth === 1 && currentDate === 1) {
    //                 return new Date(Date.UTC(start.getUTCFullYear(), 5, 30)); // End of June
    //             }
    //             if ((currentMonth === 7 && currentDate === 1) || (currentMonth === 1 && currentDate > 1) || (currentMonth >= 2 && currentMonth <= 6)) {
    //                 return new Date(Date.UTC(start.getUTCFullYear(), 11, 31)); // End of December
    //             }
    //             if ((currentMonth === 7 && currentDate > 1) || currentMonth > 7) {
    //                 const nextYear = start.getUTCFullYear() + 1;
    //                 return new Date(Date.UTC(nextYear, 5, 30)); // End of June next year
    //             }
    //             break;
    //         }
    //         case 'annually': {
    //             if (currentMonth === 1 && currentDate === 1) {
    //                 return endOfYear(start); // End of the current year
    //             }
    //             if ((currentMonth === 1 && currentDate > 1) || currentMonth > 1) {
    //                 const nextYear = start.getUTCFullYear() + 1;
    //                 return new Date(Date.UTC(nextYear, 11, 31)); // End of December next year
    //             }
    //             break;
    //         }
    //         default:
    //             throw new Error('Unsupported term. Valid terms: monthly, quarterly, semester, annually.');
    //     }

    // };

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
        const start = getBeginningOfNextMonth(startDate)
    
        const today = new Date(); 
    
        let termMonths = 0;
        if (term === 'monthly') termMonths = 1;
        if (term === 'quarterly') termMonths = 3;
        if (term === 'semester') termMonths = 6;
        if (term === 'annually') termMonths = 12;
    
        if (termMonths === 0) return false; 

        const monthsElapsed = differenceInMonths(today, start);
    
        // Tính số kỳ hạn đã trôi qua
        const periodsElapsed = Math.floor(monthsElapsed / termMonths);
    
        if (periodsElapsed < 1) return false; 

        const lastTermEndDate = contractMultiPeriodEndAt(start, term, periodsElapsed);
    
        // Ngày rút tiền là ngày 1 của tháng sau ngày kết thúc
        const nextWithdrawalDate = new Date(
            lastTermEndDate.getFullYear(),
            lastTermEndDate.getMonth() + 1, 
            1 
        );
        return today.getTime() === nextWithdrawalDate.getTime();
    };  

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
        const { product_log, amount, start_date, user, config_log } = contract;
        let profitToday = 0;
        let balanceToday = 0;
        // Ensure product_log is an object and has rate_of_return
        if (typeof product_log !== 'object' || product_log === null || !('data' in product_log)  || typeof product_log.data !== "object" || !('rate_of_return' in product_log.data) ||
         typeof product_log.data.rate_of_return !== 'number' || amount == null || !('term' in product_log.data) || typeof product_log.data.term !== 'string' ){
            console.warn(`Skipping contract ID: ${contract.id} due to missing or invalid product_log`);
            continue;
        }
        const parsedStartDate = new Date(start_date);

        if (isNaN(parsedStartDate.getTime())) {
            throw new Error('Invalid start_date provided');
        }
        profitToday = await calculateProfit(product_log.data.term, amount, new Date(start_date), 'profit');
        balanceToday = await calculateProfit(product_log.data.term, amount, new Date(start_date), 'balance');

        await payload.update({
            collection: 'contracts',
            id: contract.id,
            data: {
                profit: profitToday,
                balance: balanceToday,
            },
        });

        if (
            typeof config_log === 'object' && config_log !== null &&
            'extend_contract' in config_log && config_log.extend_contract == true &&
            checkTermFullness(start_date, product_log.data.term)
        ) {
            if (typeof user === 'object' && user !== null && typeof config_log === 'object' && config_log !== null && 'auto_profit' in config_log) {
                const paymentTransfer = await getPaymentTransfer();
                const minWithdrawal = paymentTransfer.minWithdrawal;
                // const amount = (config_log.auto_profit.toString()) ?? 0
                const amount = config_log.auto_profit != null ? Number(config_log.auto_profit) : 0
                if (amount >= minWithdrawal) {
                    const formData = {
                        amount: amount,
                        contractId: contract.id,
                        userId: user.id
                    }
                    await withdrawInvestment(formData);
                }
            }
        }

        console.log(
            `Updated contract ID: ${contract.id} | Total Profit: ${profitToday.toFixed(
                2
            )}`
        );
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
