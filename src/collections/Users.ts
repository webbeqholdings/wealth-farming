import type { CollectionConfig } from 'payload'
import { isIndividual } from '../access/isIndividual';
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';
import { isAdmin } from '../access/isAdmin';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: isIndividualOrAdmin,
    create: () => true,
    update: isIndividualOrAdmin,
    delete: isAdmin,
  },
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
      name: 'first_name',
      type: 'text',
      required: false,
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
      name: 'phone',
      type: 'number',
      admin: {
        step: 1,
      },
    },
    {
      name: 'gender',
      type: 'select',
      admin: {
        condition: (data) => data.role !== 'company',
      },
      options: [
        {
          label: 'Male',
          value: 'male',
        },
        {
          label: 'Female',
          value: 'female',
        },
      ],
    },
    {
      name: 'birth_date',
      type: 'date',
      admin: {
        condition: (data) => data.role !== 'company',
      },
      defaultValue: () => new Date(),
    },
    {
      name: 'nationality',
      type: 'text',
    },
  ]
}
