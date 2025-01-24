'use server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { headers as nextHeaders } from 'next/headers'
import { getCurrentLevelRate, getParentIdByUser } from './referrals'
import { getAccountsByUserId } from './account'
import { getTotalDeposit } from './transaction'
import { getReferralProducts } from './investment-products/dynamicFundQuery'

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
    if (!auth.user) {
      return
    }
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
    if (!auth.user) {
      return
    }
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
    if (!auth.user) {
      return
    }
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
    const note = formData.note
    const image = formData.image

    const response = await payload.create({
      collection: 'withdrawals',
      data: {
        contract: Number(contractId),
        user: Number(userId),
        amount: Number(amount),
        status: 'pending',
        ...(note && { note }),
        ...(image && { image }),
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

export async function checkContractLarger90Days() {
  try {
    const payload = await getPayload({
      config,
    })
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })
    if (!auth.user) {
      return
    }
    var test_data = false

    // Check active contract
    const query_activeContract = {
      user: { equals: auth.user.id },
      status: { equals: 'active' },
    }
    const response_activeContract = await payload.find({
      collection: 'contracts',
      where: { ...query_activeContract },
      sort: 'start_date',
      limit: 10000,
    })
    response_activeContract.docs.forEach((element) => {
      const constract_date = new Date(element.start_date)
      const return_date = new Date(
        constract_date.getFullYear(),
        constract_date.getMonth(),
        constract_date.getDate() + 90,
      )
      const today = new Date()
      if (return_date <= today == true) {
        test_data = true
        return true
      }
    })

    if (test_data) {
      return true
    }

    // Check inactive contract
    const query_inactiveContract = {
      user: { equals: auth.user.id },
      'contract.status': { not_equals: 'active' },
    }
    const response_inactiveContract = await payload.find({
      collection: 'withdrawals',
      where: { ...query_inactiveContract },
      sort: 'createdAt',
      limit: 10000,
    })

    response_inactiveContract.docs.forEach((element) => {
      if (typeof element.contract !== 'number') {
        const constract_start_date = new Date(element.contract.start_date)
        const return_date = new Date(
          constract_start_date.getFullYear(),
          constract_start_date.getMonth(),
          constract_start_date.getDate() + 90,
        )
        const constract_termination_date = new Date(element.createdAt)
        if (return_date <= constract_termination_date == true) {
          test_data = true
          return true
        }
      }
    })
    return test_data
  } catch (erorr) {
    console.error(erorr)
  }
}
