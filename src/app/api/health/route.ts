import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    app: 'a-little-universe-for-wynne',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
