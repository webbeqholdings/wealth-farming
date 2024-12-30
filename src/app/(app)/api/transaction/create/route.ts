import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: Request) {
  try {
    const request = await req.json()
    const payload = await getPayload({
      config,
    })

    let { to_account, from_account, bank_id, product_id, type, amount, user_id, currency } = request
    let response = null
    // Handle deposit type
    if (type === 'deposit') {
      const unit = await payload.find({
        collection: 'units',
        where: {
          unit_code: { equals: 'USD' },
        },
      })
      response = await payload.create({
        collection: 'transactions',
        data: {
          user: Number(user_id),
          bank: bank_id ? Number(bank_id) : undefined,
          investment_product: product_id ? Number(product_id) : undefined,
          amount: currency == 'VND' ? Number(amount / unit.docs[0].amount) : Number(amount),
          status: 'pending',
          from_account: from_account ? Number(from_account) : undefined,
          to_account: to_account ? Number(to_account) : undefined,
          type,
        },
      })
    }

    // Handle withdraw type
    if (type === 'withdraw') {
      const unit = await payload.find({
        collection: 'units',
        where: {
          unit_code: { equals: 'USD' },
        },
      })
      const amountWithdraw =
        currency == 'VND' ? Number(amount / unit.docs[0].amount) : Number(amount)
      const fromAccount = await payload.findByID({
        collection: 'accounts',
        id: from_account,
      })

      if (fromAccount.amount < -Number(amountWithdraw)) {
        const errorBody = { error: 'Amount account main not enough' }
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const updatedAmount = fromAccount.amount + Number(amountWithdraw)
      await payload.update({
        collection: 'accounts',
        id: from_account,
        data: { amount: updatedAmount },
      })

      response = await payload.create({
        collection: 'transactions',
        data: {
          user: Number(user_id),
          bank: bank_id ? Number(bank_id) : undefined,
          investment_product: product_id ? Number(product_id) : undefined,
          amount: amountWithdraw,
          status: 'pending',
          from_account: from_account ? Number(from_account) : undefined,
          to_account: to_account ? Number(to_account) : undefined,
          type,
        },
      })
    }

    // Handle transfer type
    if (type === 'transfer') {
      const transactionAmount = Number(amount)
      const fromAccount = await payload.findByID({
        collection: 'accounts',
        id: from_account,
      })
      const toAccount = await payload.findByID({
        collection: 'accounts',
        id: to_account,
      })
      if (fromAccount.amount < transactionAmount) {
        const errorBody = { error: 'Amount not enough' }
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      const AmountFromAccount = fromAccount.amount - transactionAmount
      const AmountToAccount = toAccount.amount + transactionAmount

      await payload.update({
        collection: 'accounts',
        id: from_account,
        data: { amount: AmountFromAccount },
      })

      await payload.update({
        collection: 'accounts',
        id: to_account,
        data: { amount: AmountToAccount },
      })

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
      })
    }

    // Handle investment type
    if (type === 'investment') {
      const transactionAmount = Number(amount)
      const investmentAccount = await payload.find({
        collection: 'accounts',
        where: {
          user: { equals: user_id },
          account_name: { equals: 'Investment Account' },
        },
      })
      const investmentProduct = await payload.findByID({
        collection: 'investment-products',
        id: product_id,
      })

      if (investmentAccount.docs[0].amount < transactionAmount) {
        const errorBody = { error: 'Amount account investment not enough' }
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      if (transactionAmount < investmentProduct.min_investment) {
        const errorBody = { error: 'Amount not allowed investment' }
        return new Response(
          JSON.stringify({
            response: errorBody,
          }),
          {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
      const AmountFromAccount = investmentAccount.docs[0].amount - transactionAmount
      await payload.update({
        collection: 'accounts',
        id: investmentAccount.docs[0].id,
        data: { amount: AmountFromAccount },
      })

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
      })
      // user referrals
      const userReferral = await payload.find({
        collection: 'user-referrals',
        where: {
          child: { equals: user_id },
        },
      })
      const product = await payload.findByID({
        collection: 'investment-products',
        id: Number(product_id),
      })
      if (
        typeof userReferral.docs[0]?.parent === 'object' &&
        userReferral.docs[0]?.parent !== null
      ) {
        await payload.create({
          collection: 'contracts',
          data: {
            user: userReferral.docs[0].parent.id,
            amount: Number(amount * 0.03),
            balance: Number(amount * 0.03),
            status: 'active',
            note_log: null,
            product_log: {
              user: user_id,
              product_name: product.product_name,
              min_investment: product.min_investment,
              expected_return: 9000,
            },
          },
        })
      }
      response = await payload.create({
        collection: 'contracts',
        data: {
          user: user_id,
          amount: Number(amount),
          balance: Number(amount),
          status: 'active',
          note_log: null,
          product_log: {
            user: user_id,
            product_name: product.product_name,
            min_investment: product.min_investment,
            expected_return: 9000,
          },
        },
      })
    }

    return new Response(
      JSON.stringify({
        data: response,
        response: 'Transfer Fund Successfully',
      }),
    )
  } catch (error) {
    console.error('Transaction error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
