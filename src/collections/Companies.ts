import type { CollectionConfig } from 'payload'

const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Company Name',
    },
    {
      name: 'registrationNumber',
      type: 'text',
      label: 'Registration Number',
    },
    {
      name: 'address',
      type: 'text',
      label: 'Company Address',
    },
    {
      name: 'contactPerson',
      type: 'relationship',
      relationTo: 'users',
      label: 'Contact Person',
      required: true,
    },
  ],
}

export default Companies
