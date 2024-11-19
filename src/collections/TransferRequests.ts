import type { CollectionConfig } from 'payload'

export const TransferCashRequests: CollectionConfig = {
  slug: 'transfer-cash-requests',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['type', 'amount', 'status', 'account', 'createdAt'],
    group: 'Finance',
  },
  versions: {
    drafts: true,
  },
  access: {
    create: async ({ req }) => true, // Customize based on your needs
    read: async ({ req }) => true,
    update: async ({ req }) => true,
    delete: async ({ req }) => true,
  },
  hooks: {
    beforeChange: [
      async ({ req, data }) => {
        // Add any validation or data transformation logic here
        return data
      },
    ],
    afterChange: [
      async ({ req, doc }) => {
        // Handle post-change operations (e.g., notifications)
        return doc
      },
    ],
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Deposit', value: 'deposit' },
        { label: 'Withdrawal', value: 'withdrawal' },
      ],
      admin: {
        description: 'Select the type of transfer request',
      },
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Enter the transfer amount',
        step: 0.01,
      },
    },
    {
      name: 'currency',
      type: 'select',
      required: true,
      defaultValue: 'usd',
      options: [
        { label: 'USD', value: 'usd' },
        { label: 'VND', value: 'vnd' },
      ],
      admin: {
        description: 'Select the currency for this transfer',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' }, // Admin do it
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' }, // User do it
      ],
      admin: {
        description: 'Current status of the transfer request',
        position: 'sidebar',
      },
    },
    {
      name: 'account',
      type: 'relationship',
      relationTo: 'accounts',
      required: true,
      admin: {
        description: 'Select the account for this transfer request',
      },
    },
    {
      name: 'accountNumber',
      type: 'text',
      required: true,
      admin: {
        description: 'Enter the account number',
      },
    },
    {
      name: 'paymentMethod',
      type: 'select',
      required: true,
      options: [
        { label: 'Bank Transfer', value: 'bank_transfer' },
        { label: 'Credit Card', value: 'credit_card' },
        { label: 'PayPal', value: 'paypal' },
        { label: 'Crypto', value: 'crypto' },
      ],
      admin: {
        description: 'Select the payment method',
      },
    },
    {
      name: 'transactionDetails',
      type: 'group',
      fields: [
        {
          name: 'transactionId',
          type: 'text',
          admin: {
            description: 'External transaction reference ID',
          },
        },
        {
          name: 'paymentProof',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload proof of payment document',
          },
        },
        {
          name: 'processingDate',
          type: 'date',
          admin: {
            description: 'Date when the transaction was processed',
            position: 'sidebar',
          },
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
      admin: {
        description: 'Additional notes or comments',
        position: 'sidebar',
      },
    },
    {
      name: 'adminNotes',
      type: 'richText',
      admin: {
        description: 'Internal notes for administrators',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}

export default TransferCashRequests
