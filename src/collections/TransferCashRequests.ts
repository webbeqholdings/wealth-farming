import { CollectionConfig } from 'payload'

// HANDLE CASHFLOW REQUEST FROM INVESTOR --> TRANSACTION
export const TransferCashRequests: CollectionConfig = {
  slug: 'transfer-cash-requests',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['type', 'amount', 'status', 'account', 'created_at'],
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
        { label: 'Bonus', value: 'bonus' },
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
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
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
      name: 'payment_method',
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
      name: 'transaction_details',
      type: 'group',
      fields: [
        {
          name: 'transaction_id',
          type: 'text',
          admin: {
            description: 'External transaction reference ID',
          },
        },
        {
          name: 'payment_proof',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Upload proof of payment document',
          },
        },
        {
          name: 'processing_date',
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
      name: 'admin_notes',
      type: 'richText',
      admin: {
        description: 'Internal notes for administrators',
        position: 'sidebar',
      },
    },
    {
      name: 'extra_data',
      type: 'json',
      admin: {
        description: 'Additional data in JSON format',
      },
    },
  ],
  timestamps: true,
}

export default TransferCashRequests