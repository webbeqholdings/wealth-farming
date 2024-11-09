import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Individual Investor',
          value: 'individual',
        },
        {
          label: 'Company Investor',
          value: 'company',
        },
      ],
      defaultValue: 'individual',
    },
    {
      name: 'first_name',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role !== 'company',
      },
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role !== 'company',
      },
    },

    {
      name: 'company_name',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role === 'company',
      },
    },
    {
      name: 'registration_number',
      type: 'text',
      admin: {
        condition: (data) => data.role === 'company',
      },
    },
    {
      name: 'phone_contact',
      type: 'text',
    },
    {
      name: 'date_of_birth',
      type: 'date',
    },
  ],
}
