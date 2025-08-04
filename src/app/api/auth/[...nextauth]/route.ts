import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { setupDatabase } from '@/lib/database';

// 確保每次認證請求時資料庫都已初始化
const initializeIfNeeded = async () => {
  try {
    await setupDatabase();
    console.log('Database initialized for auth request');
  } catch (error) {
    console.error('Failed to initialize database for auth:', error);
  }
};

const handler = async (req: Request, context: any) => {
  // 在處理認證之前先初始化資料庫
  await initializeIfNeeded();
  
  return NextAuth(authOptions)(req, context);
};

export { handler as GET, handler as POST };
