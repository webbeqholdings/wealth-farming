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

export const getReferralRewardBalance = async (user_id: number): Promise<number> => {
  try {
    const response = await payload.find({
      collection: 'contracts',
      where: {
        'user': { equals: user_id },
        'config_log': { not_equals: null },
        'config_log.referral': { not_equals: null }
      },
      sort: '-balance',
      select: {
        balance: true
      },
    })

    const totalBalance = response.docs.reduce((total, item) => total + item.balance, 0);

    return totalBalance
  } catch (error) {
    console.error('Error getReferralRewardBalance:', error)
    return 0
  }
}

export const getTotalNumberReferral = async (): Promise<{
  parent: {
    id: number;
    first_name: string;
    last_name: string;
  }, count: number, balance: number
}[]> => {
  try {
    const response = await payload.find({
      collection: 'user-referrals',
      select: {
        parent: true,
        child: true
      }
      , limit: 1000
      , depth: 1
    })
    const data = response.docs

    function isUser(parent: number | User): parent is User {
      return (parent as User).id !== undefined;
    }

    const parentCounts = data.reduce<{ [key: number]: { count: number, first_name: string, last_name: string } }>((acc, { parent }) => {
      let parentId: User;

      if (isUser(parent)) {
        parentId = parent;
      } else {
        return acc;
      }
      if (acc[parentId.id]) {
        acc[parentId.id].count++;
      } else {
        acc[parentId.id] = { count: 1, first_name: parentId.first_name, last_name: parentId.last_name };
      }
      return acc;
    }, {});
    const parentWithBalance = await Promise.all(
      Object.entries(parentCounts).map(async ([parent, { count, first_name, last_name }]) => {
        const parentId = Number(parent);
        const balance = await getReferralRewardBalance(parentId);

        return {
          parent: { id: parentId, first_name, last_name },
          count,
          balance
        };
      })
    );
    const sortedParentCounts = parentWithBalance.sort((a, b) => b.count - a.count).slice(0,10);
    return sortedParentCounts;
  }
  catch (error) {
    return []
  }
}



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
    if (nameFilter != '' && startDate != '' && endDate != '') {
      query = {
        parent: { equals: parentId },
        referral_at: {
          greater_than_equal: startDate,
          less_than_equal: endDate,
        },
        or: [{ 'child.first_name': { like: nameFilter } }, { 'child.last_name': { like: nameFilter } }, { 'child.email': { like: nameFilter } }]
      }
    } else if (nameFilter != '') {
      query = {
        parent: { equals: parentId },
        or: [{ 'child.first_name': { like: nameFilter } }, { 'child.last_name': { like: nameFilter } }, { 'child.email': { like: nameFilter } }]
      }
    } else if (startDate != '' && endDate != '') {
      query = {
        parent: { equals: parentId },
        referral_at: {
          greater_than_equal: startDate,
          less_than_equal: endDate,
        }
      }
    } else {
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

export const getCountChildren = async (parent_id: number): Promise<number> => {
  return (await getChildrenByParentId(parent_id)).length
}
export const getCountDepositedChildren = async (parent_id: number): Promise<number> => {
  const children = await getChildrenByParentId(parent_id)

  return children.filter((child: any) => {
    return isDeposit(child.id)
  }).length
}

export const getTotalEarning = async (parent_id: number) => {
  const data = await payload.find({
    collection: 'transactions',
    where: {
      user: { equals: parent_id },
      type: { equals: 'referral_reward' },
      status: { equals: 'completed' },
    },
  })

  let totalEarning = 0
  data.docs.map((t: any) => {
    totalEarning += t.amount
  })

  return totalEarning
}

export const isDeposit = async (user_id: number): Promise<Boolean> => {
  const data = await payload.find({
    collection: 'transactions',
    where: {
      user: { equals: user_id },
      type: { equals: 'deposit' },
      status: { equals: 'completed' },
    },
  })

  return Boolean(data.totalDocs)
}

export const getCurrentLevelRate = async (total: number) => {
  const config_rates = await getConfigRates()

  for (let rate of config_rates) {
    if (total >= rate.min && total < rate.max) {
      return rate.rate
    }
  }

  if (config_rates[config_rates.length - 1].max < total)
    return config_rates[config_rates.length - 1].rate
}

export const getCurrentLevelName = async (total: number) => {
  const config_rates = await getConfigRates()

  for (let rate of config_rates) {
    if (total >= rate.min && total < rate.max) {
      return rate.name
    }
  }

  if (config_rates[config_rates.length - 1].max < total)
    return config_rates[config_rates.length - 1].name
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
