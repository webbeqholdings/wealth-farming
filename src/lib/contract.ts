'use server'
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as nextHeaders } from 'next/headers'
// Define the Investment interface
interface Investment {
  id: string;
  userId: string;
  productName: string;
  investedAmount: number;
  minInvestment: number;
  expectedReturn: number;
  availableBalance: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending';
  lastWithdrawal?: string;
}

interface Withdrawal {
  id: string
  productName: string
  amount: number
  date: string
  status: 'completed' | 'pending' | 'failed'
}


// Update the function to always return a Promise<Investment[]>
export const getContracts = async (): Promise<Investment[]> => {
  try {
    const payload = await getPayload({
      config,
    });
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })
    const response = await payload.find({
      collection: 'contracts',
      where: {
        user: { equals: auth.user.id },
      },
    });

    const contracts = response.docs;
    // Map the contracts to the Investment interface
    return contracts.map((contract: any) => ({
      id: contract.id,
      userId: contract.user.id,
      minInvestment: contract.product_log?.min_investment,
      productName: contract.product_log?.product_name,
      investedAmount: contract.amount,
      expectedReturn: contract.product_log?.expected_return,
      availableBalance: contract.balance,
      startDate: contract.start_date,
      endDate: contract.end_date,
      status: contract.status,
      lastWithdrawal: contract.updatedAt || null,
    }));
  } catch (error) {
    console.error('Transaction error:', error);

    // Return an empty array in case of an error
    return [];
  }
};

export async function getWithdrawals(): Promise<Withdrawal[]> {
  try {
    const payload = await getPayload({
      config,
    });
    const headers = await nextHeaders()
    const auth = await payload.auth({ headers })
    const response = await payload.find({
      collection: 'withdrawals',
      where: {
        user: { equals: auth.user.id },
      },
    });

    const withdrawals = response.docs;

    // Map the contracts to the Investment interface
    return withdrawals.map((withdrawl: any) => ({
      id: withdrawl.id,
      productName: withdrawl.contract.product_log.product_name,
      amount: withdrawl.amount,
      date: withdrawl.createdAt,
      status: withdrawl.status
    }));
  } catch (error) {
    console.error('Withdraw error:', error);

    // Return an empty array in case of an error
    return [];
  }
}

export async function withdrawInvestment(formData: FormData) {
  try {
    const payload = await getPayload({
      config,
    });
    const amount = formData.get('amount')
    const contractId = formData.get('contractId')
    const userId = formData.get('userId')


    const response = await payload.create({
      collection: 'withdrawals',
      data: {
        contract: Number(contractId),
        user: Number(userId),
        amount: Number(amount),
        status: 'pending'
      },
    })
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