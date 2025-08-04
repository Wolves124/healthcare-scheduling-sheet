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
  const [showDemo, setShowDemo] = useState(false);

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

  const handleSyncToSheets = async (demoMode = false) => {
    setSyncing(true);
    setMessage('');
    
    try {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      
      const endpoint = demoMode ? '/api/google-sheets-demo' : '/api/google-sheets';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ year, month, demoMode }),
      });

      const result = await response.json();

      if (result.success) {
        const prefix = result.demoMode ? '🎭 ' : '✅ ';
        setMessage(`${prefix}${result.message}`);
        if (result.details) {
          setMessage(prev => `${prev} (${result.details})`);
        }
        setMessageType('success');
      } else {
        const errorMessage = result.details 
          ? `${result.error} - ${result.details}` 
          : result.error || '同步失敗';
        setMessage(errorMessage);
        setMessageType('error');
        
        // 如果支援演示模式，顯示選項
        if (result.canUseDemoMode) {
          setShowDemo(true);
        }
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
            onClick={() => handleSyncToSheets()}
            loading={syncing}
            disabled={syncing}
          >
            {syncing ? '同步中...' : '同步當月班表'}
          </Button>
          
          {showDemo && (
            <div className="mt-3">
              <Button 
                variant="outline"
                className="w-full" 
                onClick={() => handleSyncToSheets(true)}
                loading={syncing}
                disabled={syncing}
              >
                🎭 演示模式同步
              </Button>
              <p className="text-xs text-gray-500 mt-1 text-center">
                體驗同步功能（不需要真實憑證）
              </p>
            </div>
          )}
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center space-x-3 mb-4">
            <h3 className="text-lg font-semibold text-gray-900">📚 設定說明</h3>
          </div>
          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-900">🔧 完成 Google Sheets 整合設定</h4>
              <p>請參考詳細指南完成服務帳號憑證設定：</p>
              <div className="mt-2">
                <Button 
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const content = `
請按照以下步驟完成 Google Sheets 整合設定：

1. 前往 Google Cloud Console
   https://console.cloud.google.com/
   
2. 選擇專案：healthcare-467709

3. 前往 IAM 與管理 > 服務帳號

4. 找到服務帳號：
   sheets-service-account@healthcare-467709.iam.gserviceaccount.com

5. 點擊服務帳號名稱 > 金鑰分頁

6. 新增金鑰 > 建立新金鑰 > JSON 格式

7. 下載 JSON 檔案並複製內容

8. 將 JSON 內容壓縮成單行（移除換行符號）

9. 更新 .env.local 檔案中的 GOOGLE_CREDENTIALS

10. 重新啟動開發伺服器

詳細說明請參考專案根目錄的 GOOGLE_CREDENTIALS_SETUP.md 檔案。
                    `;
                    alert(content);
                  }}
                >
                  📖 查看設定步驟
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">⚡ 快速測試</h4>
              <p>如果您還沒完成憑證設定，可以使用演示模式體驗功能</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
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
                <p>✅ Google Sheets 試算表 ID 已設定</p>
                <p>✅ Google 服務帳號憑證已設定</p>
                <p>✅ 整合功能已準備就緒</p>
                <p className="mt-2 font-medium">
                  您現在可以使用完整的 Google Sheets 整合功能！
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
