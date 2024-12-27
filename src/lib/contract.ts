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


export const getContracts = async (page: number, limit: number): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
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

    return {
      docs: contracts.map((contract: any) => ({
        id: contract.id,
        userId: contract.user.id,
        minInvestment: contract.product_log?.min_investment,
        productName: contract.product_log?.name,
        investedAmount: contract.amount,
        expectedReturn: contract.expected_return,
        availableBalance: Number(contract.balance),
        term: contract.term,
        periods: contract.periods,
        profit: contract.profit,
        rateOfReturn: contract.product_log.rate_of_return,
        startDate: contract.start_date,
        endDate: contract.end_date,
        status: contract.status,
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


export const getWithdrawals = async (page: number, limit: number): Promise<{ docs: Withdrawal[]; totalPages: number; totalDocs: number }> => {
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

    return {
      docs: withdrawals.map((withdrawal: any) => ({
        id: withdrawal.id,
        productName: withdrawal.contract.product_log?.name,
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


export async function withdrawInvestment(formData: FormData) {
  try {
    const payload = await getPayload({
      config,
    });
    const amount = Number(formData.get('amount'))
    const contractId = Number(formData.get('contractId'))
    const userId = Number(formData.get('userId'))

    const response = await payload.create({
      collection: 'withdrawals',
      data: {
        contract: contractId,
        user: userId,
        amount: amount,
        status: 'pending',
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