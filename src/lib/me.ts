'use server'
import { me as sharedMe } from '@/lib/shared-logic/me'

export const me = async () => {
  return await sharedMe()
}
