import type { CollectionConfig } from 'payload'

const Reports: CollectionConfig = {
  slug: 'reports',
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'reportDate',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    {
      name: 'investmentFund',
      type: 'relationship',
      relationTo: 'investment-funds',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'attachments',
      type: 'upload',
      relationTo: 'media', // Assuming you have a media collection
    },
  ],
}

export default Reports
