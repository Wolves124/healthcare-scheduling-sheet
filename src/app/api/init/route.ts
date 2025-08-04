import { NextRequest, NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/database';

// POST - 初始化資料庫
export async function POST(request: NextRequest) {
  try {
    // 檢查是否為開發環境或首次設置
    const isDevelopment = process.env.NODE_ENV === 'development';
    const { force } = await request.json().catch(() => ({}));

    if (!isDevelopment && !force) {
      return NextResponse.json(
        { success: false, error: '僅在開發環境下允許初始化資料庫' },
        { status: 403 }
      );
    }

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
