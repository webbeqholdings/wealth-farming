import type { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'

export const Footer: GlobalConfig = {
    slug: 'footer',
    label: 'Site Footer',
    access: {
      read: () => true, 
      update: isAdmin,  
    },
    fields: [
      {
        name: 'copyrightText',
        type: 'text',
        required: true,
      },
      {
        name: 'privacyPolicyLink',
        type: 'text',
        admin: {
          condition: (_, siblingData) => !!siblingData.privacyPolicyLink,
        }
      },
      {
        name: 'aboutUsLink',
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
