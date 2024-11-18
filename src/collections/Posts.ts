import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { isAdminOrAuthor } from '@/access/isAdminOrAuthor'
import { formatSlug } from '@/utilities/formatSlug'

const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'author', 'category', 'tags', 'status'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdminOrAuthor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
    },
    {
      name: 'published_date',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'post-categories',
      required: false
    },
    {
      name: 'tags',
      type: 'relationship',
      relationTo: 'post-tags',
      required: false
    },
    {
      name: 'content',
      type: 'textarea',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          value: 'draft',
          label: 'Draft',
        },
        {
          value: 'published',
          label: 'Published',
        },
      ],
      defaultValue: 'draft',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured_image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Featured image for this post',
      },
    },
    {
      name: 'slug',
      type: 'text',
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [formatSlug('title')],
      },
    },
  ],
  versions: {
    drafts: true,
  },
}

export default Posts