import { PayloadRequest } from 'payload';

const getTransaction = async (req: PayloadRequest) => {
    try {

        return new Response(
            JSON.stringify({
                data: { 'amount': "100000" },
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
    path: '/transaction/my/get-balance',
    method: 'get' as const,
    handler: getTransaction,
};
