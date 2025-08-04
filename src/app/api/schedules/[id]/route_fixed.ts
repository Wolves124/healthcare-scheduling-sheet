import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { scheduleOperations } from '@/lib/database';
import { ScheduleFormData } from '@/types';

// GET - 獲取特定班表
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    console.error('獲取班表失敗:', error);
    return NextResponse.json(
      { success: false, error: '獲取班表失敗' },
      { status: 500 }
    );
  }
}

// PUT - 更新班表
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '需要管理員權限' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const scheduleId = parseInt(id);
    const data: ScheduleFormData = await request.json();

    const updatedSchedule = scheduleOperations.updateSchedule(scheduleId, data);

    if (!updatedSchedule) {
      return NextResponse.json(
        { success: false, error: '更新班表失敗' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSchedule
    });
  } catch (error) {
    console.error('更新班表失敗:', error);
    return NextResponse.json(
      { success: false, error: '更新班表失敗' },
      { status: 500 }
    );
  }
}

// DELETE - 刪除班表
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '需要管理員權限' },
        { status: 403 }
      );
    }

    const { id } = await params;
    const scheduleId = parseInt(id);
    const deleted = scheduleOperations.deleteSchedule(scheduleId);

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: '刪除班表失敗' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: '班表已刪除'
    });
  } catch (error) {
    console.error('刪除班表失敗:', error);
    return NextResponse.json(
      { success: false, error: '刪除班表失敗' },
      { status: 500 }
    );
  }
}
