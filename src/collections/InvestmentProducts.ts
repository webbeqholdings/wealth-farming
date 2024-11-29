// investmentProducts.collection.js
import type { CollectionConfig } from 'payload'

const InvestmentProducts: CollectionConfig = {
  slug: 'investment-products',
  access: {
    read: () => true, // Publicly readable
  },
  admin: {
    useAsTitle: 'product_name',
  },
  fields: [
    {
      name: 'fund',
      type: 'relationship',
      relationTo: 'investment-funds',
      label: 'Associated Fund',
      required: true,
    },
    {
      name: 'product_name',
      type: 'text',
      label: 'Product Name',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product Description',
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
      name: 'interest_rate_from',
      type: 'number',
      label: 'Interest Rate From (%)',
      required: true,
    },
    {
      name: 'interest_rate_to',
      type: 'number',
      label: 'Interest Rate To (%)',
      required: true,
    },
    {
      name: 'profit_period', // Kì hạn nhận lãi (bonus)
      type: 'select',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Semi-Annually', value: 'semi_annually' },
        { label: 'Annually', value: 'annually' },
      ],
      label: 'Profit Period',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Available', value: 'available' },
        { label: 'Unavailable', value: 'unavailable' },
      ],
      label: 'Status',
      required: true,
    },
  ],
}

export default InvestmentProducts
