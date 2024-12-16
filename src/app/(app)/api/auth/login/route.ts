import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayload } from 'payload'
const payload = await getPayload({ config })

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const { token, user } = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (token) {
      const response = NextResponse.json({ status: true, user_id: user.id })
      response.cookies.set('payload-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      return response
    }
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  } catch (error) {
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 })
  }
}
