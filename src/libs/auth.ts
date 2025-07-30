import { NextAuthOptions } from 'next-auth';
import { SanityAdapter, SanityCredentials } from 'next-auth-sanity';
import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';

import sanityClient from './sanity';

// Helper function to check if provider credentials are available
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

  // Add Sanity credentials if client is available
  if (sanityClient) {
    providers.push(SanityCredentials(sanityClient));
  }

  return providers;
};

export const authOptions: NextAuthOptions = {
  providers: getProviders(),
  session: {
    strategy: 'jwt',
  },
  adapter: sanityClient ? SanityAdapter(sanityClient) : undefined,
  debug: false, // Disable debug mode to eliminate warnings
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development',
  callbacks: {
    session: async ({ session, token }) => {
      if (!sanityClient) {
        // Return session without user ID if Sanity is not configured
        return session;
      }

      try {
        const userEmail = token.email;
        const userIdObj = await sanityClient.fetch<{ _id: string }>(
          `*[_type == "user" && email == $email][0] {
              _id
          }`,
          { email: userEmail }
        );
        return {
          ...session,
          user: {
            ...session.user,
            id: userIdObj?._id,
          },
        };
      } catch (error) {
        console.warn('Error fetching user data from Sanity:', error);
        return session;
      }
    },
  },
};
