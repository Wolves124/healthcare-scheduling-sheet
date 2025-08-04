'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { CalendarIcon, UsersIcon, SheetIcon, ClockIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';

interface DashboardStats {
  totalUsers: number;
  monthlySchedules: number;
  todayShifts: number;
}

export default function Home() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // 初始化資料庫
        await fetch('/api/init', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        // 獲取統計數據（如果已登入）
        if (session) {
          // 這裡可以添加獲取統計數據的邏輯
          setStats({
            totalUsers: 0,
            monthlySchedules: 0,
            todayShifts: 0
          });
        }
      } catch (error) {
        console.error('Failed to initialize app:', error);
      } finally {
        setLoading(false);
      }
    };

    if (status !== 'loading') {
      initializeApp();
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return <LoadingPage message="系統初始化中..." />;
  }

  if (!session) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow-lg">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              醫護排班系統
            </h1>
            <p className="text-gray-600">
              專業的醫護人員排班管理系統
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-gray-700">
              <CalendarIcon className="w-5 h-5 text-blue-500" />
              <span>班表查看與管理</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <SheetIcon className="w-5 h-5 text-green-500" />
              <span>Google Sheets 整合</span>
            </div>
            <div className="flex items-center space-x-3 text-gray-700">
              <UsersIcon className="w-5 h-5 text-purple-500" />
              <span>用戶權限管理</span>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/auth/signin" className="block">
              <Button className="w-full">
                登入系統
              </Button>
            </Link>
            <Link href="/schedule" className="block">
              <Button variant="outline" className="w-full">
                查看班表（無需登入）
              </Button>
            </Link>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>預設管理員帳號：admin / admin123</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* 歡迎區域 */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          歡迎回來，{session.user.name}！
        </h1>
        <p className="text-blue-100">
          {session.user.department && `${session.user.department} - `}
          {session.user.role === 'admin' ? '系統管理員' : '一般用戶'}
        </p>
      </div>

      {/* 快速操作區域 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/schedule" className="block">
          <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
            <div className="flex items-center space-x-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <CalendarIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">查看班表</h3>
                <p className="text-gray-600">查看當月排班情況</p>
              </div>
            </div>
          </div>
        </Link>

        {session.user.role === 'admin' && (
          <>
            <Link href="/admin/schedule" className="block">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">管理班表</h3>
                    <p className="text-gray-600">編輯和安排班表</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/users" className="block">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <UsersIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">用戶管理</h3>
                    <p className="text-gray-600">管理系統用戶</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link href="/admin/google-sheets" className="block">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <SheetIcon className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Google 表格</h3>
                    <p className="text-gray-600">同步到 Google Sheets</p>
                  </div>
                </div>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* 統計資訊 */}
      {stats && session.user.role === 'admin' && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">系統統計</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
              <div className="text-gray-600">總用戶數</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.monthlySchedules}</div>
              <div className="text-gray-600">本月班表</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.todayShifts}</div>
              <div className="text-gray-600">今日班次</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
