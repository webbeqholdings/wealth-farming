import type { TaskHandler } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';
import calculateProfit from '@/lib/calculateProfit';

export const updateProfitHandler: TaskHandler<{
    input: {};
    output: { updatedContracts: number };
}> = async ({ input, job, req }) => {
    const payload = await getPayload({
        config,
    });
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
        const { product_log, amount, balance, term, start_date } = contract;
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
