import type { TaskHandler } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';
import calculateProfit from '@/lib/calculateProfit';
import { endOfMonth, addMonths, differenceInDays, endOfYear, endOfQuarter } from 'date-fns';
import { withdrawInvestment } from '@/lib/contract';

export const updateProfitHandler: TaskHandler<{
    input: {};
    output: { updatedContracts: number };
}> = async ({ input, job, req }) => {
    const payload = await getPayload({
        config,
    });

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
                if(currentMonth == 12 && currentDate > 1){
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
                    return new Date(start.getFullYear(), 5, 30);
                }
                if ((currentMonth == 7 || currentDate == 1) || (currentMonth == 1 && currentDate > 1) || (currentMonth >= 2 && currentMonth <= 6)) {
                    return new Date(start.getFullYear(), 11, 31);
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
        const today = new Date();
        // Calculate total days in the expected term
        const expectedEndDate = getExpectedEndDate(term, start);
        const totalTermDays = differenceInDays(expectedEndDate, start) + 1;
        // Calculate actual duration of the contract
        const actualDurationDays = differenceInDays(today, start) + 1;
        return actualDurationDays >= totalTermDays
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
        const { product_log, amount, term, start_date, profit, extend_contract } = contract;
        let profitToday = 0;
        let balanceToday = 0;
        // Ensure product_log is an object and has rate_of_return
        if (typeof product_log !== 'object' || product_log === null || !('rate_of_return' in product_log) || typeof product_log.rate_of_return !== 'number' || amount === undefined) {
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

        if (extend_contract == 1 && checkTermFullness(start_date, term)) {
            const formData = {
                amount: profit,
                contractId: contract.id,
                userId: contract.user
            }
            await withdrawInvestment(formData);
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
