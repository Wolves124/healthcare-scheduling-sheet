import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scheduleOperations } from '@/lib/database';
import { ScheduleFormData } from '@/types';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const { id } = await params;
    const scheduleId = parseInt(id);
    const schedule = scheduleOperations.getScheduleById(scheduleId);
    
    if (!schedule) {
      return NextResponse.json(
        { success: false, error: '班表不存在' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: schedule
    });
  } catch (error) {
    console.error('Error fetching schedule:', error);
    return NextResponse.json(
      { success: false, error: '獲取班表失敗' },
      { status: 500 }
    );
  }
}

// PUT - 更新班表（僅管理員）
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const scheduleId = parseInt(params.id);
    const updates: Partial<ScheduleFormData> = await request.json();

    const success = scheduleOperations.updateSchedule(scheduleId, updates);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: '更新失敗' },
        { status: 400 }
      );
    }

    const updatedSchedule = scheduleOperations.getScheduleById(scheduleId);

    return NextResponse.json({
      success: true,
      data: updatedSchedule
    });
  } catch (error) {
    console.error('Error updating schedule:', error);
    return NextResponse.json(
      { success: false, error: '更新班表失敗' },
      { status: 500 }
    );
  }
}

// DELETE - 刪除班表（僅管理員）
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const scheduleId = parseInt(params.id);
    const success = scheduleOperations.deleteSchedule(scheduleId);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: '刪除失敗' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error deleting schedule:', error);
    return NextResponse.json(
      { success: false, error: '刪除班表失敗' },
      { status: 500 }
    );
  }
}
