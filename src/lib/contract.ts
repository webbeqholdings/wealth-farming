'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'

interface Withdrawal {
  id: string
  productName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  message: string
}

interface ProductLog {
  data: {
    product_name?: string
  }
}

interface EligibleContract {
  productName: string
  eligible: boolean
}

export const getContracts = async (
  page: number,
  limit: number,
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })
    const response = await payload.find({
      collection: 'contracts',
      where: {
        user: { equals: auth.user.id },
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

export const getContractsWithDate = async (
  page: number,
  limit: number,
  startDateFilter: string,
  endDateFilter: string,
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })
    const query = {
      user: { equals: auth.user.id },
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

export const getWithdrawals = async (
  page: number,
  limit: number,
): Promise<{ docs: Withdrawal[]; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })

    const response = await payload.find({
      collection: 'withdrawals',
      where: {
        user: { equals: auth.user.id },
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
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Withdraw error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export const getWithdrawalsWithDate = async (
  page: number,
  limit: number,
  startDateFilter: string,
  endDateFilter: string,
): Promise<{ docs: Withdrawal[]; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })

    const query = {
      user: { equals: auth.user.id },
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
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    }
  } catch (error) {
    console.error('Withdraw error:', error)

    return { docs: [], totalPages: 0, totalDocs: 0 }
  }
}

export async function withdrawInvestment(formData: any) {
  try {
    const payload = await getPayload({
      config,
    })
    const amount = formData.amount
    const contractId = formData.contractId
    const userId = formData.userId
    const response = await payload.create({
      collection: 'withdrawals',
      data: {
        contract: Number(contractId),
        user: Number(userId),
        amount: Number(amount),
        status: 'pending',
      },
    })

    const contract = await payload.findByID({
      collection: 'contracts',
      id: contractId,
    })

    // Update contract based on withdrawal amount
    if (amount < Number(contract.balance) && amount <= contract.profit) {
      await payload.update({
        collection: 'contracts',
        id: contractId,
        data: {
          profit: contract.profit - amount,
          balance: Number(contract.balance) - amount,
        },
      })
    } else if (amount <= Number(contract.balance)) {
      await payload.update({
        collection: 'contracts',
        id: contractId,
        data: {
          status: 'inactive',
          balance: 0,
          profit: 0,
        },
      })
    } else {
      throw new Error('Invalid withdrawal amount. Amount exceeds available balance or profit.')
    }
    // Simulate API call delay
    return {
      success: true,
      data: response,
      message: `Successfully initiated withdrawal of ${amount} from contract ${contractId}`,
    }
  } catch (error) {
    return {
      success: false,
      message: `${error}`,
    }
  }
}

export async function updateSetting(formData: any) {
  try {
    const payload = await getPayload({
      config,
    })
    const response = await payload.update({
      collection: 'contracts',
      id: formData.id,
      data: {
        config_log: formData.setting ?? {},
      },
    })
    // Simulate API call delay
    return {
      success: true,
      data: response,
      message: `update Setting Successfully`,
    }
  } catch (error) {
    return {
      success: false,
      message: `${error}`,
    }
  }
}

export const getEligibleContracts = async (): Promise<{ docs: EligibleContract[] }> => {
  try {
    const payload = await getPayload({
      config,
    })
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })

    const response = await payload.find({
      collection: 'contracts',
      where: {
        user: { equals: auth.user.id },
      },
    })

    const contracts = response.docs
    const today = new Date()

    const eligibleContracts = contracts
      .filter((contract) => {
        const startDate = new Date(contract.start_date)
        let daysDifference

        if (contract.status === 'active') {
          daysDifference = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 3600 * 24))
        } else if (contract.status === 'closed') {
          const endDate = new Date(contract.end_date)
          daysDifference = Math.floor(
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24),
          )
        }

        return daysDifference >= 90
      })
      .map((contract) => {
        const productLog = contract.product_log
        if (
          productLog &&
          typeof productLog === 'object' &&
          'data' in productLog &&
          typeof productLog.data === 'object'
        ) {
          const productName = (productLog.data as { product_name?: string })?.product_name
          return {
            productName,
            eligible: true,
          }
        }
      })

    return { docs: eligibleContracts }
  } catch (error) {
    console.error('Error fetching eligible contracts:', error)
    return { docs: [] }
  }
}
