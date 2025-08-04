import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { userOperations } from '@/lib/database';
import { UserRegistrationData } from '@/types';

// GET - 獲取所有用戶（僅管理員）
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const users = userOperations.getAllUsers();
    
    // 移除密碼欄位
    const safeUsers = users.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    return NextResponse.json({
      success: true,
      data: safeUsers
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: '獲取用戶列表失敗' },
      { status: 500 }
    );
  }
}

// POST - 創建新用戶（僅管理員）
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: '權限不足' },
        { status: 403 }
      );
    }

    const userData: UserRegistrationData = await request.json();

    // 驗證必要欄位
    if (!userData.username || !userData.email || !userData.password || !userData.name) {
      return NextResponse.json(
        { success: false, error: '缺少必要欄位' },
        { status: 400 }
      );
    }

    // 檢查用戶名是否已存在
    const existingUser = userOperations.getUserByUsername(userData.username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, error: '用戶名已存在' },
        { status: 409 }
      );
    }

    // 檢查 email 是否已存在
    const existingEmail = userOperations.getUserByEmail(userData.email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, error: 'Email 已存在' },
        { status: 409 }
      );
    }

    // 創建用戶
    const newUser = await userOperations.createUser(userData);
    
    // 移除密碼欄位
    const { password, ...safeUser } = newUser;

    return NextResponse.json({
      success: true,
      data: safeUser
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { success: false, error: '創建用戶失敗' },
      { status: 500 }
    );
  }
}
