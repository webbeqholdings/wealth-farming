import { User } from '@/payload-types'
import { Payload } from 'payload'

export const getParentIdByUser = async (
  payload: Payload,
  user_id: number,
): Promise<number | Boolean | User> => {
  const response = await payload.find({
    collection: 'user-referrals',
    where: {
      parent: { equals: user_id },
    },
  })

  if (!response.docs.length) {
    return false
  }

  return response.docs[0].parent
}

export const gcDynamicFund = async (payload: Payload) => {
  const response = await payload.findGlobal({
    slug: 'gc-beq-dynamic-fund',
  })

  return response
}

export const getReferralConfigRates = async (payload: Payload): Promise<any[]> => {
  const res = await gcDynamicFund(payload)

  // @ts-ignore
  return res.referral_config_rates
}

export const getCurrentLevelRate = async (payload: Payload, total: number) => {
  const config_rates = await getReferralConfigRates(payload)

  for (let level of config_rates) {
    if (total >= level.min && total < level.max) {
      return level.rate
    }
  }

  if (config_rates[config_rates.length - 1].max < total)
    return config_rates[config_rates.length - 1].rate
}

export const getReferralProducts = async (payload: Payload): Promise<any[]> => {
  const res = await gcDynamicFund(payload)

  // @ts-ignore
  return res.referral_products
}
