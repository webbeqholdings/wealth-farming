'use server'
import { getPayload } from 'payload';
import config from '@payload-config';
import { headers as nextHeaders } from 'next/headers';
import { formatDateTime } from '@/utilities/formatDateTime';

export const getTransactions = async (
    page: number,
    limit: number,
    activeTab: string // Added activeTab parameter
): Promise<{ docs: any; totalPages: number; totalDocs: number }> => {
    try {
        const payload = await getPayload({
            config,
        });
        const headers = await nextHeaders();
        const auth = await payload.auth({ headers });
        // Construct the where condition dynamically
        const whereCondition: any = {
            user: { equals: auth.user.id },
        };

        if (activeTab !== 'all') {
            whereCondition.type = { equals: activeTab }; // Add type filter only if activeTab is not 'all'
        }

        // Make a single call to payload.find
        const response = await payload.find({
            collection: 'transactions',
            where: whereCondition,
            page, // Pass the page number
            limit, // Pass the number of items per page
        });
        const transactions = response.docs;

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
        };
    } catch (error) {
        console.error('Transaction error:', error);

        return { docs: [], totalPages: 0, totalDocs: 0 };
    }
};
