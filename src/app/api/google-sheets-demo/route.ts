import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scheduleOperations } from '@/lib/database';

// POST - 演示模式：同步班表到 Google Sheets（僅管理員）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const { year, month, demoMode } = await request.json();

    if (!year || !month) {
      return NextResponse.json(
        { success: false, error: '缺少年份和月份參數' },
        { status: 400 }
      );
    }

    // 如果是演示模式，直接回傳成功
    if (demoMode) {
      const schedules = scheduleOperations.getMonthlySchedules(year, month);
      
      // 模擬處理時間
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      return NextResponse.json({
        success: true,
        message: `[演示模式] ${year}年${month}月班表已準備同步到 Google Sheets`,
        details: `處理了 ${schedules.length} 筆班表記錄`,
        demoMode: true
      });
    }

    // 原有的真實同步邏輯
    const { createGoogleSheetsService, getGoogleCredentials } = await import('@/lib/google-sheets');
    
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const credentials = getGoogleCredentials();

    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, error: '缺少 Google Sheets 試算表 ID 配置' },
        { status: 500 }
      );
    }

    if (!credentials) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Google 服務帳號憑證配置不完整，請設定有效的 GOOGLE_CREDENTIALS 環境變數',
          details: '請參考 GOOGLE_CREDENTIALS_SETUP.md 完成設定',
          canUseDemoMode: true
        },
        { status: 500 }
      );
    }

    // 獲取班表數據
    const schedules = scheduleOperations.getMonthlySchedules(year, month);

    // 創建 Google Sheets 服務
    const sheetsService = createGoogleSheetsService({
      spreadsheetId,
      credentials,
      range: ''
    });

    // 同步到 Google Sheets
    await sheetsService.createMonthlyScheduleSheet(year, month, schedules);

    return NextResponse.json({
      success: true,
      message: `${year}年${month}月班表已同步到 Google Sheets`
    });
  } catch (error) {
    console.error('Error syncing to Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: '同步到 Google Sheets 失敗' },
      { status: 500 }
    );
  }
}

// GET - 從 Google Sheets 讀取數據（保持原有邏輯）
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sheetName = searchParams.get('sheet');
    const range = searchParams.get('range') || 'A1:Z100';

    if (!sheetName) {
      return NextResponse.json(
        { success: false, error: '缺少工作表名稱' },
        { status: 400 }
      );
    }

    const { createGoogleSheetsService, getGoogleCredentials } = await import('@/lib/google-sheets');
    
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const credentials = getGoogleCredentials();

    if (!spreadsheetId) {
      return NextResponse.json(
        { success: false, error: '缺少 Google Sheets 試算表 ID 配置' },
        { status: 500 }
      );
    }

    if (!credentials) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Google 服務帳號憑證配置不完整，請設定有效的 GOOGLE_CREDENTIALS 環境變數',
          details: '請參考 GOOGLE_CREDENTIALS_SETUP.md 完成設定'
        },
        { status: 500 }
      );
    }

    // 創建 Google Sheets 服務
    const sheetsService = createGoogleSheetsService({
      spreadsheetId,
      credentials,
      range: ''
    });

    // 讀取數據
    const data = await sheetsService.readSheet(`${sheetName}!${range}`);

    return NextResponse.json({
      success: true,
      data: data
    });
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
    return NextResponse.json(
      { success: false, error: '從 Google Sheets 讀取失敗' },
      { status: 500 }
    );
  }
}
