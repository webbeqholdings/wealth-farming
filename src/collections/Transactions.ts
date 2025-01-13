// transactions.collection.js
import type { BasePayload, CollectionConfig } from 'payload'
import { getPayload } from 'payload'
import config from '@payload-config'
import { isAdmin } from '../access/isAdmin'
import { isIndividualOrAdmin } from '@/access/isIndividualOrAdmin'
import {
  getCurrentLevelRate,
  getParentIdByUser,
  getReferralProducts,
} from '@/lib/admin-side/referrals'
import { getTotalDeposit } from '@/lib/admin-side/transaction'
import { getAccountsByUserId } from '@/lib/admin-side/account'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    defaultColumns: ['type', 'id', 'user', 'amount', 'investment_product', 'status'],
    group: 'BeQ Dynamic Fund',
  },
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
      defaultValue: 1, // USD
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
      relationTo: 'accounts',
      label: 'From Account',
    },
    {
      name: 'to_account',
      type: 'relationship',
      relationTo: 'accounts',
      label: 'To Account',
    },
    {
      name: 'account_from', // New Field: Sử dụng field này khi dòng tiền đi ra khỏi accountID
      type: 'relationship',
      relationTo: 'accounts',
      label: 'Acc From (New)',
    },
    {
      name: 'account_to', // New Field: Sử dụng field này khi dòng tiền đi ra vào accountID
      type: 'relationship',
      relationTo: 'accounts',
      label: 'Acc To (New)',
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
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const payload = await getPayload({
          config,
        })

        const { amount, account_to, type, status } = doc

        if (operation === 'update' && type === 'deposit' && status === 'completed') {
          // ... Update Referral Process
          const parentUser = await getParentIdByUser(payload, doc.user)
          // const referralRate: any = await getCurrentLevelRate(payload, amount)
          const parentId = (parentUser as { id: number }).id

          if (parentId) {
            const accountReferral = await getAccountsByUserId(payload, doc.user, [
              'referral_reward',
            ])
            console.log('accountReferral', accountReferral)
            // Get total deposit
            const totalAmount = await getTotalDeposit(payload, doc.user)

            const referralRate = await getCurrentLevelRate(payload, totalAmount)
            const referralAmount = amount * referralRate

            const referralProducts = await getReferralProducts(payload)
            const referralProduct = referralProducts.find((prod) => {
              return prod.term == 'monthly'
            })

            if (!referralProduct) return

            await payload.create({
              collection: 'transactions',
              data: {
                amount: Number(referralAmount),
                user: Number(parentId),
                status: 'completed',
                account_to: Number(accountReferral.id),
                type: 'referral_reward',
              },
            })

            await payload.create({
              collection: 'transactions',
              data: {
                amount: Number(referralAmount),
                user: Number(parentId),
                investment_product: referralProduct.id,
                status: 'completed',
                from_account: Number(accountReferral.id),
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
