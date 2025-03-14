import { isAdminViewOnlyOrAdmin } from './../access/isAdminViewOnlyOrAdmin';
import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

import { sendEmail } from '@/utilities/emailSender'
import { authenticator } from 'otplib'
import { generateReferralCode } from '@/utilities/referralCode'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    maxLoginAttempts: 0, // Automatically lock a user out after X amount of failed logins
  },
  admin: {
    components: {
      views: {
        edit: {
          details: {
            Component: '/components/CustomUserDetails',
            path: '/details',
            tab: {
              label: 'Details',
              href: '/details',
            }, 
          }
        },
      },
    },
    
    useAsTitle: 'email',
    listSearchableFields: ['email', 'first_name', 'last_name', 'phone_contact', 'referral_code'],
  },
  access: {
    read: () => true,
    // read: isAdminViewOnlyOrAdmin,
    create: () => true,
    update: ({ req: { user }, id }) => {
      // Allow if user is admin or updating their own record
      return user?.role === 'admin' || user?.id === id
    },
    delete: isAdmin, // Only admins can delete
  },
  fields: [
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'telegram',
      type: 'relationship',
      relationTo: 'telegram',
    },
    {
      name: 'first_name',
      type: 'text',
      admin: {
        condition: (data) => data.role !== 'company',
      },
    },
    {
      name: 'last_name',
      type: 'text',
      admin: {
        condition: (data) => data.role !== 'company',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Individual Investor',
          value: 'individual',
        },
        {
          label: 'Company Investor',
          value: 'company',
        },
      ],
      defaultValue: 'individual',
      access: {
        update: ({ req: { user } }) => user?.role === 'admin', // Only admins can update the role field
      },
    },
    {
      name: 'company_name',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role === 'company',
      },
    },
    {
      name: 'registration_number',
      type: 'text',
      admin: {
        condition: (data) => data.role === 'company',
      },
    },
    {
      name: 'phone_contact',
      type: 'text',
    },
    {
      name: 'date_of_birth',
      type: 'date',
    },
    {
      name: 'nation',
      type: 'text',
    },
    {
      name: 'gender',
      type: 'select',
      options: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
        { label: 'Other', value: 'Other' },
      ],
    },
    {
      name: 'email_verified',
      type: 'checkbox',
      defaultValue: false,
      // admin: {
      //   readOnly: true, // Optional: Prevent editing
      //   hidden: true, // Completely hide the field in the admin panel
      // },
    },
    {
      name: 'otp', // Store OTP here
      type: 'text',
      // admin: {
      //   readOnly: true, // Optional: Prevent editing
      //   hidden: true, // Completely hide the field in the admin panel
      // },
    },
    {
      name: 'otp_expires_at', // Store OTP expiration time
      type: 'date',
      // admin: {
      //   readOnly: true, // Optional: Prevent editing
      //   hidden: true, // Completely hide the field in the admin panel
      // },
    },
    {
      name: 'referral_code',
      type: 'text',
      unique: true,
      admin: {
        readOnly: true,
      },
      hooks: {
        beforeChange: [
          ({ data }) => {
            if (!data.referral_code) {
              return generateReferralCode()
            }
            return data.referral_code
          },
        ],
      },
    },
    {
      name: 'subscription',
      type: 'checkbox',
    }
  ],
  hooks: {
    beforeLogin: [
      async ({ user }) => {
        // Check if verify_email is null or undefined
        // if (!user.email_verified) {
        //   throw new Error('Email verification is required to log in.');
        // }
      },
    ],
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          data.email_verified = false
          data.otp = authenticator.generate(process.env.OTP_SECRET)
          data.otp_expires_at = new Date()
        }
        return data
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create' && !doc.email_verified) {
          try {
            await sendEmail(doc.email, 'Your OTP Code', doc.otp)
          } catch (error) {
            console.error('Error sending welcome email:', error)
          }
        }
        return doc
      },
    ],
  },
}
