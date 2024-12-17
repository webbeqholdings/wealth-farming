import type { CollectionConfig } from 'payload'

const Telegram: CollectionConfig = {
  slug: 'telegram',
  access: {
    read: () => true, // Publicly readable
    create: ({ req: { user } }) => user?.role === 'admin', // Only admins can create
    update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
    delete: ({ req: { user }, id }) => user?.role === 'admin' || user?.id === id, // Only admins or user can delete
  },
  fields: [
    {
      name: 'chat_id',
      type: 'number',
      label: 'Chat Id',
    },
    {
      name: 'first_name',
      type: 'text',
      label: 'First Name',
    },
    {
      name: 'last_name',
      type: 'text',
      label: 'Last Name',
    },
    {
      name: 'auth_date',
      type: 'text',
      label: 'Auth Date',
    },
    {
      name: 'hash',
      type: 'text',
      label: 'Hash',
    },
  ],
  admin: {
    useAsTitle: 'last_name',
  },
}

export default Telegram
