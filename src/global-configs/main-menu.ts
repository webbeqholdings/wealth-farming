import type { GlobalConfig } from 'payload'

const MainMenu: GlobalConfig = {
  slug: 'main-menu',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'menuItems',
      type: 'array',
      label: 'Menu Items',
      minRows: 1,
      maxRows: 8,
      admin: {},
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
        },
        {
          name: 'children',
          type: 'array',
          label: 'Submenu Items',
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
            },
            {
              name: 'description',
              type: 'textarea',
            },
          ],
        },
      ],
    },
  ],
}

export default MainMenu
