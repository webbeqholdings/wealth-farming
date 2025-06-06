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
import { CryptoWallets } from './collections/CryptoWallets'
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
import Telegram from './collections/Telegram'
import Notification from './collections/Notifications'
import EconomicCalendar from './collections/EconomicCalendar'
import MainMenu from './global-configs/main-menu'
import UserReferrals from './collections/UserReferrals'
import Withdrawals from './collections/Withdrawls'
import GcBeQDynamicFund from './global-configs/beq-dynamic-fund'
import GcPaymentTransfer from './global-configs/payment-transfer'
import GcGoogleSheet from './global-configs/google-sheet'
import { s3Storage } from '@payloadcms/storage-s3'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

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
    defaultFromAddress: 'no-reply@mail-resend.wealthfarming.org',
    defaultFromName: 'Wealth Farming',
    transportOptions: {
      host: process.env.SMTP_HOST,
      secure: true,
      port: process.env.SMTP_PORT,
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
    CryptoWallets,
    Companies,
    Contracts,
    EconomicCalendar,
    InvestmentFunds,
    InvestmentProducts,
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
    Withdrawals,
  ],
  globals: [SiteSettings, MainMenu, GcPaymentTransfer, GcBeQDynamicFund, GcGoogleSheet, Header, Footer],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET,
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
      generateTitle: ({ doc }) => `Wealthfarming.org — ${doc.title}`,
      generateDescription: ({ doc }) => doc.title,
      generateURL: ({ doc, collectionSlug }) => process.env.BASE_URL + `/${doc.slug}`, // recommend env
    }),
    s3Storage({
      collections:{
        media: true,
      },
      bucket: process.env.S3_BUCKET_NAME as string,
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY as string,
          secretAccessKey: process.env.S3_SECRET_KEY as string,
        },
        region: process.env.S3_REGION,
        endpoint: process.env.S3_ENDPOINT,
        forcePathStyle: true,
      }
    })
  ],
  localization: {
    locales: ['en', 'vi'],
    defaultLocale: 'en',
  },
})
