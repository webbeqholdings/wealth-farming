import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import tradingDays from '@/config/market-working-days.json'
export async function GET() {
  try {
    return NextResponse.json(tradingDays)
  } catch (error) {
    console.error('Error reading market working days data:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
