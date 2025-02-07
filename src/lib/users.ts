'use server'
import { getPayload } from 'payload'
import config from '@payload-config';

export const updateUserSubscription: any = async (user_id: number): Promise<any> => {
  const payload = await getPayload({
      config,
    })
  await payload.update({
      collection: 'users',
      id: user_id,
      data: {
          subscription: true,
      }
  })
}