// bankTransferAccounts.collection.js
import type { CollectionConfig } from 'payload'

const BankTransferAccounts: CollectionConfig = {
  slug: 'bank-transfer-accounts',
  fields: [
    {
      name: 'user_id',
      type: 'relationship',
      relationTo: 'users', // Liên kết đến collection users
      label: 'User',
      required: true,
    },
    {
      name: 'bank_code',
      type: 'text',
      label: 'Bank Code',
      required: true,
    },
    {
      name: 'bank_name',
      type: 'text',
      label: 'Bank Name',
      required: true,
    },
    {
      name: 'country_code',
      type: 'text',
      label: 'Country Code',
      defaultValue: 'VN',
      admin: {
        readOnly: true,
      },
      required: true,
    },
    {
      name: 'account_number',
      type: 'text',
      label: 'Account Number',
      required: true,
      unique: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ],
      label: 'Status',
      required: true,
    },
    {
      name: 'created_at',
      type: 'date',
      label: 'Date Added',
      admin: {
        disabled: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            data.created_at = new Date()
          },
        ],
      },
    },
    {
      name: 'updated_at',
      type: 'date',
      label: 'Last Updated',
      admin: {
        disabled: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            data.updated_at = new Date()
          },
        ],
      },
    },
  ],
}

export default BankTransferAccounts
