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
          label: 'Company',
          value: 'company',
        },
      ],
      defaultValue: 'individual',
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role !== 'company',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role !== 'company',
      },
    },

    {
      name: 'companyName',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role === 'company',
      },
    },
    {
      name: 'registrationNumber',
      type: 'text',
      admin: {
        condition: (data) => data.role === 'company',
      },
    },
    // Contact Information
    {
      name: 'phone',
      type: 'text',
    },
  ],
}
