import { NextResponse } from 'next/server'
import config from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
export async function POST(req: Request) {
  try {
    const { email, password, firstName, lastName, role } = await req.json()
    const payload = await getPayloadHMR({
      config,
    })
    const result = await payload.create({
      collection: 'users',
      data: {
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        role: role,
      },
    })

    if (result.id) {
      // Log in the user after successful registration
      const loginResult = await payload.login({
        collection: 'users',
        data: {
          email,
          password,
        },
      })

      if (loginResult.token) {
        const response = NextResponse.json({ success: true })
        response.cookies.set('payload-token', loginResult.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/',
        })
        return response
      }
    }

    return NextResponse.json({ error: 'Registration failed' }, { status: 400 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'An error occurred during registration' }, { status: 500 })
  }
}
