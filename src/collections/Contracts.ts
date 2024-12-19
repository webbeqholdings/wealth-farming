// contracts.collection.js
import type { CollectionConfig } from 'payload'

const Contracts: CollectionConfig = {
  slug: 'contracts',
  fields: [
    {
      name: 'product_id',
      type: 'relationship',
      relationTo: 'investment-products', // Liên kết đến collection investment_products
      label: 'Investment Product',
      required: true,
    },
    {
      name: 'account_id',
      type: 'relationship',
      relationTo: 'accounts', // Liên kết đến collection accounts
      label: 'Account',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
        { label: 'Pending', value: 'pending' },
        { label: 'Closed', value: 'closed' },
      ],
      label: 'Status',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Investment Amount',
      required: true,
    },
    {
      name: 'note_log',
      type: 'number',
      label: 'Note',
      required: true,
    },
    {
      name: 'product_log',
      type: 'json',
      label: 'Product Log',
      required: false,
    },
    {
      name: 'config_log',
      type: 'json',
      label: 'Config Log',
      required: false,
    },
    {
      name: 'created_at',
      type: 'date',
      label: 'Contract Creation Date',
      admin: {
        disabled: true, // Disable editing in the admin UI
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            data.created_at = new Date() // Set to current date
          },
        ],
      },
    },
    {
      name: 'updated_at',
      type: 'date',
      label: 'Last Updated',
      admin: {
        disabled: true, // Disable editing in the admin UI
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            data.updated_at = new Date() // Set to current date
          },
        ],
      },
    },
  ],
}

export default Contracts
