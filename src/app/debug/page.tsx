'use client';

import { useEffect, useState } from 'react';

interface DebugInfo {
  initialized: boolean;
  adminExists: boolean;
  totalUsers: number;
  error?: string;
}

interface EnvInfo {
  NEXTAUTH_SECRET: boolean;
  NEXTAUTH_URL: string;
  GOOGLE_SPREADSHEET_ID: boolean;
  GOOGLE_CREDENTIALS: boolean;
  NODE_ENV: string;
}

export default function DebugPage() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [envInfo, setEnvInfo] = useState<EnvInfo | null>(null);
  const [initStatus, setInitStatus] = useState<string>('');

  const checkEnvironment = async () => {
    try {
      const response = await fetch('/api/check-env');
      const data = await response.json();
      
      if (data.success) {
        setEnvInfo(data.environment);
      }
    } catch (error) {
      console.error('Failed to check environment:', error);
    }
  };

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/test-data');
      const data = await response.json();
      
      if (data.success) {
        setDebugInfo({
          initialized: true,
          adminExists: data.adminExists,
          totalUsers: data.totalUsers
        });
      } else {
        setDebugInfo({
          initialized: false,
          adminExists: false,
          totalUsers: 0,
          error: data.error
        });
      }
    } catch (error) {
      setDebugInfo({
        initialized: false,
        adminExists: false,
        totalUsers: 0,
        error: 'Failed to fetch debug info'
      });
    }
  };

  const initializeDatabase = async () => {
    setInitStatus('正在初始化...');
    try {
      const response = await fetch('/api/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      if (data.success) {
        setInitStatus('初始化成功！');
        await checkDatabase(); // 重新檢查狀態
      } else {
        setInitStatus(`初始化失敗: ${data.error}`);
      }
    } catch (error) {
      setInitStatus(`初始化錯誤: ${error}`);
    }
  };

  useEffect(() => {
    checkDatabase();
    checkEnvironment();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">系統調試頁面</h1>
          
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">環境變數狀態</h2>
              {envInfo ? (
                <div className="space-y-2">
                  <p><strong>NEXTAUTH_SECRET:</strong> {envInfo.NEXTAUTH_SECRET ? '✅ 已設置' : '❌ 未設置（必須！）'}</p>
                  <p><strong>NEXTAUTH_URL:</strong> {envInfo.NEXTAUTH_URL === 'NOT_SET' ? '❌ 未設置' : `✅ ${envInfo.NEXTAUTH_URL}`}</p>
                  <p><strong>GOOGLE_SPREADSHEET_ID:</strong> {envInfo.GOOGLE_SPREADSHEET_ID ? '✅ 已設置' : '❌ 未設置'}</p>
                  <p><strong>GOOGLE_CREDENTIALS:</strong> {envInfo.GOOGLE_CREDENTIALS ? '✅ 已設置' : '❌ 未設置'}</p>
                  <p><strong>NODE_ENV:</strong> {envInfo.NODE_ENV}</p>
                </div>
              ) : (
                <p>載入中...</p>
              )}
            </div>

            <div className="border rounded-lg p-4">
              <h2 className="text-lg font-semibold mb-2">資料庫狀態</h2>
              {debugInfo ? (
                <div className="space-y-2">
                  <p><strong>已初始化:</strong> {debugInfo.initialized ? '✅ 是' : '❌ 否'}</p>
                  <p><strong>管理員帳號存在:</strong> {debugInfo.adminExists ? '✅ 是' : '❌ 否'}</p>
                  <p><strong>總用戶數:</strong> {debugInfo.totalUsers}</p>
                  {debugInfo.error && (
                    <p className="text-red-600"><strong>錯誤:</strong> {debugInfo.error}</p>
                  )}
                </div>
              ) : (
                <p>載入中...</p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => { checkDatabase(); checkEnvironment(); }}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                重新檢查
              </button>
              
              <button
                onClick={initializeDatabase}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                強制初始化
              </button>
            </div>

            {initStatus && (
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <strong>初始化狀態:</strong> {initStatus}
              </div>
            )}

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">測試連結</h2>
              <div className="space-y-2">
                <a href="/auth/signin" className="block text-blue-600 hover:underline">
                  → 前往登入頁面
                </a>
                <a href="/api/test-data" target="_blank" className="block text-blue-600 hover:underline">
                  → 查看原始 API 響應
                </a>
              </div>
            </div>

            <div className="border-t pt-4">
              <h2 className="text-lg font-semibold mb-2">預設登入資訊</h2>
              <div className="bg-yellow-50 p-3 rounded">
                <p><strong>用戶名:</strong> admin</p>
                <p><strong>密碼:</strong> admin123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
