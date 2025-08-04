import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { userOperations, setupDatabase } from '@/lib/database';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        username: { label: '用戶名', type: 'text' },
        password: { label: '密碼', type: 'password' }
      },
      async authorize(credentials) {
        console.log('NextAuth authorize called with:', { username: credentials?.username, hasPassword: !!credentials?.password });
        
        // 確保資料庫已初始化
        try {
          await setupDatabase();
          console.log('Database initialized for auth');
        } catch (error) {
          console.error('Failed to initialize database:', error);
        }
        
        if (!credentials?.username || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        try {
          // 查找用戶
          const user = userOperations.getUserByUsername(credentials.username);
          console.log('User lookup result:', !!user);
          
          if (!user) {
            console.log('User not found');
            return null;
          }

          // 驗證密碼
          const isValidPassword = await userOperations.validatePassword(
            credentials.password,
            user.password
          );
          console.log('Password validation result:', isValidPassword);

          if (!isValidPassword) {
            console.log('Invalid password');
            return null;
          }

          console.log('Authentication successful for user:', user.username);
          // 返回用戶信息（不包含密碼）
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            department: user.department,
          };
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      // 首次登入時，將用戶信息添加到 token
      if (user) {
        token.id = user.id;
        token.username = (user as any).username;
        token.role = (user as any).role;
        token.department = (user as any).department;
      }
      return token;
    },
    async session({ session, token }) {
      // 將 token 中的信息添加到 session
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.role = token.role as string;
        session.user.department = token.department as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
