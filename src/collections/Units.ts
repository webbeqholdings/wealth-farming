import type { CollectionConfig } from 'payload';

const Units: CollectionConfig = {
  slug: 'units',
  access: {
    read: () => true, // Publicly readable
    create: ({ req: { user } }) => user?.role === 'admin', // Only admins can create
    update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update
    delete: ({ req: { user } }) => user?.role === 'admin', // Only admins can delete
  },
  fields: [
    {
      name: 'unit_name',
      type: 'text',
      label: 'Unit Name',
      required: true,
      admin: {
        placeholder: 'e.g., Shares, Bonds, Units, etc.',
      },
    },
    {
      name: 'unit_code',
      type: 'text',
      label: 'Unit Code',
      unique: true,
      admin: {
        placeholder: 'e.g., SHR, BND, UNT',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        placeholder: 'Provide a brief description of the unit.',
      },
    }
  ],
  admin: {
    useAsTitle: 'unit_name',
  },
};

export default Units;
