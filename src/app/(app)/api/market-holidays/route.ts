import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import holidayData from '@/config/market-holidays.json'
export async function GET() {
  try {
    return NextResponse.json(holidayData)
  } catch (error) {
    console.error('Error reading holiday data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
