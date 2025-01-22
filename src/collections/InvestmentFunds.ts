// investmentFunds.collection.js
import { CollectionConfig } from 'payload'

const InvestmentFunds: CollectionConfig = {
  slug: 'investment-funds',
  admin: {
    useAsTitle: 'name',
    listSearchableFields: ['name', 'category', 'fund_manager.email'],
  },
  access: {
    read: () => true, // Publicly readable
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Fund Name',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
    {
      name: 'category',
      type: 'text',
      label: 'Category',
    },
    {
      name: 'start_date',
      type: 'date',
      label: 'Start Date',
      required: true,
    },
    {
      name: 'end_date',
      type: 'date',
      label: 'End Date',
      required: true,
    },
    {
      name: 'interest_rate',
      type: 'number',
      label: 'Interest Rate (%)',
      required: true,
    },
    {
      name: 'min_investment',
      type: 'number',
      label: 'Minimum Investment',
      required: true,
    },
    {
      name: 'max_investment',
      type: 'number',
      label: 'Maximum Investment',
    },
    {
      name: 'fund_manager',
      type: 'relationship',
      relationTo: 'users',
      label: 'Fund Manager',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Closed', value: 'closed' },
      ],
      label: 'Status',
      required: true,
    },
  ],
}

export default InvestmentFunds
