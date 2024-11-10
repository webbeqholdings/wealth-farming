import type { CollectionConfig } from 'payload'

export const NewsCategories: CollectionConfig = {
    slug: 'news-categories',
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
