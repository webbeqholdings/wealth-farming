// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { nodemailerAdapter } from '@payloadcms/email-nodemailer'

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
import verifyOTPRoute from './routers/verifyOTP'
import resendOTPRoute from './routers/resendOTP'
import getBalance from './routers/getBalance'
import forgotPasword from './routers/forgotPassword'
import verifyPassword from './routers/verifyPassword'
import updatePassword from './routers/updatePassword'
import signUp from './routers/signUp'
import PostCategories from './collections/PostCategories'
import Posts from './collections/Posts'
import PostTags from './collections/PostTags'
import TransferCashRequests from './collections/TransferCashRequests'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
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
    Users,
    Media,
    Companies,
    InvestmentFunds,
    InvestmentProducts,
    Contracts,
    Transactions,
    PostCategories,
    Posts,
    PostTags,
    TransferCashRequests
  ],
  endpoints: [signUp, getBalance, verifyOTPRoute, resendOTPRoute, forgotPasword, verifyPassword, updatePassword],
  globals: [SiteSettings, Header, Footer],
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
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
