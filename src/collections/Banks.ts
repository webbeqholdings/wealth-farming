import type { CollectionConfig, CollectionAfterChangeHook } from 'payload';
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';

export const Banks: CollectionConfig = {
  slug: 'banks',
  admin: {
    useAsTitle: 'bank_name',
    listSearchableFields: ['name', 'account_number', 'bank_name', 'branch', 'user.email'],
  },
  access: {
    read: isIndividualOrAdmin,
    update: ({ req: { user, query }, id }) => {
      if (user?.role == 'admin') {
        return true;
      }
      // Extract the ID from the query
      if (typeof query.where === 'object' && 'user' in query.where && typeof query.where.user === 'object' && 'equals' in query.where.user) {
        const id = Number(query?.where?.user?.equals);
        if (id !== Number(user?.id)) {
          return false
        }
        return true
      }
      return false
    }
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: false,
    },
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'account_number',
      type: 'text',
      required: false,
    },
    {
      name: 'bank_name',
      type: 'text',
      required: false,
    },
    {
      name: 'branch',
      type: 'text',
      required: false,
    },
  ],
};
