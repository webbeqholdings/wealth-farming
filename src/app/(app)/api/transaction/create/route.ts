import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@payload-config';

export async function POST(req: Request) {
  try {
    const request = await req.json();
    const payload = await getPayload({
      config,
    });

    let { to_account, from_account, bank_id, product_id, type, amount, user_id } = request;
    // Handle deposit type
    if (type === 'deposit') {
      await payload.create({
        collection: 'transactions',
        data: {
          user: Number(user_id),
          bank: bank_id ? Number(bank_id) : undefined,
          investment_product: product_id ? Number(product_id) : undefined,
          amount: Number(amount),
          status: 'pending',
          from_account: from_account ? Number(from_account) : undefined,
          to_account: to_account ? Number(to_account) : undefined,
          type,
        },
      });
    }

    // Handle withdraw type
    if (type === 'withdraw') {
      const fromAccount = await payload.findByID({
        collection: 'accounts',
        id: from_account,
      });

      if (fromAccount.amount < -Number(amount)) {
        const errorBody = { error: 'Amount not enough' };
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const updatedAmount = fromAccount.amount + Number(amount);
      await payload.update({
        collection: 'accounts',
        id: from_account,
        data: { amount: updatedAmount },
      });

      await payload.create({
        collection: 'transactions',
        data: {
          user: Number(user_id),
          bank: bank_id ? Number(bank_id) : undefined,
          investment_product: product_id ? Number(product_id) : undefined,
          amount: Number(amount),
          status: 'pending',
          from_account: from_account ? Number(from_account) : undefined,
          to_account: to_account ? Number(to_account) : undefined,
          type,
        },
      });
    }

    // Handle transfer type
    if (type === 'transfer') {
      const transactionAmount = Number(amount);
      const fromAccount = await payload.findByID({
        collection: 'accounts',
        id: from_account,
      });
      const toAccount = await payload.findByID({
        collection: 'accounts',
        id: to_account,
      });

      if (fromAccount.amount < transactionAmount) {
        const errorBody = { error: 'Amount not enough' };
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      const AmountFromAccount = fromAccount.amount - transactionAmount;
      const AmountToAccount = toAccount.amount + transactionAmount;

      await payload.update({
        collection: 'accounts',
        id: from_account,
        data: { amount: AmountFromAccount },
      });

      await payload.update({
        collection: 'accounts',
        id: to_account,
        data: { amount: AmountToAccount },
      });

      await payload.create({
        collection: 'transactions',
        data: {
          user: Number(user_id),
          bank: bank_id ? Number(bank_id) : undefined,
          investment_product: product_id ? Number(product_id) : undefined,
          amount: Number(amount),
          status: 'completed',
          from_account: from_account ? Number(from_account) : undefined,
          to_account: to_account ? Number(to_account) : undefined,
          type,
        },
      });
    }

    // Handle investment type
    if (type === 'investment') {
      const transactionAmount = Number(amount);
      const investmentAccount = await payload.find({
        collection: 'accounts',
        where: {
          user: { equals: user_id },
          account_name: { equals: 'Investment Account' },
        },
      });
      const investmentProduct = await payload.findByID({
        collection: 'investment-products',
        id: product_id,
      });

      if (investmentAccount.docs[0].amount < transactionAmount) {
        const errorBody = { error: 'Amount not enough investment' };
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      if (
        transactionAmount < investmentProduct.min_investment ||
        transactionAmount > investmentProduct.max_investment
      ) {
        const errorBody = { error: 'Amount not allowed investment' };
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      const AmountFromAccount = investmentAccount.docs[0].amount - transactionAmount;
      await payload.update({
        collection: 'accounts',
        id: investmentAccount.docs[0].id,
        data: { amount: AmountFromAccount },
      });

      await payload.create({
        collection: 'transactions',
        data: {
          user: Number(user_id),
          amount: transactionAmount,
          investment_product: product_id ? Number(product_id) : undefined,
          status: 'completed',
          from_account: investmentAccount.docs[0].id,
          type,
        },
      });
    }

    return new Response(
      JSON.stringify({
        response: 'Transfer Fund Successfully',
      })
    );
  } catch (error) {
    console.error('Transaction error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
