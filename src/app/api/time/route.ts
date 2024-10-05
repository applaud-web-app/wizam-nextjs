// app/api/time/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const serverTime = new Date().toISOString(); // Get current server time as an ISO string
  return NextResponse.json({ serverTime });
}
