import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { userOperations } from '@/lib/database';

// GET - 獲取特定用戶
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: '未授權' },
        { status: 401 }
      );
    }

    const userId = parseInt(params.id);
    
    // 用戶只能查看自己的信息，管理員可以查看所有用戶
    if (session.user.role !== 'admin' && session.user.id !== params.id) {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const user = userOperations.getUserById(userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, error: '用戶不存在' },
        { status: 404 }
      );
    }

    // 移除密碼欄位
    const { password, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      data: safeUser
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { success: false, error: '獲取用戶信息失敗' },
      { status: 500 }
    );
  }
}

// PUT - 更新用戶
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { success: false, error: '未授權' },
        { status: 401 }
      );
    }

    const userId = parseInt(params.id);
    
    // 用戶只能更新自己的信息，管理員可以更新所有用戶
    if (session.user.role !== 'admin' && session.user.id !== params.id) {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const updates = await request.json();
    
    // 非管理員用戶不能更改角色
    if (session.user.role !== 'admin' && updates.role) {
      delete updates.role;
    }

    // 如果更新密碼，需要加密
    if (updates.password) {
      const bcrypt = require('bcryptjs');
      updates.password = await bcrypt.hash(updates.password, 12);
    }

    const success = userOperations.updateUser(userId, updates);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: '更新失敗' },
        { status: 400 }
      );
    }

    const updatedUser = userOperations.getUserById(userId);
    if (updatedUser) {
      const { password, ...safeUser } = updatedUser;
      return NextResponse.json({
        success: true,
        data: safeUser
      });
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { success: false, error: '更新用戶失敗' },
      { status: 500 }
    );
  }
}

// DELETE - 刪除用戶（僅管理員）
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

    const userId = parseInt(params.id);
    
    // 不能刪除自己
    if (session.user.id === params.id) {
      return NextResponse.json(
        { success: false, error: '不能刪除自己的帳戶' },
        { status: 400 }
      );
    }

    const success = userOperations.deleteUser(userId);
    
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
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { success: false, error: '刪除用戶失敗' },
      { status: 500 }
    );
  }
}
