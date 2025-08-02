import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

import { createOrUpdateUser } from './supabaseApis';

// Helper function to get available providers
const getProviders = () => {
  const providers = [];

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

  // Add credentials provider for custom authentication
  providers.push(
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // For now, return null since we're using OAuth providers
        // You can implement custom authentication logic here
        return null;
      },
    })
  );

  return providers;
};

export const authOptionsSupabase: NextAuthOptions = {
  providers: getProviders(),
  session: {
    strategy: 'jwt',
  },
  debug: false,
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  callbacks: {
    async signIn({ user, account, profile }) {
      try {
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
