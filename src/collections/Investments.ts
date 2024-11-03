import { CollectionConfig } from 'payload'

const Investments: CollectionConfig = {
  slug: 'investments',
  admin: {
    useAsTitle: 'id',
  },
  fields: [
    {
      name: 'investor',
      type: 'relationship',
      relationTo: ['individual-investors', 'companies'],
      required: true,
    },
    {
      name: 'investmentFund',
      type: 'relationship',
      relationTo: 'investment-funds',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
      label: 'Investment Amount (VND)',
    },
    {
      name: 'investmentDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
      defaultValue: 'active',
    },
    {
      name: 'expectedReturn',
      type: 'number',
      label: 'Expected Return (VND)',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        // Calculate expected return based on interest rate and amount
        // Fetch investment fund details if necessary
      },
    ],
  },
}

export default Investments
