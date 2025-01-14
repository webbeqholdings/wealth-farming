import React, { useEffect, useState } from 'react'
import { AccountTabs } from '@/components/account-tabs'
import { getPayload } from 'payload'
import config from '@payload-config'
import { SiteHeader } from '@/components/site-header'
import {
  getCurrentLevelRate,
  getParentIdByUser,
  getReferralProducts,
} from '@/lib/admin-side/referrals'
import { getSumAmountBalanceByAccount } from '@/lib/admin-side/transaction'

const Page = () => {
  const [totalAmount, setTotalAmount] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        ;async ({ doc, req, operation }) => {
          const payload = await getPayload({ config })
          const { amount, account_to, type, status, user } = doc // Ensure `doc` is defined in your context

          if (operation === 'update' && type === 'deposit' && status === 'completed') {
            // Update Referral Process
            const parentUser = await getParentIdByUser(payload, user)
            const referralRate = await getCurrentLevelRate(payload, amount)
            const parentId = (parentUser as { id: number }).id

            if (parentId) {
              // Get total deposit
              const total = await getSumAmountBalanceByAccount(payload, parentId)
              console.log('totalAmount', total)
              setTotalAmount(total)
            }
          }
        }
      } catch (err) {
        console.error(err)
        setError('An error occurred while fetching data.')
      }
    }

    fetchData()
  }, []) // Empty dependency array means this runs once on mount

  return (
    <>
      <SiteHeader />
      {error && <div>{error}</div>}
      {totalAmount !== null && <div>Total Amount: {totalAmount}</div>}
    </>
  )
}

export default Page
