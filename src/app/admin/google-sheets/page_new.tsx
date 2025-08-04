'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SheetIcon, UploadIcon, DownloadIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { LoadingPage } from '@/components/ui/Loading';

export default function AdminGoogleSheetsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('');

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

  const handleSyncToSheets = async () => {
    setSyncing(true);
    setMessage('');
    
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const response = await fetch('/api/google-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, month }),
      });

      const result = await response.json();

      if (result.success) {
        setMessage(`成功同步 ${year}年${month}月 班表到 Google Sheets！`);
        setMessageType('success');
      } else {
        setMessage(result.error || '同步失敗');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('同步時發生錯誤');
      setMessageType('error');
    } finally {
      setSyncing(false);
    }
  };

  if (status === 'loading' || loading) {
    return <LoadingPage message="載入中..." />;
  }

  if (!session || session.user.role !== 'admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <SheetIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Google Sheets 整合</h1>
      </div>

      {message && (
        <div className={`rounded-lg p-4 ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-red-50 border border-red-200'
        }`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {messageType === 'success' ? (
                <CheckCircleIcon className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircleIcon className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm ${
                messageType === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {message}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <UploadIcon className="w-6 h-6 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">同步到 Google Sheets</h3>
          </div>
          <p className="text-gray-600 mb-4">
            將本月班表資料同步到 Google Sheets，方便查看和分享
          </p>
          <Button 
            className="w-full" 
            onClick={handleSyncToSheets}
            loading={syncing}
            disabled={syncing}
          >
            {syncing ? '同步中...' : '同步當月班表'}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <DownloadIcon className="w-6 h-6 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">查看 Google Sheets</h3>
          </div>
          <p className="text-gray-600 mb-4">
            在新分頁中開啟 Google Sheets 查看班表
          </p>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => window.open('https://docs.google.com/spreadsheets/d/1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ/edit', '_blank')}
          >
            開啟 Google Sheets
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">設定說明</h3>
        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="font-medium text-gray-900">1. Google Sheets 設定已完成</h4>
            <p>試算表 ID: 1w00sTHsHBgZ4I-b_XIrXIBTI54kOP7G-y9jjICcuNgQ</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">2. 服務帳號已設定</h4>
            <p>服務帳號: sheets-service-account@healthcare-467709.iam.gserviceaccount.com</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900">3. 使用說明</h4>
            <p>點擊「同步當月班表」將資料同步到 Google Sheets，然後點擊「開啟 Google Sheets」查看結果</p>
          </div>
        </div>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <CheckCircleIcon className="h-5 w-5 text-green-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              配置狀態
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>✅ Google Sheets 整合已配置完成</p>
              <p>✅ 服務帳號憑證已設定</p>
              <p>✅ 試算表 ID 已設定</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
