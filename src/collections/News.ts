import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
    slug: 'news',
    fields: [
        {
            name: 'category',
            type: 'relationship',
            relationTo: 'news-categories',
            required: false,
          },
          {
            name: 'user',
            type: 'relationship',
            relationTo: 'users',
            required: false,
        },
        {
            name: 'title',
            type: 'text',
            required: false,
        },
        {
            name: 'content',
            type: 'text',
            required: false,
        },
        {
            name: 'published_date',
            type: 'date',
        },
    ],
}
