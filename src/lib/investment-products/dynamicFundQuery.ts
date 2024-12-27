'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

const payload = await getPayload({
  config,
})

export const gcDynamicFund = async () => {
  const response = await payload.findGlobal({
    slug: 'gc-beq-dynamic-fund',
  })
  console.log('gc-beq-dynamic-fund', response)

  return response
}

// ::: PUBLIC PRODUCTS :::
export const getPublicProducts = async () => {
  const res = await gcDynamicFund()
  return res.public_products
}

export const getPublicProductsIDs = async () => {
  const data = await getPublicProducts()
  return data.map((prod) => {
    console.log('product id', (prod as { id: number }).id)
    return (prod as { id: number }).id
  })
}

export const inArrayPublicProductsIDs = async (pid: number) => {
  const arrIds = await getPublicProductsIDs()
  return arrIds.includes(pid)
}

// ::: EMPLOYEE PRODUCTS :::
export const getEmployeePlusProducts = async () => {
  const res = await gcDynamicFund()
  return res.employee_plus_products
}

export const getEmployeePlusProductsIDs = async () => {
  const data = await getEmployeePlusProducts()
  return data.map((prod) => {
    return (prod as { id: number }).id
  })
}

export const inArrayEmployeePlusProductsIDs = async (pid: number) => {
  const arrIds = await getEmployeePlusProductsIDs()
  return arrIds.includes(pid)
}

export const getEmployeePlusUsers = async () => {
  const res = await gcDynamicFund()
  return res.employee_users
}

export const getEmployeePlusUsersIDs = async () => {
  const data = await getEmployeePlusUsers()
  return data.map((prod) => {
    return (prod as { id: number }).id
  })
}

export const inArrayEmployeePlusUsersIDs = async (pid: number) => {
  const arrIds = await getEmployeePlusUsersIDs()
  return arrIds.includes(pid)
}

// ::: REFERRAL PRODUCTS :::
export const getReferralProducts = async () => {
  const res = await gcDynamicFund()
  return res.referral_products
}

export const getReferralProductsIDs = async () => {
  const data = await getReferralProducts()
  return data.map((prod) => {
    return (prod as { id: number }).id
  })
}

export const inArrayReferralProductsIDs = async (pid: number) => {
  const arrIds = await getReferralProductsIDs()
  return arrIds.includes(pid)
}

// ::: REFERRAL CONFIG
export const getReferralConfigRates = async (): Promise<any[]> => {
  const res = await gcDynamicFund()

  // @ts-ignore
  return res.referral_config_rates
}

export const getStandardDays = async () => {
  const res = await gcDynamicFund()

  // @ts-ignore
  return res.standard_days
}
