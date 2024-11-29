import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin';
import { isIndividualOrAdmin } from '@/access/isIndividualOrAdmin';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: isIndividualOrAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: true,
}
