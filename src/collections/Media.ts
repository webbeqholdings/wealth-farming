import type { CollectionConfig } from 'payload';
import { isIndividualOrAdmin } from '@/access/isIndividualOrAdmin';
import { isAdmin } from '@/access/isAdmin';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: isAdmin,
    create: isAdmin,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: true,
}
