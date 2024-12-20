import type { CollectionConfig } from 'payload'

const Withdrawals: CollectionConfig = {
    slug: 'withdrawals', // Collection slug
    labels: {
        singular: 'Withdrawal Contracts',
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
    ],
    timestamps: true, // Automatically adds createdAt and updatedAt fields
};

export default Withdrawals;
