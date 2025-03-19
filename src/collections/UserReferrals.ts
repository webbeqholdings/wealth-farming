import { isIndividualOrAdmin } from '@/access/isIndividualOrAdmin';
import type { CollectionConfig } from 'payload'

const UserReferrals: CollectionConfig = {
  slug: 'user-referrals',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['parent', 'child', 'referral_at'],
    listSearchableFields: ['parent.email', 'child.email'],
  },
  access: {
    create: () => true,
    read: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'child',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
      unique: true, // This ensures a child can only be referred once
    },
    {
      name: 'referral_at',
      type: 'date',
      required: false,
      defaultValue: () => new Date(),
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }: { data: any; req: any }) => {
        // Ensure a user can't refer themselves
        if (data.parent === data.child) {
          throw new Error('A user cannot refer themselves')
        }

        // Check if this child has already been referred
        const existingReferral = await req.payload.find({
          collection: 'user-referrals',
          where: {
            child: { equals: data.child },
          },
        })

        if (existingReferral.totalDocs > 0) {
          throw new Error('This user has already been referred by someone else')
        }

        return data
      },
    ],
    beforeValidate: [],
  },
}

export default UserReferrals
