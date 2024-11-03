import type { CollectionConfig } from 'payload'

const InvestmentFunds: CollectionConfig = {
  slug: 'investment-funds',
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
          value: 'fixed-income',
        },
        {
          label: 'Real Estate',
          value: 'real-estate',
        },
        {
          label: 'Alternative Investments',
          value: 'alternative',
        },
      ],
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
    },
    {
      name: 'endDate',
      type: 'date',
    },
    {
      name: 'interestRate',
      type: 'number',
      required: true,
      label: 'Interest Rate (%)',
    },
    {
      name: 'minInvestment',
      type: 'number',
      required: true,
      label: 'Minimum Investment Amount (VND)',
    },
    {
      name: 'maxInvestment',
      type: 'number',
      label: 'Maximum Investment Amount (VND)',
    },
    {
      name: 'fundManager',
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
