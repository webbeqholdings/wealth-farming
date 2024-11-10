// transactions.collection.js
import type { CollectionConfig } from 'payload'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  fields: [
    {
      name: 'contract_id',
      type: 'relationship',
      relationTo: 'contracts', // Liên kết đến collection contracts
      label: 'Contract',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      label: 'Transaction Amount',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      label: 'Status',
      required: true,
    },
    {
      name: 'from_account',
      type: 'relationship',
      relationTo: 'accounts', // Tài khoản nguồn
      label: 'From Account',
    },
    {
      name: 'to_account',
      type: 'relationship',
      relationTo: 'accounts', // Tài khoản đích
      label: 'To Account',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Deposit', value: 'deposit' },
        { label: 'Withdraw', value: 'withdraw' },
        { label: 'Bonus', value: 'bonus' },
        { label: 'Management Fee', value: 'manage_fee' },
      ],
      label: 'Transaction Type',
      required: true,
    },
    {
      name: 'created_at',
      type: 'date',
      label: 'Transaction Date',
      admin: {
        disabled: true, // Không cho phép chỉnh sửa trong giao diện quản trị
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            data.created_at = new Date() // Thiết lập ngày hiện tại khi tạo mới
          },
        ],
      },
    },
    {
      name: 'updated_at',
      type: 'date',
      label: 'Last Updated',
      admin: {
        disabled: true, // Không cho phép chỉnh sửa trong giao diện quản trị
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            data.updated_at = new Date() // Cập nhật ngày khi có chỉnh sửa
          },
        ],
      },
    },
  ],
}

export default Transactions
