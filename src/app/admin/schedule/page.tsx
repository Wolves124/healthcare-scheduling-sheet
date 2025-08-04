'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { CalendarIcon, PlusIcon, EditIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';

export default function AdminSchedulePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    if (session.user.role !== 'admin') {
      router.push('/');
      return;
    }
    
    setLoading(false);
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return <LoadingPage message="載入中..." />;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <CalendarIcon className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">班表管理</h1>
        </div>
        <Button>
          <PlusIcon className="w-4 h-4 mr-2" />
          新增班表
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center py-12">
          <EditIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">班表管理功能</h3>
          <p className="text-gray-600 mb-6">
            這裡將提供完整的班表編輯和管理功能
          </p>
          <div className="space-y-2 text-sm text-gray-500">
            <p>• 新增和編輯員工班表</p>
            <p>• 批量導入班表資料</p>
            <p>• 班表衝突檢查</p>
            <p>• 匯出班表報告</p>
          </div>
        </div>
      </div>
    </div>
  );
}
