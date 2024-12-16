import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { generateReferralCode } from '@/utilities/referralCode'

const payload = await getPayload({ config })

export async function POST(req: Request) {
  try {
    const { email, password, first_name, last_name, role, parent_referral_code } = await req.json()

    let parentUser = null

    if (parent_referral_code) {
      parentUser = await payload.find({
        collection: 'users',
        where: {
          referral_code: {
            equals: parent_referral_code,
          },
        },
      })

      if (parentUser.totalDocs === 0) {
        return NextResponse.json({ error: 'Invalid referral code' }, { status: 400 })
      }
    }

    // Create User
    const newUser = await payload.create({
      collection: 'users',
      data: {
        email,
        password,
        first_name: first_name,
        last_name: last_name,
        role: role,
        referral_code: generateReferralCode(),
      },
    })

    // Create Referral
    if (parentUser && parentUser.docs[0]) {
      await payload.create({
        collection: 'user-referrals',
        data: {
          parent: parentUser.docs[0].id,
          child: newUser.id,
        },
      })
    }

    // Log the user in
    const { token, user } = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    return NextResponse.json({
      token: token,
      user_id: user.id,
      status: true,
    })
  } catch (error) {
    console.error('Error during registration:', error)
    return NextResponse.json({ error: error }, { status: 500 })
  }
}
