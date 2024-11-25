import type { CollectionConfig } from 'payload';
import { getPayload } from 'payload';
import config from '@payload-config';
import { isAdmin } from '../access/isAdmin';

const InvestmentProfitLoss: CollectionConfig = {
  slug: 'investment-profit-loss',
  access: {
    read: () => true, // Only admins can view
    create: isAdmin, // Only admins can create
    update: isAdmin, // Only admins can update
    delete: isAdmin, // Only admins can delete
  },
  fields: [
    {
      name: 'investment_product',
      type: 'relationship',
      relationTo: 'investment-products',
      label: 'Investment Product',
      required: true,
    },
    {
      name: 'profit_or_loss',
      type: 'number',
      label: 'Profit/Loss Amount',
      required: true,
      admin: {
        description: 'Enter a positive value for profit or a negative value for loss.',
      },
    },
    {
        name: 'unit',
        type: 'relationship',
        relationTo: 'units',
        label: 'Unit',
        required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        placeholder: 'Provide details about this profit or loss record.',
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, operation }) => {
        const payload = await getPayload({
          config,
        });
  
        // Only process if the operation is "create"
        if (operation === 'create') {
          const investmentProductId = doc.investment_product;
          const profitOrLoss = doc.profit_or_loss;
  
          // Fetch the unit information for the investment product
          const unit = await payload.findByID({
            collection: 'units',
            id: doc.unit,
          });
  
          // Fetch all users with completed transactions for the investment product
          const usersTransactions = await payload.find({
            collection: 'transactions',
            where: {
              'investment_product': {
                equals: investmentProductId,
              },
              type: {
                equals: 'investment',
              },
              status: {
                equals: 'completed',
              },
            },
            limit: 1000, // Adjust limit as needed
            sort: '-createdAt', // Sort by creation date descending to get the latest transactions
          });
  
          // Group transactions by user and pick the latest one
          const userLastTransactions = [];
for (const transaction of usersTransactions.docs) {
  const userId = typeof transaction.user === 'number' ? transaction.user : transaction.user.id;
  if (!userLastTransactions[userId]) {
    userLastTransactions[userId] = transaction;
  }
}
          // Create profit/loss transactions for each user's last transaction
          for (const userId in userLastTransactions) {
            const lastTransaction = userLastTransactions[userId];
            const lastTransactionAmount = lastTransaction.amount; // Amount from the user's last transaction
            let calculatedAmount = profitOrLoss;
          
            // If the unit's code is '%', calculate the profit/loss as a percentage of the last transaction amount
            if (unit.unit_code === '%') {
              calculatedAmount = lastTransactionAmount + (lastTransactionAmount * profitOrLoss) / 100;
            }
          
            const bankId = typeof lastTransaction.bank === 'number' 
              ? lastTransaction.bank 
              : lastTransaction.bank?.id;
          
            const fromAccountId = typeof lastTransaction.from_account === 'number' 
              ? lastTransaction.from_account 
              : lastTransaction.from_account?.id;
          
            await payload.create({
              collection: 'transactions',
              data: {
                user: Number(userId),
                investment_product: investmentProductId,
                amount: calculatedAmount,
                profit_or_loss: doc.profit_or_loss,
                unit: doc.unit,
                bank: bankId,
                from_account: fromAccountId,
                type: 'investment', // Use the new type for profit/loss
                status: 'completed',
              },
            });
          }
        }
      },
    ],
  },
};

export default InvestmentProfitLoss;
