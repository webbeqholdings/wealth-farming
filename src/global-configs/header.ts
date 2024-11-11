import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Header: GlobalConfig = {
    slug: 'header',
    label: 'Site Header',
    access: {
      read: () => true,  // Allows public access to read the header data
      update: isAdmin,  // Only admin can update
    },
    fields: [
      {
        name: 'logo',
        type: 'upload',
        relationTo: 'media',
        required: true,
      },
      {
        name: 'navigationLinks',
        type: 'array',
        fields: [
          {
            name: 'title',
            type: 'text',
            required: true,
          },
          {
            name: 'url',
            type: 'text',
            required: true,
          }
        ],
      },
      {
        name: 'contactInfo',
        type: 'text',
      },
      {
        name: 'socialMediaLinks',
        type: 'array',
        fields: [
          {
            name: 'platform',
            type: 'text',
            required: true,
          },
          {
            name: 'url',
            type: 'text',
            required: true,
          },
          {
            name: 'icon',
            type: 'upload',
            relationTo: 'media',
          }
        ],
      }
    ],
}
