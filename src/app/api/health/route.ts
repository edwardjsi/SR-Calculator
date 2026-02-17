import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    service: 'sr-calculator',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    uptime: process.uptime ? Math.floor(process.uptime()) : 0,
  })
}
