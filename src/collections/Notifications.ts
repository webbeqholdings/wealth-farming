import { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin';
import { sendEventNotification, sendOtherNotification } from '@/lib/users';
const Notifications: CollectionConfig = {
  slug: 'notifications',
  access: {
    read: () => true,
    create: isAdmin,
  },
  admin: {
    listSearchableFields: ['title', 'context'],
  },
  labels: {
    singular: 'Notification',
    plural: 'Notifications',
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'date',
      type: 'date',
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
        { label: 'Event', value: 'event'}
      ],
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data }) => {
        if (data.user && data.type != 'event') {
        sendOtherNotification(
              data.user, 
              data.title, 
              data.content.root.children,
              data.description,
              data.type,
          );
        }
        if(data.type == 'event'){
          sendEventNotification(data.title, data.content.root.children, data.description, data.date)
        }
      }
    ]
  },
};

export default Notifications;
