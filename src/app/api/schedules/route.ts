import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scheduleOperations } from '@/lib/database';
import { ScheduleFormData } from '@/types';

// GET - 獲取班表
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const userId = searchParams.get('userId');
    const year = searchParams.get('year');
    const month = searchParams.get('month');

    let schedules;

    if (year && month) {
      // 獲取月度班表
      schedules = scheduleOperations.getMonthlySchedules(
        parseInt(year),
        parseInt(month)
      );
    } else if (startDate && endDate) {
      // 獲取日期範圍班表
      schedules = scheduleOperations.getSchedulesByDateRange(startDate, endDate);
    } else if (userId) {
      // 獲取特定用戶的班表
      schedules = scheduleOperations.getSchedulesByUser(
        parseInt(userId),
        startDate || undefined,
        endDate || undefined
      );
    } else {
      // 獲取當前月份的班表
      const now = new Date();
      schedules = scheduleOperations.getMonthlySchedules(
        now.getFullYear(),
        now.getMonth() + 1
      );
    }

    return NextResponse.json({
      success: true,
      data: schedules
    });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { success: false, error: '獲取班表失敗' },
      { status: 500 }
    );
  }
}

// POST - 創建班表（僅管理員）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const scheduleData: ScheduleFormData = await request.json();

    // 驗證必要欄位
    if (!scheduleData.user_id || !scheduleData.date || !scheduleData.shift_type) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位' },
        { status: 400 }
      );
    }

    // 創建或更新班表
    const schedule = scheduleOperations.upsertSchedule(scheduleData);

    return NextResponse.json({
      success: true,
      data: schedule
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { success: false, error: '創建班表失敗' },
      { status: 500 }
    );
  }
}

// PUT - 批量更新班表（僅管理員）
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const { schedules }: { schedules: ScheduleFormData[] } = await request.json();

    if (!Array.isArray(schedules)) {
      return NextResponse.json(
        { success: false, error: '無效的數據格式' },
        { status: 400 }
      );
    }

    const results = [];
    const errors = [];

    for (const scheduleData of schedules) {
      try {
        const schedule = scheduleOperations.upsertSchedule(scheduleData);
        results.push(schedule);
      } catch (error) {
        errors.push({
          data: scheduleData,
          error: error instanceof Error ? error.message : '未知錯誤'
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        updated: results,
        errors: errors
      }
    });
  } catch (error) {
    console.error('Error batch updating schedules:', error);
    return NextResponse.json(
      { success: false, error: '批量更新班表失敗' },
      { status: 500 }
    );
  }
}
