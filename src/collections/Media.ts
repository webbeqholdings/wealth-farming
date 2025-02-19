import type { CollectionConfig } from 'payload';
import { isIndividualOrAdmin } from '@/access/isIndividualOrAdmin';

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
  upload: true,
}
