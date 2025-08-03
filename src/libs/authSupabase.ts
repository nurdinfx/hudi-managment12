import { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { createOrUpdateUser, getUserByEmail, createUserWithPassword } from './supabaseApis';

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

  // Add credentials provider for email/password auth
  providers.push(
    CredentialsProvider({
      id: 'credentials',
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Enter your email' },
        password: { label: 'Password', type: 'password', placeholder: 'Enter your password' },
        name: { label: 'Name', type: 'text', placeholder: 'Enter your full name' },
        isSignUp: { label: 'Sign Up', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please provide both email and password');
        }

        try {
          // Check if this is a signup request
          if (credentials.isSignUp === 'true') {
            if (!credentials.name) {
              throw new Error('Name is required for signup');
            }

            // Check if user already exists
            const existingUser = await getUserByEmail(credentials.email);
            if (existingUser) {
              throw new Error('User with this email already exists');
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(credentials.password, 12);

            // Create new user
            const newUser = await createUserWithPassword({
              email: credentials.email,
              name: credentials.name,
              password: hashedPassword,
            });

            return {
              id: newUser.id,
              email: newUser.email,
              name: newUser.name,
              image: newUser.image || null,
            };
          } else {
            // Login flow
            const user = await getUserByEmail(credentials.email);
            if (!user || !user.password) {
              throw new Error('Invalid email or password');
            }

            // Verify password
            const isValidPassword = await bcrypt.compare(credentials.password, user.password);
            if (!isValidPassword) {
              throw new Error('Invalid email or password');
            }

            return {
              id: user.id,
              email: user.email,
              name: user.name,
              image: user.image || null,
            };
          }
        } catch (error: any) {
          console.error('Auth error:', error);
          throw new Error(error.message || 'Authentication failed');
        }
      },
    })
  );

  // Add demo provider if using demo credentials
  const isDemo = process.env.GOOGLE_CLIENT_ID?.startsWith('demo-') || 
                 process.env.GITHUB_CLIENT_ID?.startsWith('demo-');

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
  debug: false, // Disabled to prevent fetch errors and warnings
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
