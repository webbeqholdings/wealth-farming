import { NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import config from '@payload-config'
import { NextRequest } from 'next/server' // Import NextRequest from 'next/server'
import { comfortableCash } from '@/lib/contract'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const dayCount = Number(url.searchParams.get('dayCount'))

    if (isNaN(dayCount)) {
      return NextResponse.json({ error: 'Invalid dayCount' }, { status: 400 })
    }

    const sumAmount = await comfortableCash(dayCount)

    return NextResponse.json({
      sumAmount,
      response: 'Successfully fetched comfortable cash',
    })
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
