// transactions.collection.js
import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isAdmin } from '../access/isAdmin'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users', // Tài khoản đích
      label: 'Users',
    },
    {
      name: 'investment_product',
      type: 'relationship',
      relationTo: 'investment-products', // Tài khoản đích
      label: 'Products',
    },
    {
      name: 'profit_or_loss',
      type: 'number',
      label: 'Profit/Loss Amount',
      defaultValue: 0,
      admin: {
        description: 'Enter a positive value for profit or a negative value for loss.',
      },
    },
    {
      name: 'unit',
      type: 'relationship',
      relationTo: 'units',
      label: 'Unit',
    },
    {
      name: 'bank',
      type: 'relationship',
      relationTo: 'banks', // Tài khoản đích
      label: 'Banks',
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
        { label: 'Transfer', value: 'transfer' },
        { label: 'Investment', value: 'investment' },
        { label: 'Referral Reward', value: 'referral_reward' },
      ],
      label: 'Transaction Type',
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const payload = await getPayload({
          config,
        })
        if (operation === 'update' && doc.type === 'deposit' && doc.status === 'completed') {
          const fromAccountId = doc.from_account
          const transactionAmount = doc.amount
          // Fetch the existing account details
          const fromAccount = await payload.findByID({
            collection: 'accounts',
            id: fromAccountId,
          })

          if (fromAccount) {
            // Update the account amount
            const updatedAmount = fromAccount.amount + transactionAmount

            // Save the updated account data
            await payload.update({
              collection: 'accounts',
              id: fromAccountId,
              data: {
                amount: updatedAmount,
              },
            })
          }
        }
        if (operation === 'update' && doc.type === 'withdraw' && doc.status === 'failed') {
          const fromAccountId = doc.from_account
          const transactionAmount = doc.amount
          // Fetch the existing account details
          const fromAccount = await payload.findByID({
            collection: 'accounts',
            id: fromAccountId,
          })
          if (fromAccount) {
            // Update the account amount
            const updatedAmount = fromAccount.amount - transactionAmount

            // Save the updated account data
            await payload.update({
              collection: 'accounts',
              id: fromAccountId,
              data: {
                amount: updatedAmount,
              },
            })
          }
        }
      },
    ],
  },
}

export default Transactions
