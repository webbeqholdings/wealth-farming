import type { CollectionConfig } from 'payload'

const IndividualInvestors: CollectionConfig = {
  slug: 'individual-investors',
  admin: {
    useAsTitle: 'fullName',
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (data?.firstName && data?.lastName) {
              data.fullName = `${data.firstName} ${data.lastName}`
            }
            return data
          },
        ],
      },
      hidden: true,
    },
    {
      name: 'firstName',
      type: 'text',
      required: true,
    },
    {
      name: 'lastName',
      type: 'text',
      required: true,
    },
    {
      name: 'userAccount',
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
      name: 'dateOfBirth',
      type: 'date',
    },
  ],
}

export default IndividualInvestors
