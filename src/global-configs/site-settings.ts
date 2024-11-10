// siteSettings.global.js
import { GlobalConfig } from 'payload'

const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
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
