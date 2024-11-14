import type { CollectionConfig } from 'payload'
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';
import { isAdmin } from '../access/isAdmin';
import { sendEmail } from '@/utilities/emailSender';
import crypto from 'crypto';
import { authenticator } from 'otplib';

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
      name: 'otp', // Store OTP here
      type: 'text',
    },
    {
      name: 'otp_expires_at', // Store OTP expiration time
      type: 'date',
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
          data.email_verified = false;
          data.otp = authenticator.generate(process.env.OTP_SECRET);
          data.otp_expires_at = new Date();
        }
        return data;
      },
    ],
    afterChange: [
      async ({ doc, operation }) => {
        if (operation === 'create') {
          const otp = doc.otp
          try {
            await sendEmail(doc.email, 'Your OTP Code', otp);
          } catch (error) {
            console.error('Error sending welcome email:', error);
          }
        }
        return doc;
      },
    ],
    afterForgotPassword: [
      async ({ args }) => {
        const data = args.data;
          try {
            await sendEmail(data.email, 'Your OTP Code', otp);
          } catch (error) {
            console.error('Error sending welcome email:', error);
          }
      },
    ]
  }
}
