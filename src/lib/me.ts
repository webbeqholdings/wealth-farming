'use server'
import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({
  config,
})

export const me = async () => {
  const headers = await nextHeaders()
  const auth = await payload.auth({ headers })
  return auth.user
}
