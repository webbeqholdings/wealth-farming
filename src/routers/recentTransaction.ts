import { getPayload } from 'payload'
import config from '@payload-config';
import { PayloadRequest } from 'payload';

const recentTransaction = async (req: PayloadRequest) => {
    try {
        const user_id = req.query.user_id;
        const payload = await getPayload({
            config,
        });
        // Fetch transactions of each type
        const types = ['deposit', 'withdraw', 'transfer', 'investment'];
        var transactions = [];
        for (let type of types) {
            const result = await payload.find({
                collection: 'transactions',
                where: {
                    user: {
                        equals: user_id, // Filter by user ID
                    },
                    type: {
                        equals: type, // Filter by the current type
                    },
                },
                sort: '-createdAt', // Sort by createdAt in descending order (most recent first)
                limit: 1, // Limit to 1 transaction per type
            });

            // If there's a result, add it to the transactions array
            if (result && result.docs.length > 0) {
                transactions.push(result.docs[0]); // Add the transaction to the list
            }
        }

        // Sort the final list of transactions by createdAt (optional, if you want them in order)
        transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Limit to 4 if you want exactly 4 transactions (though it should already be 4)
        transactions = transactions.slice(0, 4);

        return new Response(
            JSON.stringify({
                data: transactions,
                response: 'successfully',
            })
        );
    } catch (error) {
        const errorBody = { error: 'Internal server error' };
        return new Response(
            JSON.stringify({
                response: errorBody,
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
};

export default {
    path: '/recent-transaction',
    method: 'get' as const,
    handler: recentTransaction,
};
