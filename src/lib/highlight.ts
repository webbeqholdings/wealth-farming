'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { formatDateTime } from '@/utilities/formatDateTime'

interface ProductLogData {
  term: string;
  product_name: string;
  min_investment: number;
  rate_of_return: number;
  // other properties...
}

interface ProductLog {
  data: ProductLogData;
  // other properties...
}

interface Contract {
  id: number;
  user: number ;
  amount: number;
  status: string;
  balance: number;
  profit: number;
  expectedReturn: number;
  term: string;
  periods: number;
  product_log: ProductLog;

}

export const getUsers = async (): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.find({
      collection: 'users',
      limit: 0,
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
        createdAt: user.createdAt
        
      }))
    }
  } catch (error) {
    console.error('Contract error:', error)

    return { docs: [] }
  }
}

export const getUser = async (userId: number): Promise<{ docs: any }> => {
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

export const getContracts = async (): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.find({
      collection: 'contracts',
      limit: 0,
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

export const getContractsByUser = async (
  userId: number
): Promise<{ docs: any }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.find({
      collection: 'contracts',
      limit: 0,
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

export const getContract = async (
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
        userId: (contract?.user as any)?.id,
        // minInvestment: contract?.product_log?.min_investment,
        // productName: contract?.product_log?.data?.product_name,
        productName: (contract?.product_log as any)?.data?.product_name,
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

export const getContractsCountByUser = async (userId: number) => {
  try {
   
    const { docs } = await getContractsByUser(userId)

    return docs.length
  } catch (error) {
    console.error('Contract error:', error)

    return 0
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
      limit: 0,
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

export const getTotalInvestment = async () => {
  try {
    const { docs } = await getContracts()
    const totalInvestment = docs.reduce((sum: number, inv: any) => sum + inv.investedAmount, 0)
    return totalInvestment
  } catch (error) {
    console.error('Total Invesment error:', error)
    return 0
  }
}

export const getTotalInvestmentByUser = async (userId: number) => {
  try {
    const { docs } = await getContractsByUser(userId)
    const totalInvestmentByUser = docs.reduce((sum: number, inv: any) => sum + inv.investedAmount, 0)
    return totalInvestmentByUser
  } catch (error) {
    console.error('Total Invesment By User error:', error)
    return 0
  }
}

export const getTotalWithdrawByUser = async (userId: number) => {
  try {
    const payload = await getPayload({
      config,
    })
    // Construct the where condition dynamically
    const whereCondition: any = {
      user: { equals: userId },
      type: { equals: "withdraw" }
    }

    // Make a single call to payload.find
    const response = await payload.find({
      collection: 'transactions',
      limit: 0,
      where: whereCondition
    })
    const transactions = response.docs
    const totalWithdrawByUser = transactions.reduce((sum: number, inv: any) => sum + inv.amount, 0)
    return totalWithdrawByUser
  } catch (error) {
    console.error('Total Invesment By User error:', error)
    return 0
  }
}

export const getUsersCount = async () => {
  try {
    const { docs } = await getUsers()
    const usersCount = docs.length
    return usersCount
  } catch (error) {
    console.error('User Count error:', error)
    return 0
  }
}

export const getActiveContractsCount = async () => {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.find({
      collection: 'contracts',
      limit: 0,
      where: {
        status: { equals: "active" }
      }
    })
    const contracts = response.docs
    const contractsCount = contracts.length
    return contractsCount
  } catch (error) {
    console.error('Contracts Count error:', error)
    return 0
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
      limit: 0,
      where: whereCondition
    })
    const transactions = response.docs
    const totalBonusByUser = transactions.reduce((sum, inv) => sum + inv.amount, 0)
    return totalBonusByUser
  } catch (error) {
    console.error('Total bonus error:', error)
    return 0
  }
}

