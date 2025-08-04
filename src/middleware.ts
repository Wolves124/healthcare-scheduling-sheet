import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { setupDatabase } from '@/lib/database';

// 用於追踪是否已經初始化
let isInitialized = false;

export async function middleware(request: NextRequest) {
  // 確保資料庫在每次應用啟動時被初始化
  if (!isInitialized) {
    try {
      console.log('Middleware: Initializing database...');
      await setupDatabase();
      isInitialized = true;
      console.log('Middleware: Database initialized successfully');
    } catch (error) {
      console.error('Middleware: Database initialization failed:', error);
    }
  }

  return NextResponse.next();
}

// 配置中間件只在特定路徑運行
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
