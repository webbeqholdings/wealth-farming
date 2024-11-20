import { withPayload } from '@payloadcms/next/withPayload'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['i.postimg.cc'], // Replace with the actual domain of your QR code image
  },
}

export default withPayload(nextConfig)
