import type { CollectionConfig } from 'payload'
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';
import { isAdmin } from '../access/isAdmin';
import { sendEmail } from '@/utilities/emailSender';
import crypto from 'crypto';

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  access: {
    read: () => true,
    create: () => true,
    update: isIndividualOrAdmin,
    delete: isAdmin,
  },
  fields: [
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
    },
    {
      name: 'first_name',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role !== 'company',
      },
    },
    {
      name: 'last_name',
      type: 'text',
      required: true,
      admin: {
        condition: (data) => data.role !== 'company',
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
      name: 'email_verified',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'verification_token',
      type: 'text',
    },
  ],
   hooks: {
    beforeLogin: [
      async ({ user }) => {
        // Check if verify_email is null or undefined
        if (!user.email_verified && !user.verification_token) {
          throw new Error('Email verification is required to log in.');
        }
      },
    ],
    beforeChange: [
      async ({ data, operation }) => {
        if (operation === 'create') {
          // Generate a unique token
          data.verification_token = crypto.randomBytes(32).toString('hex');
          data.email_verified = false;
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          const verificationUrl = `${process.env.BASE_URL}/api/verify-email?token=${doc.verification_token}&id=${doc.id}`;
          const text = `Please verify your email by clicking the following link: ${verificationUrl}`
          const html = `<a href="${verificationUrl}">Verify Email</a>`
          try {
            await sendEmail(doc.email, 'Email Verification', text, html);
          } catch (error) {
            console.error('Error sending welcome email:', error);
          }
        }
        return doc;
      },
    ],
  }
}
