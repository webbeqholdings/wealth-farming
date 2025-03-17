// contracts.collection.js
import { isAdmin } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

const Contracts: CollectionConfig = {
  slug: 'contracts',
  admin: {
    group: 'BeQ Dynamic Fund',
    listSearchableFields: ['user.email', 'amount', 'term'],
  },
  access: {
      read: () => true,
    },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users', // Liên kết đến collection accounts
      label: 'User',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Investment Amount',
    },
    {
      name: 'profit',
      type: 'number',
      label: 'Profit',
      required: false,
      defaultValue: 0,
    },
    {
      name: 'balance',
      type: 'number',
      label: 'Available Balance',
    },
    {
      name: 'expected_return',
      type: 'number',
      label: 'Expected Return',
    },
    {
      name: 'term',
      type: 'text',
      label: 'Term',
    },
    {
      name: 'periods',
      type: 'number',
      label: 'Periods',
      required: false,
      defaultValue: null,
    },
    {
      name: 'start_date',
      type: 'date',
      label: 'Start Date',
    },
    {
      name: 'end_date',
      type: 'date',
      label: 'End Date',
      required: false,
      defaultValue: null,
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
      name: 'note_log',
      type: 'json',
      label: 'Note',
    },
    {
      name: 'product_log',
      type: 'json',
      label: 'Product Log',
    },
    {
      name: 'config_log',
      type: 'json',
      label: 'Config Log',
    },
  ],
}

export default Contracts
