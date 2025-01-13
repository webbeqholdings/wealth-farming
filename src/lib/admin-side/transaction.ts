import { Payload } from 'payload'
import config from '@payload-config'

export const getTotalDeposit = async (payload: Payload, user_id: number): Promise<number> => {
  let total = 0
  const data = await payload.find({
    collection: 'transactions',
    where: {
      user: { equals: Number(user_id) },
      status: { equals: 'completed' },
      type: { equals: 'deposit' },
    },
  })

  if (!data.totalDocs) return 0

  data.docs.forEach((t: any) => {
    total += t.amount
  })

  return total
}

export const getSumAmountAccountFrom = async (payload: Payload, account_from: number) => {
  const transactions = await payload.find({
    collection: 'transactions',
    where: {
      status: { equals: 'completed' },
      account_from: { equals: account_from },
    },
  })

  if (!transactions.totalDocs) return 0

  let total = 0
  transactions.docs.forEach((t: any) => {
    total += t.amount
  })

  return total
}

export const getSumAmountAccountTo = async (payload: Payload, account_to: number) => {
  const transactions = await payload.find({
    collection: 'transactions',
    where: {
      status: { equals: 'completed' },
      account_to: { equals: account_to },
    },
  })

  if (!transactions.totalDocs) return 0

  let total = 0
  transactions.docs.forEach((t: any) => {
    total += t.amount
  })

  return total
}

// Amount Balance = Sum(account_to) - Sum(account_from) // them payload: Payload dong bo het cho file nay nha
export const getSumAmountBalanceByAccount = async (payload: Payload, account_id: number) => {
  const sumIn = await getSumAmountAccountTo(payload, account_id)
  const sumOut = await getSumAmountAccountFrom(payload, account_id)
  return sumIn - sumOut
}
