import { isAdmin } from '@/access/isAdmin'
import { GlobalConfig } from 'payload'

const GcBeQDynamicFund: GlobalConfig = {
  slug: 'gc-beq-dynamic-fund',
  label: 'BeQ Dynamic Fund Config',
  access: {
    read: () => true,
  },

  fields: [
    {
      name: 'public_products',
      type: 'relationship',
      relationTo: 'investment-products',
      label: 'Public Investment Products',
      required: true,
      hasMany: true,
    },
    {
      name: 'employee_plus_products',
      type: 'relationship',
      relationTo: 'investment-products',
      label: 'Employee Plus Products',
      hasMany: true,
    },
    {
      name: 'employee_users',
      type: 'relationship',
      relationTo: 'users',
      label: 'Employee Users',
      hasMany: true,
    },
    {
      name: 'Before Standard Product',
      type: 'relationship',
      relationTo: 'investment-products',
      label: 'Before Standard Product',
    },
    {
      name: 'referral_products',
      type: 'relationship',
      relationTo: 'investment-products',
      label: 'Referral Products',
      hasMany: true,
    },
    {
      name: 'standard_days',
      type: 'number',
      label: 'Standard Days',
      defaultValue: 90,
    },
    {
      name: 'referral_config_rates',
      type: 'json',
      label: 'Referral Config Rates',
      defaultValue: [
        {
          name: 'Level 1',
          min: 0,
          max: 10000,
          rate: 0.01,
        },
        {
          name: 'Level 2',
          min: 10000,
          max: 50000,
          rate: 0.02,
        },
        {
          name: 'Level 3',
          min: 50000,
          max: 10000000000,
          rate: 0.03,
        },
      ],
    },
  ],
}

export default GcBeQDynamicFund
