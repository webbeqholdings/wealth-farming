// 'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
// import { headers as nextHeaders } from 'next/headers'

// Pass Account Enum Type vô đây: deposit | withdraw | bonus | investment | transfer
// status: pending | completed | failed
export const getBalanceToAccount = async (
  accountType: any,
  to_account_id: any,
  status: any,
): Promise<number> => {
  const payload = await getPayload({
    config,
  })
  const response = await payload.find({
    collection: 'transactions',
    where: {
      to_account: { equals: to_account_id },
      type: { equals: accountType },
      status: { equals: status },
    },
  })

  if (!response.docs.length) return 0

  let total = 0
  response.docs.forEach((item) => {
    total += item.amount
  })

  return total
}

export const getBalanceFromAccount = async (
  accountType: any,
  from_account_id: any,
  status: any,
) => {
  const payload = await getPayload({
    config,
  })
  const response = await payload.find({
    collection: 'transactions',
    where: {
      from_account: { equals: from_account_id },
      type: { equals: accountType },
      status: { equals: status },
    },
  })

  if (!response.docs.length) return 0

  let total = 0
  response.docs.forEach((item) => {
    total += item.amount
  })

  return total
}

export const getAccountsByUser = async (user_id: number): Promise<any> => {
  const payload = await getPayload({
    config,
  })
  const response = await payload.find({
    collection: 'accounts',
    where: {
      user: { equals: user_id },
    },
  })

  if (!response.docs.length) return []
  return response.docs
}

export const getAccountIdInvestmentByUser = async (user_id: number): Promise<any> => {
  const payload = await getPayload({
    config,
  })
  const response = await payload.find({
    collection: 'accounts',
    where: {
      user: { equals: user_id },
      type: { equals: 'investment' },
    },
  })

  if (!response.docs.length) return false
  return response.docs[0].id
}

export const getBalanceByUser = async (user_id: number, status: string): Promise<number> => {
  const accounts = await getAccountsByUser(user_id)
  let total = 0

  for (let acc of accounts) {
    total += await getBalanceToAccount(acc.name, acc.id, status)
  }

  return total
}
