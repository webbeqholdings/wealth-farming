import { headers as nextHeaders } from 'next/headers'
import { getPayload } from 'payload'
import config from '@payload-config'

export const me = async () => {
  const payload = await getPayload({
    config,
  })
  const headers = await nextHeaders()
  const auth = await payload.auth({ headers })
  return auth.user
}
