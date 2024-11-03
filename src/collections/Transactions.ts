import type { CollectionConfig } from 'payload'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    useAsTitle: 'transactionId',
  },
  fields: [
    {
      name: 'transactionId',
      type: 'text',
      required: true,
      unique: true,
      defaultValue: () => `TXN-${Date.now()}`,
    },
    {
      name: 'investment',
      type: 'relationship',
      relationTo: 'investments',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Transaction Amount (VND)',
    },
    {
      name: 'transactionDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'transactionType',
      type: 'select',
      options: [
        {
          label: 'Deposit',
          value: 'deposit',
        },
        {
          label: 'Withdrawal',
          value: 'withdrawal',
        },
        {
          label: 'Dividend Payment',
          value: 'dividend',
        },
      ],
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Failed',
          value: 'failed',
        },
      ],
      defaultValue: 'completed',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}

export default Transactions
