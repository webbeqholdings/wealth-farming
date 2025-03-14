'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatDateTime } from '@/utilities/formatDateTime'

export const getUsers = async (): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.find({
      collection: 'users',
      where: {
        role: { not_equals: "admin" },
      }
    })
    const users = response.docs
    return {
      docs: users.map((user: any) => ({
        id: user.id,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        companyName: user.company_name,
        phone: user.phone_contact,
        email: user.email,
        createdAt: user.created_at
        
      }))
    }
  } catch (error) {
    console.error('Contract error:', error)

    return { docs: [] }
  }
}

export const getUserById = async (userId: number): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.findByID({
      collection: 'users',
      id: userId
    })
    const user = response
    return {
      docs: {
        id: user.id,
        role: user.role,
        firstName: user.first_name,
        lastName: user.last_name,
        companyName: user.company_name,
        phone: user.phone_contact,
        email: user.email,
        createdAt: user.createdAt
      }
    }
  } catch (error) {
    console.error('User error:', error)

    return { docs: null}
  }
}

export const getContractsByUser = async (
  userId: number
): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.find({
      collection: 'contracts',
      where: {
        user: { equals: userId },
      }
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
      }))
    }
  } catch (error) {
    console.error('Contract error:', error)

    return { docs: [] }
  }
}

export const getContractById = async (
  contractId: number
): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.findByID({
      collection: 'contracts',
      id: contractId
    })
    const contract = response
    return {
      docs: {
        id: contract.id,
        // userId: contract.user.id,
        // minInvestment: contract?.product_log?.min_investment,
        // productName: contract?.product_log?.data?.product_name,
        investedAmount: contract.amount,
        expectedReturn: contract.expected_return,
        availableBalance: Number(contract.balance),
        term: contract.term,
        periods: contract.periods,
        profit: contract.profit,
        // rateOfReturn: contract?.product_log?.data?.rate_of_return,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
        // extendContract: contract.extend_contract,
        setting: contract.config_log,
        lastWithdrawal: contract.updatedAt || null,
      }
    }
  } catch (error) {
    console.error('Contract error:', error)

    return { docs: null }
  }
}

export const getTransactionsByUser = async (
  userId: number
): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    // Construct the where condition dynamically
    const whereCondition: any = {
      user: { equals: userId },
    }
    // if (activeTab !== 'all') {
    //   whereCondition.type = { equals: activeTab } // Add type filter only if activeTab is not 'all'
    // }

    // Make a single call to payload.find
    const response = await payload.find({
      collection: 'transactions',
      where: whereCondition
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
      }))
    }
  } catch (error) {
    console.error('Transaction error:', error)

    return { docs: [] }
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

