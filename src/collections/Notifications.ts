import { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin';
const Notifications: CollectionConfig = {
  slug: 'notifications',
  access: {
    read: () => true,
    create: isAdmin,
  },
  labels: {
    singular: 'Notification',
    plural: 'Notifications',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Opportunity', value: 'opportunity' },
        { label: 'Account', value: 'account' },
        { label: 'Alert', value: 'alert' },
        { label: 'Transaction', value: 'transaction' },
        { label: 'Security', value: 'security' },
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
};

export default Notifications;
