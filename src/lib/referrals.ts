'use server'

import { getPayload } from 'payload'
import config from '@payload-config'
// import { headers as nextHeaders } from 'next/headers'
import { User } from '@/payload-types'
import { getBalanceFromAccount, getAccountIdInvestmentByUser } from './account'
import { getReferralConfigRates } from './investment-products/dynamicFundQuery'

const payload = await getPayload({
  config,
})
// export const PRODUCT_ID_REFERRAL = 5

export const getReferralsByParentId = async (
  parentId: number,
  page: number,
  limit: number,
): Promise<{ docs: any; referral_code: string; totalPages: number; totalDocs: number }> => {
  try {
    const response = await payload.find({
      collection: 'user-referrals',
      where: {
        parent: { equals: parentId },
      },
      page, // Pass the page number
      limit, // Pass the number of items per page
    })

    const referrals: any = response.docs
    return {
      docs: referrals.map((referral: any) => ({
        id: referral.id.toString(), // Ensure ID is a string
        name: `${referral.child?.first_name || ''} ${referral.child?.last_name || ''}`.trim(),
        email: referral.child?.email || 'N/A', // Default to 'N/A' if email is missing
        date: referral.referral_at
          ? new Date(referral.referral_at).toISOString().split('T')[0] // Format date to YYYY-MM-DD
          : 'N/A',
        status: referral.child?.email_verified ? 'Completed' : 'Pending', // Use email_verified for status
      })),
      referral_code: referrals[0].parent.referral_code,
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Error fetching referrals by parent ID:', error)

    return { docs: [], referral_code: '', totalPages: 0, totalDocs: 0 }
  }
}

export const getReferralsByParentIdWithFilter = async (
  parentId: number,
  page: number,
  limit: number,
  startDate: string,
  endDate: string,
  nameFilter: string,
): Promise<{ docs: any; referral_code: string; totalPages: number; totalDocs: number }> => {
  try {
    var query
    if(nameFilter != '' && startDate!='' && endDate!=''){
      query = {
        parent: { equals: parentId },
        referral_at: {
          greater_than_equal: startDate,
          less_than_equal: endDate,
        },
        or:[ {'child.first_name': {like: nameFilter}}, {'child.last_name': {like: nameFilter}}, {'child.email': {like: nameFilter}}]}
    } else if (nameFilter !=''){
      query = {
        parent: { equals: parentId },
        or:[ {'child.first_name': {like: nameFilter}}, {'child.last_name': {like: nameFilter}}, {'child.email': {like: nameFilter}}]} 
    } else if (startDate != '' && endDate != '') {
      query = {
        parent: { equals: parentId },
        referral_at: {
          greater_than_equal: startDate,
          less_than_equal: endDate,
        }}
      }else{
        query = {
          parent: { equals: parentId },
        }
      }

    const response = await payload.find({
      collection: 'user-referrals',
      where: {
        ...query,
      },
      page, // Pass the page number
      limit, // Pass the number of items per page
    })

    const referrals: any = response.docs
    return {
      docs: referrals.map((referral: any) => ({
        id: referral.id.toString(), // Ensure ID is a string
        name: `${referral.child?.first_name || ''} ${referral.child?.last_name || ''}`.trim(),
        email: referral.child?.email || 'N/A', // Default to 'N/A' if email is missing
        date: referral.referral_at
          ? new Date(referral.referral_at).toISOString().split('T')[0] // Format date to YYYY-MM-DD
          : 'N/A',
        status: referral.child?.email_verified ? 'Completed' : 'Pending', // Use email_verified for status
      })),
      referral_code: referrals[0].parent.referral_code,
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Error fetching referrals by parent ID:', error)

    return { docs: [], referral_code: '', totalPages: 0, totalDocs: 0 }
  }
}

export const getParentIdByUser = async (user_id: number): Promise<number | Boolean | User> => {
  const response = await payload.find({
    collection: 'user-referrals',
    where: {
      parent: { equals: user_id },
    },
  })

  if (!response.docs.length) {
    return false
  }

  console.log('response.docs[0].parent', response.docs[0].parent)

  return response.docs[0].parent
}

export const getLinkReferral = async (user_id: number): Promise<string> => {
  const response = await payload.findByID({
    collection: 'users',
    id: user_id,
  })

  if (!response) {
    return ''
  }

  return `${process.env.BASE_URL}/join/${response.referral_code}`
}

export const getChildrenByParentId = async (parent_id: number): Promise<object[]> => {
  const referrals = await payload.find({
    collection: 'user-referrals',
    where: {
      parent: { equals: parent_id },
    },
  })

  if (!referrals.docs.length) {
    return []
  }

  return referrals.docs
}

export const getCountChildren = async (parent_id: number) => {}
export const getCountInvestChildren = async (parent_id: number) => {
  const children = await getChildrenByParentId(parent_id)

  const count = 0
  children.forEach((child: any) => {})
}

export const getCurrentLevelRate = async (total: number) => {
  const config_rates = await getConfigRates()

  for (let rate of config_rates) {
    if (total >= rate.min && total < rate.max) {
      return rate
    }
  }

  if (config_rates[config_rates.length - 1].max < total)
    return config_rates[config_rates.length - 1].rate
}

export const getInvestmentAmountByParent = async (parent_id: number): Promise<number> => {
  const referrals = await payload.find({
    collection: 'user-referrals',
    where: {
      parent: { equals: parent_id },
    },
  })

  let total = 0

  referrals.docs.forEach((child: any) => {
    const account_id = getAccountIdInvestmentByUser(child.id)
    const loadBalance = async () => {
      const total_investment = await getBalanceFromAccount('investment', account_id, 'completed')
      total += total_investment
    }
    loadBalance()
  })

  return total
}

export const getDepositAmountByParent = async (parent_id: number): Promise<number> => {
  const referrals = await payload.find({
    collection: 'user-referrals',
    where: {
      parent: { equals: parent_id },
    },
  })

  let total = 0

  referrals.docs.forEach((child: any) => {
    const account_id = getAccountIdInvestmentByUser(child.id)
    const loadBalance = async () => {
      const total_deposit = await getBalanceFromAccount('deposit', account_id, 'completed')
      total += total_deposit
    }
    loadBalance()
  })

  return total
}

export const getConfigRates = async (): Promise<any[]> => {
  const data = await getReferralConfigRates()
  return data
}

export const getProductIdReferral = async () => {
  return 5
}
