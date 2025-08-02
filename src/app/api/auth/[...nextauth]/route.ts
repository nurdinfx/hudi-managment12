import NextAuth from 'next-auth';
import { authOptionsSupabase } from '@/libs/authSupabase';

const handler = NextAuth(authOptionsSupabase);

export { handler as GET, handler as POST };
