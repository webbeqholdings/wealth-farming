'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({
  config,
})

export const getSiteSettings = async () => {
  const response = await payload.findGlobal({
    slug: 'site-settings',
  })

  return response
}
