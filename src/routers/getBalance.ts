import { getPayload } from 'payload'
import config from '@payload-config';
import { PayloadRequest } from 'payload';

const getBalance = async (req: PayloadRequest) => {
    try {
        const user_id = req.query.user_id;
        const payload = await getPayload({
            config,
        });
        const accounts = await payload.find({
            collection: 'accounts',
            where: {
              user: {
                equals: user_id, // Filter by user ID
              },
            },
          });
          
          // Calculate the total amount
          const totalAmount = accounts.docs.reduce((sum, account) => sum + account.amount, 0);

        return new Response(
            JSON.stringify({
                total: totalAmount,
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
    path: '/get-balance',
    method: 'get' as const,
    handler: getBalance,
};
