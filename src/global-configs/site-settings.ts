import { isAdmin } from '@/access/isAdmin'
import { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  access: {
    read: () => true,
    update: isAdmin,  // Only admin can update
  },
  fields: [
    {
      name: 'site_name',
      type: 'text',
      label: 'Website Name',
      required: true,
    },
    {
      name: 'support_email',
      type: 'email',
      label: 'Support Email',
      required: true,
    },
    {
      name: 'support_phone',
      type: 'text',
      label: 'Support Phone Number',
    },
    {
      name: 'contact_address',
      type: 'textarea',
      label: 'Contact Address',
    },
    {
      name: 'qr-codes',
      type: 'upload',
      relationTo: 'media', // Assuming you have a media collection set up for uploads
    },
    {
      name: 'social_links',
      type: 'array',
      label: 'Social Media Links',
      fields: [
        {
          name: 'platform',
          type: 'text',
          label: 'Platform Name',
          required: true,
        },
        {
          name: 'url',
          type: 'text',
          label: 'Profile URL',
          required: true,
        },
      ],
    },
    {
      name: 'business_hours',
      type: 'textarea',
      label: 'Business Hours',
      admin: {
        placeholder: 'e.g., Mon-Fri: 9am - 5pm',
      },
    },
  ],
}

export default SiteSettings
