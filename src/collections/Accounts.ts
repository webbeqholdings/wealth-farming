import type { CollectionConfig } from 'payload'

const Accounts: CollectionConfig = {
  slug: 'accounts',
  admin: {
    useAsTitle: 'account_number',
    listSearchableFields: ['account_name', 'account_number', 'amount', , 'user.email'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users', // Quan hệ với collection Users
      required: true,
    },
    {
      name: 'account_name', // Nick name Account
      type: 'text',
      label: 'Nick Name',
      required: true,
    },
    {
      name: 'account_number',
      type: 'number',
      label: 'Account Number',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Amount',
      defaultValue: 0,
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Investment', value: 'investment' },
        { label: 'Main', value: 'main' },
        { label: 'Referral Reward', value: 'referral_reward' },
      ],
      label: 'Type',
      defaultValue: 'investment',
    },
  ],
}
export default Accounts
