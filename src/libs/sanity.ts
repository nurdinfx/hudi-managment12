import { createClient } from 'next-sanity';

// Check if required environment variables are available
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Only create client if required environment variables are present
const sanityClient = projectId && dataset 
  ? createClient({
      projectId,
      dataset,
      useCdn: process.env.NODE_ENV === 'production',
      token: process.env.SANITY_STUDIO_TOKEN,
      apiVersion: '2021-10-21',
    })
  : null;

export default sanityClient;
