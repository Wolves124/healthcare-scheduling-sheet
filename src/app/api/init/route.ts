import { NextRequest, NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database';

// POST - 初始化資料庫
export async function POST(request: NextRequest) {
  try {
    // 在生產環境也允許初始化，用於 Vercel 首次部署
    const { force } = await request.json().catch(() => ({}));
    
    // 總是允許初始化，因為我們使用記憶體資料庫
    console.log('Initializing database for environment:', process.env.NODE_ENV);

    await setupDatabase();

    return NextResponse.json({
      success: true,
      message: '資料庫初始化成功'
    });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json(
      { success: false, error: '資料庫初始化失敗' },
      { status: 500 }
    );
  }
}
