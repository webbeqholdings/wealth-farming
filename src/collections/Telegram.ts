import type { CollectionConfig } from 'payload'

const Telegram: CollectionConfig = {
  slug: 'telegram',
  access: {
    read: () => true, // Publicly readable
    create: ({ req: { user } }) => user?.role === 'admin', // Only admins can create
    update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
    delete: ({ req: { user, query } }) => {
      if(user?.role == 'admin'){
        return true;
      }
      // Extract the ID from the query
      if (typeof query.where === 'object' && 'id' in query.where && typeof query.where.id === 'object' && 'equals' in query.where.id) {
        const id = Number(query?.where?.id?.equals);
        if (typeof user.telegram === 'object' && 'id' in user.telegram) {
          if(id !== Number(user.telegram.id)){
            return false
          }
          return true
        }
      }

      return false
    },
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
