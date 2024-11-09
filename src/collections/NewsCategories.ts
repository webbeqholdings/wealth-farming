import type { CollectionConfig } from 'payload'

export const NewsCategories: CollectionConfig = {
    slug: 'news_categories',
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'description',
            type: 'text',
            required: false,
        },
    ],
}
