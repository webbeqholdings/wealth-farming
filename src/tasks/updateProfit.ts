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

    const checkTermFullness = (startDate: any, term: any) => {
        const start = getBeginningOfNextMonth(startDate);
        const today = new Date();
        if (today < start) {
            return false;
        }
        // Calculate total days in the expected term
        const expectedEndDate = contractEndAt(start, term);
        const totalTermDays = differenceInDays(expectedEndDate, start) + 1;
        // Calculate actual duration of the contract
        const actualDurationDays = differenceInDays(today, start) + 1;
        return (actualDurationDays >= totalTermDays) && (today.getDate() == 1)
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
            checkTermFullness(start_date, term) && 'auto_profit' in config_log && Number(config_log.auto_profit) >= 0 &&
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
            else{
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