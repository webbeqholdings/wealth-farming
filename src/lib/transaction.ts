'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { formatDateTime } from '@/utilities/formatDateTime'
import { getBalanceFromAccount, getAccountIdInvestmentByUser } from './account'

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

export async function createTransactionInvestment(formData: any) {
  try {
    const amount = formData.amount
    const term = formData.term
    const startDate = formData.startDate
    const endDate = formData.endDate
    const periods = formData.periods
    const expectedReturn = formData.expectedReturn
    const productName = formData.productName
    let response;

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

    // user referrals
    const userReferral = await payload.find({
      collection: 'user-referrals',
      where: {
        child: { equals: auth.user.id },
      },
    })
    const product = await payload.findByID({
      collection: 'investment-products',
      id: Number(investmentProduct.docs[0].id),
    })
    if (typeof userReferral.docs[0]?.parent === 'object' && userReferral.docs[0]?.parent !== null) {
      response = await payload.create({
        collection: 'contracts',
        data: {
          user: userReferral.docs[0].parent.id,
          amount: Number(amount * 0.03),
          balance: Number(amount * 0.03),
          status: 'active',
          profit: 0,
          term: term,
          periods: periods,
          start_date: startDate,
          end_date: endDate,
          product_log: {
            name: product.product_name,
            min_investment: product.min_investment,
            rate_of_return: product.rate_of_return,
          },
        },
      })
    }
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
          name: product.product_name,
          min_investment: product.min_investment,
          rate_of_return: product.rate_of_return,
        },
      },
    })

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
