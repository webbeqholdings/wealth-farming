'use server'
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as nextHeaders } from 'next/headers'

interface Withdrawal {
  id: string
  productName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  message: string
}

const findFirstEligibleContract = (contracts: any[], today: Date) => {

  for (let i = 0; i < contracts.length; i++) {
    const contract = contracts[i];
    const timeElapsed = today.getTime() - new Date(contract.start_date).getTime();
    if (timeElapsed > 90 * 24 * 60 * 60 * 1000 && contract.status == 'active') {
      return contract; 
    }
  }

  return null; // No eligible contract found
};

export const getContracts = async (page: number, limit: number): Promise<{ docs: any; totalPages: number; totalDocs: number; contractWithMinDate: any}> => {
  try {
    const payload = await getPayload({
      config,
    });
    const headers = await nextHeaders();
    const auth = await payload.auth({ headers });
    const response = await payload.find({
      collection: 'contracts',
      where: {
        user: { equals: auth.user.id },
      },
      page, // Pass the page number
      limit, // Pass the number of items per page
    });
    const contracts = response.docs;
    const contractWithMinStartDate = findFirstEligibleContract(contracts, new Date())

    return {
      docs: contracts.map((contract: any) => ({
        id: contract.id,
        userId: contract.user.id,
        minInvestment: contract?.product_log?.min_investment,
        productName: contract?.product_log?.name,
        investedAmount: contract.amount,
        expectedReturn: contract.expected_return,
        availableBalance: Number(contract.balance),
        term: contract.term,
        periods: contract.periods,
        profit: contract.profit,
        rateOfReturn: contract?.product_log.rate_of_return,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
        extendContract: contract.extend_contract,
        setting: contract.config_log,
        lastWithdrawal: contract.updatedAt || null,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
      contractWithMinDate: contractWithMinStartDate,
    };
  } catch (error) {
    console.error('Transaction error:', error);

    return { docs: [], totalPages: 0, totalDocs: 0, contractWithMinDate: null };
  }
};

export const getContractsWithDate = async (
  page: number, limit: number, startDateFilter: string, endDateFilter: string
  ): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    });
    const headers = await nextHeaders();
    const auth = await payload.auth({ headers });
    const query = {
      user: {equals: auth.user.id},
      start_date: {
        greater_than_equal: startDateFilter,
        less_than_equal: endDateFilter,
      },
    }
    const response = await payload.find({
      collection: 'contracts',
      where: { ...query, },
      page, // Pass the page number
      limit, // Pass the number of items per page
    });
    const contracts = response.docs;

    return {
      docs: contracts.map((contract: any) => ({
        id: contract.id,
        userId: contract.user.id,
        minInvestment: contract?.product_log?.min_investment,
        productName: contract?.product_log?.name,
        investedAmount: contract.amount,
        expectedReturn: contract.expected_return,
        availableBalance: Number(contract.balance),
        term: contract.term,
        periods: contract.periods,
        profit: contract.profit,
        rateOfReturn: contract?.product_log.rate_of_return,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
        extendContract: contract.extend_contract,
        setting: contract.config_log,
        lastWithdrawal: contract.updatedAt || null,
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    };
  } catch (error) {
    console.error('Transaction error:', error);

    return { docs: [], totalPages: 0, totalDocs: 0 };
  }
};


const findFirstEligibleWithdraw = (withdrawals: any[], today: Date) => {
  for (let i = 0; i < withdrawals.length; i++) {
    const withdrawal = withdrawals[i];
    const timeElapsedComplete = new Date(withdrawal.createdAt).getTime() - new Date(withdrawal.contract.start_date).getTime();
    const timeElapsedPending = today.getTime() - new Date(withdrawal.contract.start_date).getTime();
    if (timeElapsedComplete > 90 * 24 * 60 * 60 * 1000 && withdrawal.status == 'completed') {
      return withdrawal; 
    }
    else if (timeElapsedPending > 90 * 24 * 60 * 60 * 1000 && withdrawal.status == 'pending') {
      return withdrawal; 
    }
  }
  return null; // No eligible contract found
};

export const getWithdrawals = async (page: number, limit: number): Promise<{ docs: Withdrawal[]; totalPages: number; totalDocs: number; withdrawWithMinDate: any }> => {
  try {
    const payload = await getPayload({
      config,
    });
    const headers = await nextHeaders();
    const auth = await payload.auth({ headers });

    const response = await payload.find({
      collection: 'withdrawals',
      where: {
        user: { equals: auth.user.id },
      },
      page, // Pass the page number
      limit, // Pass the number of items per page
    });

    const withdrawals = response.docs;

    // Find the contract with the minimum start_date
    const withdrawWithMinStartDate = findFirstEligibleWithdraw(withdrawals, new Date())

    return {
      docs: withdrawals.map((withdrawal: any) => ({
        id: withdrawal.id,
        productName: withdrawal.contract?.product_log?.name,
        amount: withdrawal.amount,
        date: withdrawal.createdAt,
        status: withdrawal.status,
        message: withdrawal.message
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
      withdrawWithMinDate: withdrawWithMinStartDate,
    };
  } catch (error) {
    console.error('Withdraw error:', error);

    return { docs: [], totalPages: 0, totalDocs: 0, withdrawWithMinDate: null};
  }
};

export const getWithdrawalsWithDate = async (
  page: number, limit: number, startDateFilter: string, endDateFilter: string
  ): Promise<{ docs: Withdrawal[]; totalPages: number; totalDocs: number }> => {
  try {
    const payload = await getPayload({
      config,
    });
    const headers = await nextHeaders();
    const auth = await payload.auth({ headers });

    const query = {
      user: { equals: auth.user.id },
      createdAt:  {
        greater_than_equal: startDateFilter,
        less_than_equal: endDateFilter,
      }
    }

    const response = await payload.find({
      collection: 'withdrawals',
      where: {...query},
      page, // Pass the page number
      limit, // Pass the number of items per page
    });

    const withdrawals = response.docs;

    return {
      docs: withdrawals.map((withdrawal: any) => ({
        id: withdrawal.id,
        productName: withdrawal.contract?.product_log?.name,
        amount: withdrawal.amount,
        date: withdrawal.createdAt,
        status: withdrawal.status,
        message: withdrawal.message
      })),
      totalPages: response.totalPages,
      totalDocs: response.totalDocs,
    };
  } catch (error) {
    console.error('Withdraw error:', error);

    return { docs: [], totalPages: 0, totalDocs: 0 };
  }
};


export async function withdrawInvestment(formData: any) {
  try {
    const payload = await getPayload({
      config,
    });
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
        ...(image && { image })
      },
    })

    const contract = await payload.findByID({
      collection: 'contracts',
      id: contractId
    })

    // Update contract based on withdrawal amount
    if (amount < Number(contract.balance) && amount <= contract.profit) {
      await payload.update({
        collection: 'contracts',
        id: contractId,
        data: {
          profit: contract.profit - amount,
          balance: Number(contract.balance) - amount
        },
      });
    } else if (amount <= Number(contract.balance)) {
      await payload.update({
        collection: 'contracts',
        id: contractId,
        data: {
          status: 'inactive',
          balance: 0,
          profit: 0,
        },
      });
    } else {
      throw new Error('Invalid withdrawal amount. Amount exceeds available balance or profit.');
    }
    // Simulate API call delay
    return {
      success: true,
      data: response,
      message: `Successfully initiated withdrawal of ${amount} from contract ${contractId}`
    }
  } catch (error) {
    return {
      success: false,
      message: `${error}`
    }
  }
}

export async function updateSetting(formData: any) {
  try {
    const payload = await getPayload({
      config,
    });
    const response = await payload.update({
      collection: 'contracts',
      id: formData.id,
      data: {
        config_log: formData.setting ?? {} 
      },
    });
    // Simulate API call delay
    return {
      success: true,
      data: response,
      message: `update Setting Successfully`
    }
  } catch (error) {
    return {
      success: false,
      message: `${error}`
    }
  }
}
