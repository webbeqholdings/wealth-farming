import { NextResponse } from 'next/server'
// import payload from 'payload'

import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    const payload = await getPayloadHMR({
      config,
    })

    const result = await payload.login({
      collection: 'users',
      data: {
        email,
        password,
      },
    })

    if (result.token) {
      const response = NextResponse.json({ success: true })
      response.cookies.set('payload-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
      })
      return response
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'An error occurred during login' }, { status: 500 })
  }
}
