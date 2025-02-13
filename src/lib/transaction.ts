'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getAccountIdInvestmentByUser, getAccountsByUser } from './account'
import {
  getEmployeePlusProducts,
  inArrayEmployeePlusUsersIDs,
} from './investment-products/dynamicFundQuery'
import { getCurrentLevelRate } from './referrals'

const payload = await getPayload({
  config,
})

export const getTransactions = async (
  page: number,
  limit: number,
  activeTab: string, // Added activeTab parameter
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })
    // Construct the where condition dynamically
    const whereCondition: any = {
      user: { equals: auth.user.id },
    }

    if (activeTab !== 'all') {
      whereCondition.type = { equals: activeTab } // Add type filter only if activeTab is not 'all'
    }

    // Make a single call to payload.find
    const response = await payload.find({
      collection: 'transactions',
      where: whereCondition,
      page, // Pass the page number
      limit, // Pass the number of items per page
    })
    const transactions = response.docs
    return {
      docs: transactions.map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        date: formatDateTime(transaction.createdAt),
        account: transaction.account_from?.account_name,
        account_from: transaction.account_to?.account_name,
        profit_or_loss: transaction?.profit_or_loss,
        unit_code: transaction?.unit?.unit_code,
        product_name: transaction?.investment_product?.product_name,
        status: transaction?.status,
        message: transaction?.message,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Transaction error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getTransactionsWithDate = async (
  page: number,
  limit: number,
  activeTab: string, // Added activeTab parameter
  startDate: string,
  endDate: string,
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })
    // Construct the where condition dynamically
    const whereCondition: any = {
      user: { equals: auth.user.id },
    }

    const query = {
      createdAt: {
        greater_than_equal: startDate,
        less_than_equal: endDate,
      },
    }

    if (activeTab !== 'all') {
      whereCondition.type = { equals: activeTab } // Add type filter only if activeTab is not 'all'
    }

    // Make a single call to payload.find
    const response = await payload.find({
      collection: 'transactions',
      where: {
        ...whereCondition,
        ...query,
      },
      page, // Pass the page number
      limit, // Pass the number of items per page
    })
    const transactions = response.docs

    return {
      docs: transactions.map((transaction: any) => ({
        id: transaction.id,
        type: transaction.type,
        amount: transaction.amount,
        date: formatDateTime(transaction.createdAt),
        account: transaction.account_to?.account_name,
        account_from: transaction.account_from?.account_name,
        profit_or_loss: transaction?.profit_or_loss,
        unit_code: transaction?.unit?.unit_code,
        product_name: transaction?.investment_product?.product_name,
        status: transaction?.status,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Transaction error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const IsInvest = async (user_id: number): Promise<Boolean> => {
  const account_id = await getAccountIdInvestmentByUser(user_id)

  const res = await payload.find({
    collection: 'transactions',
    where: {
      type: { equals: 'investment' },
      status: { equals: 'completed' },
      account_to: { equals: account_id },
    },
  })

  return !!res.totalDocs
}

export const createInvestment = async (formData: any) => {
  const { amount, startDate, endDate, productId, periods, term, userId } = formData
  const accountInvesment = await payload.find({
    collection: 'accounts',
    where: {
      user: { equals: Number(userId) },
      type: { equals: 'investment'}
    },
  })
  const amountAvailable = await getSumAmountBalanceByAccount(Number(accountInvesment.docs[0].id))

  if (amount <= 0) {
    return {
      isSuccess: false,
      msg: 'invalid_amount',
    }
  }

  const product = await payload.find({
    collection: 'investment-products',
    where: {
      id: {
        equals: productId,
      },
    },
  })

  const product_doc = product.docs[0]

  if (!product_doc) {
    return {
      isSuccess: false,
      msg: 'invalid_product',
    }
  }

  const min_investment = product.docs[0].min_investment

  if (amount < min_investment) {
    const mess =  JSON.stringify({
      key: 'min_invest',
      params: { amount: min_investment},
    })
    console.log('mess', mess)
    return {
      isSuccess: false,
      msg: mess,
    }
  }

  if (amount > amountAvailable) {
    return {
      isSuccess: false,
      msg: 'account_not_enough',
    }
  }

  const account_id = await getAccountIdInvestmentByUser(userId)

  const transaction_doc = await payload.create({
    collection: 'transactions',
    data: {
      user: userId,
      amount: Number(amount),
      investment_product: product_doc.id,
      status: 'completed',
      account_from: account_id,
      type: 'investment',
    },
  })

  // user referrals
  const userReferral = await payload.find({
    collection: 'user-referrals',
    where: {
      child: { equals: userId },
    },
  })

  if (
    userReferral &&
    typeof userReferral.docs[0]?.parent === 'object' &&
    userReferral.docs[0]?.parent !== null
  ) {
    const configRate = await getCurrentLevelRate(userId)
    await payload.create({
      collection: 'contracts',
      data: {
        user: userReferral.docs[0].parent.id,
        amount: Number(amount * configRate),
        balance: Number(amount * configRate),
        status: 'active',
        profit: 0,
        term: term,
        periods: periods,
        start_date: startDate,
        end_date: endDate,
        product_log: {
          data: product_doc,
        },
      },
    })
  }
  const expectedReturnValue = await formData.expected_return

  const contract_doc = await payload.create({
    collection: 'contracts',
    data: {
      user: Number(userId),
      amount: Number(amount),
      balance: Number(amount),
      expected_return: expectedReturnValue,
      status: 'active',
      term: product_doc.term,
      profit: 0,
      start_date: startDate,
      end_date: endDate,
      product_log: {
        data: product_doc,
      },
    },
  })

  return {
    isSuccess: true,
    msg: 'deal_success',
    data: {
      transaction: transaction_doc,
      contract: contract_doc,
      product: product_doc,
    },
  }
}

export const getTotalBonusByProduct = async (
  product_id: number,
  user_id: number,
): Promise<number> => {
  let total = 0

  const account_id = await getAccountIdInvestmentByUser(user_id)

  const res = await payload.find({
    collection: 'transactions',
    where: {
      investment_product: { equals: product_id },
      status: { equals: 'completed' },
      type: { equals: 'bonus' },
      account_to: { equals: account_id },
    },
  })

  if (!res.totalDocs) return 0

  res.docs.forEach((t: any) => {
    total += t.amount
  })

  return total
}

export const getTransactionsBonusByProduct = async (
  product_id: number,
  user_id: number,
): Promise<any[]> => {
  let total = 0

  const account_id = await getAccountIdInvestmentByUser(user_id)

  const res = await payload.find({
    collection: 'transactions',
    where: {
      investment_product: { equals: product_id },
      status: { equals: 'completed' },
      type: { equals: 'bonus' },
      account_to: { equals: account_id },
    },
  })

  if (!res.totalDocs) return []

  return res.docs
}

export const getTotalDeposit = async (user_id: number): Promise<number> => {
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

// -- 01JAN2025 Update --

// -- -- Pending Transaction -- --
export const createDeposit = async (inputData: any) => {
  // validate: is approve pending deposit ?
  const { amount, user_id, account_to, deposit_screenshot, payment_method } = inputData

  // Validate
  if (!amount) {
    return {
      isSuccess: false,
      msg: 'amount_empty',
      data: {},
    }
  }

  const response = await payload.create({
    collection: 'transactions',
    data: {
      user: Number(user_id),
      amount: Number(amount),
      status: 'pending',
      account_to: account_to,
      type: 'deposit',
      deposit_screenshot: deposit_screenshot,
      payment_method: payment_method,
    },
  })

  if (!response) {
    return {
      isSuccess: false,
      msg: 'deposit_fail',
      data: {},
    }
  }

  return {
    isSuccess: true,
    msg: 'deposit_successs',
    data: response,
  }
}

// -- -- Pending Transaction -- --
export const createWithdrawal = async (inputData: any) => {
  // validate: is approve pending deposit ?
  const { amount, user_id, account_from, bank_id } = inputData

  // Validate
  if (!amount) {
    return {
      isSuccess: false,
      msg: 'amount_empty',
      data: {},
    }
  }

  const amountAvailable = await getSumAmountBalanceByAccount(account_from)
  if (amountAvailable >= amount) {
    const response = await payload.create({
      collection: 'transactions',
      data: {
        user: Number(user_id), // User Created
        amount: Number(amount),
        status: 'pending',
        account_from: account_from,
        bank: Number(bank_id),
        type: 'withdraw',
      },
    })

    if (!response) {
      return {
        isSuccess: false,
        msg: 'withdraw_fail',
        data: {},
      }
    }

    return {
      isSuccess: true,
      msg: 'withdraw_success',
      data: response,
    }
  } else {
    return {
      isSuccess: false,
      msg: 'main_not_enough',
      data: {},
    }
  }
}

// -- -- Pending Transaction -- --
export const createTransfer = async (inputData: any) => {
  // validate: is approve pending deposit ?
  const { amount, user_id, account_from, account_to } = inputData

  // Validate
  if (!amount) {
    return {
      isSuccess: false,
      msg: 'amount_empty',
      data: {},
    }
  }

  const response = await payload.create({
    collection: 'transactions',
    data: {
      user: Number(user_id), // User Created
      amount: Number(amount),
      status: 'completed',
      account_from: Number(account_from),
      account_to: Number(account_to),
      type: 'transfer', // Owner Transfer
    },
  })

  if (!response) {
    return {
      isSuccess: false,
      msg: 'transfer_failed',
      data: {},
    }
  }

  return {
    isSuccess: true,
    msg: 'transfer_success',
    data: response,
  }
}

export const getSumAmountAccountFrom = async (account_from: number) => {
  const transactions = await payload.find({
    collection: 'transactions',
    where: {
      OR: [
        {
          status: { equals: 'completed' },
          account_from: { equals: account_from },
        },
        {
          status: { equals: 'pending' },
          account_from: { equals: account_from },
        },
      ],
    },
  })

  if (!transactions.totalDocs) return 0

  let total = 0
  transactions.docs.forEach((t: any) => {
    total += t.amount
  })

  return total
}

export const getSumAmountAccountTo = async (account_to: number) => {
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

// Amount Balance = Sum(account_to) - Sum(account_from)
export const getSumAmountBalanceByAccount = async (account_id: number) => {
  const sumIn = await getSumAmountAccountTo(account_id)
  const sumOut = await getSumAmountAccountFrom(account_id)
  return sumIn - sumOut
}
