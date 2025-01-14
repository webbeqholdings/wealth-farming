import type { CollectionConfig } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';
import { sendEmailContractWithdraw } from '@/utilities/emailContractWithdraw'

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
            async ({ data }) => {
                const payload = await getPayload({ config });

                const getAccount = async (data: any) => {
                    // Find user's investment account
                    const accountsResponse = await payload.find({
                        collection: 'accounts',
                        where: {
                            user: { equals: data.user }, // Match the user
                            type: { equals: 'investment' }, // Match the account name
                        },
                    });

                    if (accountsResponse.docs.length === 0) {
                        throw new Error('Investment account not found for the user.');
                    }

                    const account = accountsResponse.docs[0]; // Get the first matching account
                    return account
                }

                const handleSendEmail = async ( account: any, data: any ) => {
                    // Send email Withdrawal Contract: Completed or Failed
                    if (typeof account.user !== 'number') {
                        const userDetail = account.user; 
                        try {
                            await sendEmailContractWithdraw(userDetail.email, `Contract Withdrawal ${data.status} `, userDetail.first_name, userDetail.last_name, data.amount, data.status)
                        } catch (error) {
                            console.error(`Error sending Contract Withdrawal ${data.status} email:`, error)
                        }
                    } else {
                        console.error("Invalid user: Expected User, but got a number");
                    }
                }

                if (data.status === 'pending') {
                    // Set message for pending status
                    data.message = 'Withdrawal request submitted successfully. Awaiting admin approval.';
                } else if (data.status === 'completed') {
                    const account = await getAccount(data)
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

                    handleSendEmail(account, data)
                      
                } else if (data.status === 'failed') {
                    // Validate contract data
                    const contract = await payload.findByID({
                        collection: 'contracts',
                        id: data.contract, // Use the correct contract ID
                    });

                    const account = await getAccount(data)

                    if (!contract) {
                        throw new Error('Contract not found. Unable to process withdrawal.');
                    }

                    if (data.amount <= 0) {
                        throw new Error('Invalid withdrawal amount. Amount must be greater than zero.');
                    }

                    await payload.update({
                        collection: 'contracts',
                        id: data.contract,
                        data: {
                            status: 'active',
                            balance: data.amount,
                            profit: 0,
                        },
                    });

                    // Set custom message for failed status
                    data.message = `Withdrawal failed. The contract has been reactivated with a balance of ${data.amount.toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                    })}.`;

                    handleSendEmail(account, data)
                }
            },
        ],
    },
};

export default Withdrawals;
