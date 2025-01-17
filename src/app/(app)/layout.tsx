import '@/styles/globals.css'
import { Metadata, Viewport } from 'next'
import { Open_Sans } from 'next/font/google'
import { siteConfig } from '@/config/site'
import { cn } from '@/lib/utils'
import RootProvider from './provider'
export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  metadataBase: new URL(siteConfig.url),
  description: siteConfig.description,
  keywords: ['Wealth Farming Fund', 'Capital Fund', 'Digital Asset'],
  authors: [
    {
      name: 'Wealth Farming Fund',
      url: 'https://wealthfarmingcap.net',
    },
  ],
  creator: 'wealthFarming',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@shadcn',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
  icons: {
    icon: 'https://i.postimg.cc/0NV32J1w/favicon-32x32.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

const openSans = Open_Sans({
  subsets: ['latin'],
  display: 'swap',
})
interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en">
        <head />
        <body
          suppressHydrationWarning
          className={cn('min-h-screen bg-background', openSans.className)}
        >
          <RootProvider>
            {children}
          </RootProvider>
        </body>
      </html>
    </>
  )
}
