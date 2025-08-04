import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const envCheck = {
      NEXTAUTH_SECRET: !!process.env.NEXTAUTH_SECRET,
      NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'NOT_SET',
      GOOGLE_SPREADSHEET_ID: !!process.env.GOOGLE_SPREADSHEET_ID,
      GOOGLE_CREDENTIALS: !!process.env.GOOGLE_CREDENTIALS,
      NODE_ENV: process.env.NODE_ENV,
    };

    return NextResponse.json({
      success: true,
      environment: envCheck,
      recommendations: {
        nextauth_secret: !process.env.NEXTAUTH_SECRET ? 'MISSING - This is required for authentication' : 'OK',
        nextauth_url: !process.env.NEXTAUTH_URL || process.env.NEXTAUTH_URL.includes('localhost') ? 'Please set to your Vercel domain' : 'OK',
        google_creds: !process.env.GOOGLE_CREDENTIALS ? 'MISSING - Required for Google Sheets integration' : 'OK'
      }
    });
  } catch (error) {
    console.error('Error checking environment:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
