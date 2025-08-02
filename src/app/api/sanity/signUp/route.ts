// This route has been removed as the app now uses NextAuth with Supabase
// Authentication is handled through /auth page with OAuth providers (Google, GitHub)
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { 
      error: 'This signup method is no longer available. Please use the /auth page to sign in with Google or GitHub.' 
    },
    { status: 410 }
  );
}
