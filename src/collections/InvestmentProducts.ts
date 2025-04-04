// investmentProducts.collection.js
import { isAdmin } from '@/access/isAdmin'
import type { CollectionConfig } from 'payload'

const InvestmentProducts: CollectionConfig = {
  slug: 'investment-products',
  access: {
    read: () => true, // Publicly readable
  },
  admin: {
    useAsTitle: 'product_name',
    listSearchableFields: ['product_name', 'rate_of_return'],
  },
  fields: [
    {
      name: 'product_name',
      type: 'text',
      label: 'Product Name',
      required: true,
      localized: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Product Description',
      localized: true,
    },
    {
      name: 'min_investment',
      type: 'number',
      label: 'Minimum Investment',
    },
    {
      name: 'term',
      type: 'select',
      label: 'Term',
      options: [
        {
          label: 'Monthly',
          value: 'monthly',
        },
        {
          label: 'Quarterly',
          value: 'quarterly',
        },
        {
          label: 'Semester',
          value: 'semester',
        },
        {
          label: 'Annually',
          value: 'annually',
        },
      ],
    },
    {
      name: 'rate_of_return',
      type: 'number',
      label: 'Rate of Return (%)',
    },
  ],
}

export default InvestmentProducts