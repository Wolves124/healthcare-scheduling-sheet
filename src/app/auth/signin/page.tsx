'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LockIcon, UserIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function SignInPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await signIn('credentials', {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError('用戶名或密碼錯誤');
      } else {
        // 登入成功，跳轉到首頁
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      setError('登入失敗，請稍後再試');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-600">
            <LockIcon className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            登入醫護排班系統
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            請使用您的帳號登入系統
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              label="用戶名"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="請輸入用戶名"
              required
              error={error && !username ? '請輸入用戶名' : ''}
            />
            
            <Input
              label="密碼"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="請輸入密碼"
              required
              error={error && !password ? '請輸入密碼' : ''}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            loading={loading}
            className="w-full"
            disabled={!username || !password}
          >
            {loading ? '登入中...' : '登入'}
          </Button>
        </form>

        <div className="mt-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">預設帳號</h3>
            <div className="text-sm text-gray-600">
              <p><strong>管理員：</strong> admin / admin123</p>
              <p className="text-xs mt-1 text-gray-500">
                首次使用請使用管理員帳號登入
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => router.push('/')}
            className="text-blue-600 hover:text-blue-500 text-sm font-medium"
          >
            返回首頁
          </button>
        </div>
      </div>
    </div>
  );
}
