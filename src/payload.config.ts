// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import { seoPlugin } from '@payloadcms/plugin-seo'

import { Users } from './collections/Users'
import { Banks } from './collections/Banks'
import { Address } from './collections/Address'
import { Media } from './collections/Media'
import Companies from './collections/Companies'

import Transactions from './collections/Transactions'
import Accounts from './collections/Accounts'
import Contracts from './collections/Contracts'
import InvestmentFunds from './collections/InvestmentFunds'
import InvestmentProducts from './collections/InvestmentProducts'
import SiteSettings from './global-configs/site-settings'
import { Header } from './global-configs/header'
import { Footer } from './global-configs/footer'
import PostCategories from './collections/PostCategories'
import Posts from './collections/Posts'
import PostTags from './collections/PostTags'
import TransferCashRequests from './collections/TransferCashRequests'
import Units from './collections/Units'
import InvestmentProfitLoss from './collections/InvestmentProfitLoss'
import Telegram from './collections/Telegram'
import Notification from './collections/Notifications'
import EconomicCalendar from './collections/EconomicCalendar'
import MainMenu from './global-configs/main-menu'
import UserReferrals from './collections/UserReferrals'
import Withdrawals from './collections/Withdrawls'
import {s3Storage} from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      openGraph: {
        description: 'The best admin panel in the world',
        images: [
          {
            url: 'https://i.postimg.cc/0NV32J1w/favicon-32x32.png',
            width: 800,
            height: 600,
          },
        ],
        siteName: 'Payload',
        title: 'My Admin Panel',
      },
      titleSuffix: '- Wealth Farming',
      icons: [
        {
          url: 'https://i.postimg.cc/0NV32J1w/favicon-32x32.png',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png',
        },
      ],
    },
    components: {
      graphics: {
        Icon: './graphics/Icon#Icon',
        Logo: './graphics/Logo#Logo', // Correct the path and use default export
      },
    },
  },
  email: nodemailerAdapter({
    defaultFromAddress: 'beq@beqholdings.com',
    defaultFromName: 'Beq Holdings',
    transportOptions: {
      host: process.env.SMTP_HOST,
      port: 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  }),
  collections: [
    Accounts,
    Address,
    Banks,
    Companies,
    Contracts,
    EconomicCalendar,
    InvestmentFunds,
    InvestmentProducts,
    InvestmentProfitLoss,
    Telegram,
    Transactions,
    TransferCashRequests,
    PostCategories,
    Posts,
    PostTags,
    UserReferrals,
    Users,
    Units,
    Notification,
    Media,
    Withdrawals
  ],
  globals: [SiteSettings, MainMenu, Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  jobs: {
    tasks: [
      {
        slug: 'updateProfit',
        handler: path.resolve(dirname, 'tasks/updateProfit.ts') + '#updateProfitHandler',
      },
    ],
    workflows: [
      {
        slug: 'workflow',
        handler: path.resolve(dirname, 'tasks/updateProfit.ts') + '#updateProfitHandler',
      },
    ],
  },
  plugins: [
    seoPlugin({
      collections: ['posts'],
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `Website.com — ${doc.title}`,
      generateDescription: ({ doc }) => doc.title,
      generateURL: ({ doc, collectionSlug }) => process.env.BASE_URL + `/${doc.slug}`, // recommend env
    }),
    // store media to minio storage
    s3Storage({
      bucket: process.env.MINIO_BUCKET_NAME,
      acl: 'public-read',
      config: {
        endpoint: process.env.MINIO_END_POINT,
        region: process.env.MINIO_REGION,
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY_ID, 
          secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY,
        },
        forcePathStyle: true, 
      },
      collections: {
        media: true,
      },
      disableLocalStorage: true,
      enabled: true, // Enable the plugin
    }),
  ],
})
