'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatDateTime } from '@/utilities/formatDateTime'

interface Withdrawal {
  id: string
  productName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  message: string
  note: string
}

export const getContractsByUser = async (
  userId: number,
  page: number,
  limit: number,
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.find({
      collection: 'contracts',
      where: {
        user: { equals: userId },
      },
      page, // Pass the page number
      limit, // Pass the number of items per page
    })
    const contracts = response.docs
    return {
      docs: contracts.map((contract: any) => ({
        id: contract.id,
        userId: contract.user.id,
        minInvestment: contract?.product_log?.min_investment,
        productName: contract?.product_log?.data?.product_name,
        investedAmount: contract.amount,
        expectedReturn: contract.expected_return,
        availableBalance: Number(contract.balance),
        term: contract.term,
        periods: contract.periods,
        profit: contract.profit,
        rateOfReturn: contract?.product_log?.data?.rate_of_return,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
        extendContract: contract.extend_contract,
        setting: contract.config_log,
        lastWithdrawal: contract.updatedAt || null,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Transaction error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getContractsWithDateByUser = async (
  userId: number,
  page: number,
  limit: number,
  startDateFilter: string,
  endDateFilter: string,
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const query = {
      user: { equals: userId },
      start_date: {
        greater_than_equal: startDateFilter,
        less_than_equal: endDateFilter,
      },
    }
    const response = await payload.find({
      collection: 'contracts',
      where: { ...query },
      page, // Pass the page number
      limit, // Pass the number of items per page
    })
    const contracts = response.docs

    return {
      docs: contracts.map((contract: any) => ({
        id: contract.id,
        userId: contract.user.id,
        minInvestment: contract?.product_log?.min_investment,
        productName: contract?.product_log?.data?.product_name,
        investedAmount: contract.amount,
        expectedReturn: contract.expected_return,
        availableBalance: Number(contract.balance),
        term: contract.term,
        periods: contract.periods,
        profit: contract.profit,
        rateOfReturn: contract?.product_log?.rate_of_return,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
        extendContract: contract.extend_contract,
        setting: contract.config_log,
        lastWithdrawal: contract.updatedAt || null,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Transaction error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getWithdrawalsByUser = async (
  userId: number,
  page: number,
  limit: number,
): Promise<{ docs: Withdrawal[]; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })

    const response = await payload.find({
      collection: 'withdrawals',
      where: {
        user: { equals: userId },
      },
      page, // Pass the page number
      limit, // Pass the number of items per page
    })

    const withdrawals = response.docs
    return {
      docs: withdrawals.map((withdrawal: any) => ({
        id: withdrawal.id,
        productName: withdrawal.contract?.product_log?.data?.product_name,
        amount: withdrawal.amount,
        date: withdrawal.createdAt,
        status: withdrawal.status,
        message: withdrawal.message,
        note: withdrawal.note,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Withdraw error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getWithdrawalsWithDateByUser = async (
  userId: number,
  page: number,
  limit: number,
  startDateFilter: string,
  endDateFilter: string,
): Promise<{ docs: Withdrawal[]; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    
    const query = {
      user: { equals: userId },
      createdAt: {
        greater_than_equal: startDateFilter,
        less_than_equal: endDateFilter,
      },
    }

    const response = await payload.find({
      collection: 'withdrawals',
      where: { ...query },
      page, // Pass the page number
      limit, // Pass the number of items per page
    })

    const withdrawals = response.docs

    return {
      docs: withdrawals.map((withdrawal: any) => ({
        id: withdrawal.id,
        productName: withdrawal.contract?.product_log?.name,
        amount: withdrawal.amount,
        date: withdrawal.createdAt,
        status: withdrawal.status,
        message: withdrawal.message,
        note: withdrawal.note,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Withdraw error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getTransactionsByUser = async (
  userId: number,
  page: number,
  limit: number,
  activeTab: string, // Added activeTab parameter
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    // Construct the where condition dynamically
    const whereCondition: any = {
      user: { equals: userId },
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
        note: transaction?.note,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Transaction error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getTransactionsWithDateByUser = async (
  userId: number,
  page: number,
  limit: number,
  activeTab: string, // Added activeTab parameter
  startDate: string,
  endDate: string,
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    // Construct the where condition dynamically
    const whereCondition: any = {
      user: { equals: userId },
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
        message: transaction?.message,
        note: transaction?.note,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Transaction error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getTotalBonusByUser = async (
  userId: number,
) => {
  try {
    const payload = await getPayload({
      config,
    })
    // Construct the where condition dynamically
    const whereCondition: any = {
      user: { equals: userId },
    }
    whereCondition.type = { equals: 'bonus' }

    // Make a single call to payload.find
    const response = await payload.find({
      collection: 'transactions',
      where: whereCondition
    })
    const transactions = response.docs
    const totalBonus = transactions.reduce((sum, inv) => sum + inv.amount, 0)
    return totalBonus
  } catch (error) {
    console.error('Total bonus error:', error)
    return 0
  }
}

