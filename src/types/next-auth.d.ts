import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      username: string;
      role: string;
      department?: string;
    };
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    username: string;
    role: string;
    department?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    username: string;
    role: string;
    department?: string;
  }
}
