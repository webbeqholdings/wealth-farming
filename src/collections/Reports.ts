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
      name: 'report_date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
    },
    // {
    //   name: 'investment_fund',
    //   type: 'relationship',
    //   relationTo: 'investment_funds',
    //   required: true,
    // },
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
