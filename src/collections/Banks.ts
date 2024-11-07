import type { CollectionConfig, CollectionAfterChangeHook } from 'payload';
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';
import { Users } from './Users';
import payload from 'payload';

export const Banks: CollectionConfig = {
  slug: 'banks',
  access: {
    update: isIndividualOrAdmin,
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
