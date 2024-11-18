import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

const PostTags: CollectionConfig = {
  slug: 'post-tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug'],
  },
  access: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data.name) {
              return data.name.toLowerCase().replace(/ /g, '-')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
  ],
}

export default PostTags