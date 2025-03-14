import type { CollectionConfig } from 'payload';
import { isAdmin } from '@/access/isAdmin';

const EconomicCalendar: CollectionConfig = {
  slug: 'economic-calendar',
  access: {
    read: isAdmin,
    create: isAdmin,
  },
  admin: {
    listSearchableFields:['title', 'impact'],  
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'impact',
      type: 'text',
      required: false,
    },
    {
      name: 'unit',
      type: 'relationship',
      relationTo: 'units',
      label: 'Unit',
      required: false,
    },
    {
      name: 'time',
      type: 'text',
      required: false,
    },
  ],
};

export default EconomicCalendar