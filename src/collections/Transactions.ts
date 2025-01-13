// transactions.collection.js
import type { CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isAdmin } from '../access/isAdmin'
import { isIndividualOrAdmin } from '@/access/isIndividualOrAdmin'
import {
  getCurrentLevelRate,
  getParentIdByUser,
  getReferralProducts,
} from '@/lib/admin-side/referrals'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  access: {
    read: () => true,
    create: isIndividualOrAdmin,
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
      name: 'deposit_screenshot',
      type: 'upload',
      relationTo: 'media',
      label: 'Deposit Screenshot',
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
    {
      name: 'message',
      label: 'Message',
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const payload = await getPayload({
          config,
        })

        const { amount, from_account, type, status } = doc

        if (operation === 'update' && type === 'deposit' && status === 'completed') {
          // Fetch the existing account details
          const fromAccount = await payload.findByID({
            collection: 'accounts',
            id: from_account,
          })

          if (fromAccount) {
            // Update the account amount
            const updatedAmount = fromAccount.amount + amount

            // Save the updated account data
            await payload.update({
              collection: 'accounts',
              id: from_account,
              data: {
                amount: updatedAmount,
              },
            })
            // ... Update Referral Process
            const parentUser = await getParentIdByUser(payload, doc.user)
            const referralRate = await getCurrentLevelRate(payload, amount)
            const parentId = (parentUser as { id: number }).id
            const referralAmount = amount * referralRate
            const referralProducts = await getReferralProducts(payload)
            if(referralProducts){
              const referralProduct = referralProducts.filter((prod) => {
                return prod.term == 'annually'
              })[0]
              if (!referralProduct) return

              if (parentId) {
                await payload.create({
                  collection: 'transactions',
                  data: {
                    amount: Number(referralAmount),
                    user: Number(parentId),
                    investment_product: referralProduct.id,
                    status: 'completed',
                    from_account: from_account,
                    type: 'investment',
                  },
                })
                await payload.create({
                  collection: 'contracts',
                  data: {
                    user: Number(parentId),
                    amount: Number(referralAmount),
                    balance: Number(referralAmount),
                    expected_return: referralProduct.rate_of_return,
                    status: 'active',
                    term: referralProduct.term,
                    profit: 0,
                    periods: 1,
                    start_date: new Date().toISOString(),
                    end_date: null,
                    product_log: {
                      data: referralProduct,
                    },
                    note_log: ['Contract by Referral'],
                  },
                })
              }
            }
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
