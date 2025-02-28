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
import { sendEmailDeposit } from '@/utilities/emailDeposit'
import { sendEmailWithdraw } from '@/utilities/emailWithdraw'

const Transactions: CollectionConfig = {
  slug: 'transactions',
  admin: {
    defaultColumns: ['type', 'id', 'user', 'amount', 'investment_product', 'status'],
    listSearchableFields: ['user.email', 'investment_product.product_name'],
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
      label: 'User Bank Account',
      filterOptions: ({ data }) => {
        if (data.user) {
          return {
            user: {
              equals: data.user,
            },
          }
        }
      },
    },
    {
      name: 'payment_method',
      type: 'text',
      label: 'Payment Method',
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
      name: 'account_from',
      type: 'relationship',
      relationTo: 'accounts',
      label: 'Account From (Out)',
      filterOptions: ({ data }) => {
        if (data.user) {
          return {
            user: {
              equals: data.user,
            },
          }
        }
      },
    },
    {
      name: 'account_to',
      type: 'relationship',
      relationTo: 'accounts',
      label: 'Account To (In)',
      filterOptions: ({ data }) => {
        if (data.user) {
          return {
            user: {
              equals: data.user,
            },
          }
        }
      },
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
    {
      name: 'note',
      label: 'Note',
      type: 'text',
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const payload = await getPayload({
          config,
        })

        const { amount, account_to, type, status } = doc

        const handleSendEmail = async (user: any, amount: any, status: any, type: any) => {
          try {
            if (type === 'deposit') {
              // await sendEmailDeposit(
              //   user.email,
              //   `Deposit ${status}`,
              //   user.first_name,
              //   user.last_name,
              //   amount,
              //   status,
              // )
            } else if (type === 'withdraw') {
              // await sendEmailWithdraw(
              //   user.email,
              //   `Withdrawal ${status}`,
              //   user.first_name,
              //   user.last_name,
              //   amount,
              //   status,
              // )
            }
          } catch (error) {
            console.error(`Error sending ${type} ${status} email:`, error)
          }
        }

        if (operation === 'update' && type === 'deposit' && status === 'completed') {
        }

        if (operation === 'update' && doc.type === 'withdraw' && doc.status === 'failed') {
          const fromAccountId = doc.account_from
          const transactionAmount = doc.amount
          // Fetch the existing account details
          const fromAccount = await payload.findByID({
            collection: 'accounts',
            id: fromAccountId,
          })

          if (fromAccount) {
            // handleSendEmail(fromAccount.user, transactionAmount, doc.status, type)
          }
        }
      },
    ],
  },
}

export default Transactions
