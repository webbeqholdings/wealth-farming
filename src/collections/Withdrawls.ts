import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config';

const Withdrawals: CollectionConfig = {
    slug: 'withdrawals', // Collection slug
    labels: {
        singular: 'Withdrawal Contract',
        plural: 'Withdrawal Contracts',
    },
    fields: [
        {
            name: 'contract',
            type: 'relationship',
            relationTo: 'contracts',
        },
        {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
        },
        {
            name: 'amount',
            label: 'Amount',
            type: 'number',
            required: true,
        },
        {
            name: 'status',
            label: 'Status',
            type: 'select',
            options: [
                {
                    label: 'Completed',
                    value: 'completed',
                },
                {
                    label: 'Pending',
                    value: 'pending',
                },
                {
                    label: 'Failed',
                    value: 'failed',
                },
            ],
            required: true,
        },
        {
            name: 'message',
            label: 'Message',
            type: 'text',
        },
    ],
    timestamps: true, // Automatically adds createdAt and updatedAt fields
    hooks: {
        beforeChange: [
            async ({ data}) => {
                const payload = await getPayload({ config });
                if (data.status === 'pending') {
                    // Set message for pending status
                    data.message = 'Withdrawal request submitted successfully. Awaiting admin approval.';
                } else if (data.status === 'completed') {
                    // Validate contract data
                    const contract = await payload.findByID({
                        collection: 'contracts',
                        id: data.contract, // Use the correct contract ID
                    });

                    if (!contract) {
                        throw new Error('Contract not found. Unable to process withdrawal.');
                    }

                    if (data.amount <= 0) {
                        throw new Error('Invalid withdrawal amount. Amount must be greater than zero.');
                    }

                    // Update contract based on withdrawal amount
                    if (data.amount < contract.balance && data.amount <= contract.profit) {
                        await payload.update({
                            collection: 'contracts',
                            id: data.contract,
                            data: {
                                profit: contract.profit - data.amount,
                                balance: contract.balance - data.amount
                            },
                        });
                    } else if (data.amount <= contract.balance) {
                        await payload.update({
                            collection: 'contracts',
                            id: data.contract,
                            data: {
                                status: 'inactive',
                                balance: 0,
                                profit: 0,
                            },
                        });
                    } else {
                        throw new Error('Invalid withdrawal amount. Amount exceeds available balance or profit.');
                    }

                    // Find user's investment account
                    const accountsResponse = await payload.find({
                        collection: 'accounts',
                        where: {
                            user: { equals: data.user }, // Match the user
                            account_name: { equals: 'Investment Account' }, // Match the account name
                        },
                    });

                    if (accountsResponse.docs.length === 0) {
                        throw new Error('Investment account not found for the user.');
                    }

                    const account = accountsResponse.docs[0]; // Get the first matching account

                    // Update user's account balance
                    await payload.update({
                        collection: 'accounts',
                        id: account.id,
                        data: {
                            amount: account.amount + data.amount,
                        },
                    });

                    // Set message for completed status
                    data.message = 'Withdrawal completed successfully.';
                }
            },
        ],
    },
};

export default Withdrawals;
