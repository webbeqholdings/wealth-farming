import type { CollectionConfig } from 'payload'
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';

export const Address: CollectionConfig = {
  slug: 'address',
  fields: [
    {
      name: 'user',
      type: 'relationship', // required
      relationTo: 'users',
      required: true,
    },
    {
      name: 'street',
      type: 'text',
      required: false,
    },
    {
      name: 'city',
      type: 'text',
      required: false,
    },
    {
      name: 'state',
      type: 'text',
      required: false,
    },
    {
      name: 'zip_code',
      type: 'text',
      required: false,
    },
    {
      name: 'country',
      type: 'text',
      required: false,
    },
  ],
};
