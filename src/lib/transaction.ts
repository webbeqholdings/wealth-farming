'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getBalanceFromAccount, getAccountIdInvestmentByUser } from './account'
import {
  getEmployeePlusProducts,
  inArrayEmployeePlusUsersIDs,
} from './investment-products/dynamicFundQuery'

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
        account: transaction.from_account?.account_name,
        to_account: transaction.to_account?.account_name,
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
        ...query 
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
        account: transaction.from_account?.account_name,
        to_account: transaction.to_account?.account_name,
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

export async function createTransactionInvestment(formData: any) {
  try {
    // const amount = formData.amount
    // const term = formData.term
    // const startDate = formData.startDate
    // const endDate = formData.endDate
    // const periods = formData.periods
    // const expectedReturn = formData.expectedReturn
    // const productName = formData.productName

    const { amount, term, startDate, endDate, periods, expectedReturn, productName } = formData
    let response

    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })

    const investmentAccount = await payload.find({
      collection: 'accounts',
      where: {
        user: { equals: auth.user.id },
        type: { equals: 'investment' },
      },
    })

    const investmentProduct = await payload.find({
      collection: 'investment-products',
      where: {
        product_name: { equals: productName },
      },
    })

    if (investmentAccount.docs[0].amount < amount) {
      return {
        user: investmentAccount,
        message: 'Amount account investment not enough',
        error: true,
      }
    }

    if (amount < investmentProduct.docs[0].min_investment) {
      return {
        message: 'Amount not allowed investment',
        error: true,
      }
    }

    // Can nhac Account Amount = Query
    const AmountFromAccount = investmentAccount.docs[0].amount - amount
    await payload.update({
      collection: 'accounts',
      id: investmentAccount.docs[0].id,
      data: { amount: AmountFromAccount },
    })

    await payload.create({
      collection: 'transactions',
      data: {
        user: Number(auth.user.id),
        amount: Number(amount),
        investment_product: investmentProduct.docs[0].id
          ? Number(investmentProduct.docs[0].id)
          : undefined,
        status: 'completed',
        from_account: investmentAccount.docs[0].id,
        type: 'investment',
      },
    })

    const product = await payload.findByID({
      collection: 'investment-products',
      id: Number(investmentProduct.docs[0].id),
    })

    response = await payload.create({
      collection: 'contracts',
      data: {
        user: auth.user.id,
        amount: Number(amount),
        balance: Number(amount),
        expected_return: expectedReturn,
        status: 'active',
        term: term,
        profit: 0,
        periods: periods,
        start_date: startDate,
        end_date: endDate,
        product_log: {
          data: product,
        },
      },
    })

    // Update for Employee
    if (inArrayEmployeePlusUsersIDs(auth.user.id)) {
      const employeeProducts = await getEmployeePlusProducts()
      const employeeProduct = employeeProducts.filter((prod: any) => {
        return prod == investmentProduct.docs[0].term
      })[0]

      await payload.create({
        collection: 'transactions',
        data: {
          user: Number(auth.user.id),
          amount: Number(amount),
          investment_product: (employeeProduct as { id: number })?.id
            ? Number((employeeProduct as { id: number }).id)
            : null,
          status: 'completed',
          from_account: investmentAccount.docs[0].id,
          type: 'investment',
        },
      })
    }

    return {
      data: response,
      message: 'Investment Successfully',
      status: 200,
    }
  } catch (error) {
    console.error('Transaction error:', error)
    return {
      message: 'Internal server error',
      status: 500,
    }
  }
}

export const IsInvest = async (user_id: number): Promise<Boolean> => {
  const account_id = await getAccountIdInvestmentByUser(user_id)

  const res = await payload.find({
    collection: 'transactions',
    where: {
      type: { equals: 'investment' },
      status: { equals: 'completed' },
      from_account: { equals: account_id },
    },
  })

  return !!res.totalDocs
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
      from_account: { equals: account_id },
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
      from_account: { equals: account_id },
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
  console.log('.. createDeposit', inputData)
  const { amount, user_id, account_to, deposit_screenshot } = inputData

  // Validate
  if (!amount) {
    return {
      isSuccess: false,
      msg: 'Amount Empty',
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
    },
  })

  if (!response) {
    return {
      isSuccess: false,
      msg: 'Deposit Failed',
      data: {},
    }
  }

  return {
    isSuccess: true,
    msg: 'Deposit Success',
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
      msg: 'Amount Empty',
      data: {},
    }
  }

  const response = await payload.create({
    collection: 'transactions',
    data: {
      user: Number(user_id), // User Created
      amount: Number(amount),
      status: 'pending',
      account_from: account_from,
      bank: bank_id,
      type: 'withdraw',
    },
  })

  if (!response) {
    return {
      isSuccess: false,
      msg: 'Withdraw Failed',
      data: {},
    }
  }

  return {
    isSuccess: true,
    msg: 'Withdraw Success',
    data: response,
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
      msg: 'Amount Empty',
      data: {},
    }
  }

  const response = await payload.create({
    collection: 'transactions',
    data: {
      user: Number(user_id), // User Created
      amount: Number(amount),
      status: 'completed',
      account_from: account_from,
      account_to: account_to,
      type: 'transfer', // Owner Transfer
    },
  })

  if (!response) {
    return {
      isSuccess: false,
      msg: 'Transfer Failed',
      data: {},
    }
  }

  return {
    isSuccess: true,
    msg: 'Transfer Success',
    data: response,
  }
}

export const getSumAmountAccountFrom = async (account_from: number) => {
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
