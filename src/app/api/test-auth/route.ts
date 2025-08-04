import { NextRequest, NextResponse } from 'next/server';
import { userOperations } from '@/lib/database';

// POST - 測試認證邏輯
export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    
    console.log('Testing auth for:', username);
    
    // 查找用戶
    const user = userOperations.getUserByUsername(username);
    console.log('User found:', !!user);
    
    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found',
        data: { userExists: false }
      });
    }

    console.log('User data:', {
      id: user.id,
      username: user.username,
      role: user.role,
      hashedPassword: user.password.substring(0, 20) + '...'
    });

    // 驗證密碼
    const isValidPassword = await userOperations.validatePassword(password, user.password);
    console.log('Password valid:', isValidPassword);

    return NextResponse.json({
      success: true,
      data: {
        userExists: true,
        passwordValid: isValidPassword,
        userRole: user.role
      }
    });
  } catch (error) {
    console.error('Test auth error:', error);
    return NextResponse.json(
      { success: false, error: error },
      { status: 500 }
    );
  }
}
