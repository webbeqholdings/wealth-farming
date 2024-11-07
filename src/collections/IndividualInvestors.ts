import type { CollectionConfig } from 'payload'

const IndividualInvestors: CollectionConfig = {
  slug: 'individual_investors',
  admin: {
    useAsTitle: 'full_name',
  },
  fields: [
    {
      name: 'full_name',
      type: 'text',
      required: true,
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.first_name && data?.last_name) {
              data.full_name = `${data.first_name} ${data.last_name}`
            }
            return data
          },
        ],
      },
      hidden: true,
    },
    {
      name: 'first_name',
      type: 'text',
      required: true,
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
    },
    {
      name: 'user_account',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'address',
      type: 'text',
    },
    {
      name: 'date_of_birth',
      type: 'date',
    },
  ],
}

export default IndividualInvestors
