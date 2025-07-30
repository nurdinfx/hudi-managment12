import { signUpHandler } from 'next-auth-sanity';

import sanityClient from '@/libs/sanity';

// Only create handler if sanityClient is available
export const POST = sanityClient ? signUpHandler(sanityClient) : async () => {
  return new Response('Sanity client not configured', { status: 500 });
};
