import type { CollectionConfig, CollectionAfterChangeHook } from 'payload'
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin'

export const CryptoWallets: CollectionConfig = {
  slug: 'crypto-wallets',
  admin: {
    useAsTitle: 'wallet_address',
    listSearchableFields: ['wallet_address', 'network', 'user.email'],
  },
  access: {
    read: isIndividualOrAdmin,
    update: ({ req: { user, query }, id }) => {
      if (user?.role == 'admin') {
        return true
      }
      // Extract the ID from the query
      if (
        typeof query.where === 'object' &&
        'user' in query.where &&
        typeof query.where.user === 'object' &&
        'equals' in query.where.user
      ) {
        const id = Number(query?.where?.user?.equals)
        if (id !== Number(user?.id)) {
          return false
        }
        return true
      }
      return false
    },
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'wallet_address',
      type: 'text',
      required: false,
    },
    {
      name: 'network',
      type: 'text',
      required: false,
    },
  ],
}
