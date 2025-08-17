import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: "🚀 CBTC API fonctionne parfaitement !",
    timestamp: new Date().toISOString(),
    status: "success"
  });
}
