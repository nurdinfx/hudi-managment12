import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import { createOrUpdateUser } from './supabaseApis';

// Helper function to get available providers
const getProviders = () => {
  const providers = [];

  // Check if we're using demo credentials
  const isDemo = process.env.GOOGLE_CLIENT_ID?.startsWith('demo-') || 
                 process.env.GITHUB_CLIENT_ID?.startsWith('demo-');

  // Add GitHub provider if credentials are available
  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    providers.push(
      GithubProvider({
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
      })
    );
  }

  // Add Google provider if credentials are available
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    providers.push(
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      })
    );
  }

  // Add demo credentials provider if using demo mode
  if (isDemo) {
    providers.push(
      CredentialsProvider({
        id: 'demo',
        name: 'Demo Account',
        credentials: {
          demo: { label: 'Demo', type: 'text', value: 'demo' }
        },
        async authorize(credentials) {
          // Return a demo user for testing
          return {
            id: 'demo-user-123',
            email: 'demo@hotelzz.com',
            name: 'Demo User',
            image: 'https://avatars.githubusercontent.com/u/1?v=4',
          };
        },
      })
    );
  }

  return providers;
};

export const authOptionsSupabase: NextAuthOptions = {
  providers: getProviders(),
  session: {
    strategy: 'jwt',
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        // Skip Supabase operations for demo mode
        if (account?.provider === 'demo' || user.email?.includes('demo@')) {
          return true;
        }

        if (user.email && user.name) {
          // Create or update user in Supabase
          await createOrUpdateUser({
            id: user.id || crypto.randomUUID(),
            email: user.email,
            name: user.name,
            image: user.image || undefined,
          });
        }
        return true;
      } catch (error) {
        console.error('Error creating/updating user in Supabase:', error);
        return true; // Still allow sign in even if Supabase sync fails
      }
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or refresh_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      
      if (user) {
        token.id = user.id;
      }
      
      return token;
    },
    async session({ session, token }) {
      try {
        // Send properties to the client
        if (token.accessToken) {
          session.accessToken = token.accessToken as string;
        }

        // Generate a consistent user ID if not present
        const userId = token.id || token.sub || crypto.randomUUID();

        return {
          ...session,
          user: {
            ...session.user,
            id: userId,
          },
        };
      } catch (error) {
        console.error('Error in session callback:', error);
        return session;
      }
    },
  },
  pages: {
    signIn: '/auth',
    error: '/auth',
  },
};
