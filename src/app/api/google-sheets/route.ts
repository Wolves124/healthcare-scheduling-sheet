import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scheduleOperations } from '@/lib/database';
import { createGoogleSheetsService, getGoogleCredentials } from '@/lib/google-sheets';

// POST - 同步班表到 Google Sheets（僅管理員）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const { year, month } = await request.json();

    if (!year || !month) {
      return NextResponse.json(
        { success: false, error: '缺少年份和月份參數' },
        { status: 400 }
      );
    }

    // 檢查 Google Sheets 配置
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
          details: '請參考 GOOGLE_SHEETS_SETUP.md 完成設定'
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

// GET - 從 Google Sheets 讀取數據
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

    // 檢查 Google Sheets 配置
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;
    const credentials = getGoogleCredentials();

    if (!spreadsheetId || !credentials) {
      return NextResponse.json(
        { success: false, error: 'Google Sheets 配置不完整' },
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
