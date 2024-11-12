import type { CollectionConfig } from 'payload'
import { isIndividualOrAdmin } from '../access/isIndividualOrAdmin';
import { isAdmin } from '../access/isAdmin';
import { sendEmail } from '@/utility/emailSender';
import crypto from 'crypto';
import payload from 'payload'

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
    beforeChange: [
      async ({ data, operation, req }) => {
        if (operation === 'create') {
          // Generate a unique token
          data.verification_token = crypto.randomBytes(32).toString('hex');
          data.email_verified = false;
          const verificationUrl = `${process.env.BASE_URL}/api/users?where[verification_token][equals]=${data.verification_token}&type=verify_email`;
          const text = `Please verify your email by clicking the following link: ${verificationUrl}`
          const html = `<a href="${verificationUrl}">Verify Email</a>`
          try {
            await sendEmail(data.email, 'Email Verification', text, html);
          } catch (error) {
            console.error('Error sending welcome email:', error);
          }
        } else if(operation !== 'update'){
          console.log('check doc: ', data);
          console.log('check operation: ', operation);
          console.log('check req: ', req);
        }
        console.log('check 123');
        return data;
      },
    ],
    afterOperation: [
      async ({ collection, req }) => {
        console.log('chekc collection: ', collection);
        console.log('chekc req: ', req);

        // if(doc.verification_token && !doc.email_verified){
          const updatedUser = await payload.update({
            collection: 'users',
            id: 17,
            data: {
              verification_token: null,
              email_verified: true,
            },
          // });
        })
        console.log('check updatedUser: ', updatedUser);
      }
    ],
  }
}
