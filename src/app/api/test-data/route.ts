import { NextRequest, NextResponse } from 'next/server';
import { scheduleOperations, userOperations } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // 創建一些測試班表數據
    const testSchedules = [
      {
        user_id: 1, // admin 用戶
        date: '2025-08-01',
        shift_type: 'day' as const,
        start_time: '08:00',
        end_time: '16:00',
        notes: '測試班表1'
      },
      {
        user_id: 1,
        date: '2025-08-02',
        shift_type: 'evening' as const,
        start_time: '16:00',
        end_time: '00:00',
        notes: '測試班表2'
      },
      {
        user_id: 1,
        date: '2025-08-03',
        shift_type: 'night' as const,
        start_time: '00:00',
        end_time: '08:00',
        notes: '測試班表3'
      }
    ];

    const createdSchedules = [];
    for (const scheduleData of testSchedules) {
      const schedule = scheduleOperations.createSchedule(scheduleData);
      createdSchedules.push(schedule);
    }

    return NextResponse.json({
      success: true,
      message: `已創建 ${createdSchedules.length} 筆測試班表`,
      data: createdSchedules
    });
  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json(
      { success: false, error: '創建測試數據失敗' },
      { status: 500 }
    );
  }
}
