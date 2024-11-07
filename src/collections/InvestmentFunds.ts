import type { CollectionConfig } from 'payload'

const InvestmentFunds: CollectionConfig = {
  slug: 'investment_funds',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: () => true, // Publicly readable
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Fund Name',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Fund Description',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Equity',
          value: 'equity',
        },
        {
          label: 'Fixed Income',
          value: 'fixed_income',
        },
        {
          label: 'Real Estate',
          value: 'real_estate',
        },
        {
          label: 'Alternative Investments',
          value: 'alternative',
        },
      ],
    },
    {
      name: 'start_date',
      type: 'date',
      required: true,
    },
    {
      name: 'end_date',
      type: 'date',
    },
    {
      name: 'interest_rate',
      type: 'number',
      required: true,
      label: 'Interest Rate (%)',
    },
    {
      name: 'min_investment',
      type: 'number',
      required: true,
      label: 'Minimum Investment Amount (VND)',
    },
    {
      name: 'max_investment',
      type: 'number',
      label: 'Maximum Investment Amount (VND)',
    },
    {
      name: 'fund_manager',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      label: 'Fund Manager',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Open',
          value: 'open',
        },
        {
          label: 'Closed',
          value: 'closed',
        },
        {
          label: 'Upcoming',
          value: 'upcoming',
        },
      ],
      defaultValue: 'open',
    },
  ],
}

export default InvestmentFunds
