import type { CollectionConfig, CollectionAfterChangeHook } from 'payload';
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';

export const Banks: CollectionConfig = {
  slug: 'banks',
  admin: {
    useAsTitle: 'bank_name',
  },
  access: {
    read: isIndividualOrAdmin,
    update: ({ req: { user }, id }) => {
      // Allow if user is admin or updating their own record
      return user?.role === 'admin' || user?.id === id;
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
