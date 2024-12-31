import { Payload } from 'payload'
export const gcDynamicFund = async (payload: Payload) => {
  const response = await payload.findGlobal({
    slug: 'gc-beq-dynamic-fund',
  })

  return response
}
// ::: REFERRAL PRODUCTS :::
export const getReferralProducts = async (payload: Payload) => {
  const res = await gcDynamicFund(payload)
  return res.referral_products
}

export const getReferralProductsIDs = async (payload: Payload) => {
  const data = await getReferralProducts(payload)
  return data.map((prod: any) => {
    return (prod as { id: number }).id
  })
}

export const inArrayReferralProductsIDs = async (payload: Payload, pid: number) => {
  const arrIds = await getReferralProductsIDs(payload)
  return arrIds.includes(pid)
}
