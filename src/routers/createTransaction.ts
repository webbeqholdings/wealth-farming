import { getPayload } from 'payload'
import config from '@payload-config';
import { PayloadRequest } from 'payload';

const createTransaction = async (req: PayloadRequest) => {
    try {
        const request = await req.json();
        const payload = await getPayload({
            config,
        });
        let to_account = request.to_account ?? undefined;
        let from_account = request.from_account ?? undefined;
        let bank_id = request.bank_id ?? undefined;
        let product_id = request.product_id ?? undefined;
        if (request.type === 'deposit') {
            await payload.create({
                collection: 'transactions',
                data: {
                    user: Number(request.user_id),
                    bank: bank_id ? Number(bank_id) : undefined,
                    investment_product: product_id ? Number(product_id) : undefined,
                    amount: Number(request.amount),
                    status: 'pending',
                    from_account: from_account ? Number(request.from_account) : undefined,
                    to_account: to_account ? Number(to_account) : undefined,
                    type: request.type
                },
            });
        }
        if (request.type === 'withdraw') {
            const fromAccount = await payload.findByID({
                collection: 'accounts',
                id: from_account,
            });

            if (fromAccount.amount < -Number(request.amount)) {
                const errorBody = { error: 'Amount not enough' };
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

            const updatedAmount = fromAccount.amount + Number(request.amount);
            await payload.update({
                collection: 'accounts',
                id: from_account,
                data: {
                    amount: updatedAmount
                }
            })

            await payload.create({
                collection: 'transactions',
                data: {
                    user: Number(request.user_id),
                    bank: bank_id ? Number(bank_id) : undefined,
                    investment_product: product_id ? Number(product_id) : undefined,
                    amount: Number(request.amount),
                    status: 'pending',
                    from_account: from_account ? Number(request.from_account) : undefined,
                    to_account: to_account ? Number(to_account) : undefined,
                    type: request.type
                },
            });
        }
        if (request.type === 'transfer') {
            const transactionAmount = Number(request.amount);

            const fromAccount = await payload.findByID({
                collection: 'accounts',
                id: from_account,
            });
            const toAccount = await payload.findByID({
                collection: 'accounts',
                id: to_account,
            });
            if (fromAccount.amount < transactionAmount) {
                const errorBody = { error: 'Amount not enough' };
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

            const AmountFromAccount = fromAccount.amount - transactionAmount;
            const AmountToAccount = toAccount.amount + transactionAmount;

            await payload.update({
                collection: 'accounts',
                id: from_account,
                data: {
                    amount: AmountFromAccount
                }
            })

            await payload.update({
                collection: 'accounts',
                id: request.to_account,
                data: {
                    amount: AmountToAccount
                }
            })

            await payload.create({
                collection: 'transactions',
                data: {
                    user: Number(request.user_id),
                    bank: bank_id ? Number(bank_id) : undefined,
                    investment_product: product_id ? Number(product_id) : undefined,
                    amount: Number(request.amount),
                    status: 'completed',
                    from_account: from_account ? Number(request.from_account) : undefined,
                    to_account: to_account ? Number(to_account) : undefined,
                    type: request.type
                },
            });
        }
        if (request.type === 'investment') {

            const transactionAmount = Number(request.amount);

            const investmentAccount = await payload.find({
                collection: 'accounts',
                where: {
                    user: {
                        equals: request.user_id, // Filter where OTP is null
                    },
                    account_name: {
                        equals: 'Investment Account', // Filter where OTP is null
                    },
                },
            });

            const investmentProduct = await payload.findByID({
                collection: 'investment-products',
                id: product_id,
            });
           
            if (investmentAccount.docs[0].amount < transactionAmount) {
                const errorBody = { error: 'Amount not enough investment' };
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
           
            if (transactionAmount < investmentProduct.min_investment || transactionAmount > investmentProduct.max_investment) {
                const errorBody = { error: 'Amount not allowed investment' };
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
            const AmountFromAccount = investmentAccount.docs[0].amount - transactionAmount;
            await payload.update({
                collection: 'accounts',
                id: investmentAccount.docs[0].id,
                data: {
                    amount: AmountFromAccount
                }
            })

            await payload.create({
                collection: 'transactions',
                data: {
                    user: Number(request.user_id),
                    amount: Number(request.amount),
                    investment_product: product_id ? Number(product_id) : undefined,
                    status: 'completed',
                    from_account: investmentAccount.docs[0].id,
                    type: request.type
                },
            });
        }
        
        return new Response(
            JSON.stringify({
                response: 'Transfer Fund Successfully',
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
    path: '/transaction/create',
    method: 'post' as const,
    handler: createTransaction,
};
