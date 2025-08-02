'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AuthPrompt = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Don't show if user is signed in or still loading
  if (status === 'loading' || session) return null;

  const handleSignInClick = () => {
    console.log('Sign In clicked from AuthPrompt');
    router.push('/auth');
  };

  const handleBrowseRoomsClick = () => {
    console.log('Browse Rooms clicked from AuthPrompt');
    router.push('/rooms');
  };

  return (
    <div className="bg-gradient-to-r from-primary to-tertiary-dark text-white py-12">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-3xl font-bold mb-4">🏨 Ready to Book Your Perfect Stay?</h3>
        <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
          Sign in to access instant booking, Somali payment methods, and manage your reservations with ease
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={handleSignInClick}
            className="bg-white text-primary px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            🔐 Sign In / Sign Up
          </button>
          <button
            onClick={handleBrowseRoomsClick}
            className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 transform hover:-translate-y-1"
          >
            🏠 Browse Rooms
          </button>
        </div>

        {/* Alternative Link versions for fallback */}
        <div className="flex flex-col sm:flex-row gap-2 justify-center mb-8 text-sm opacity-75">
          <Link href="/auth" className="underline hover:opacity-100">
            Direct Link to Sign In
          </Link>
          <span className="hidden sm:inline">|</span>
          <Link href="/rooms" className="underline hover:opacity-100">
            Direct Link to Rooms
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-sm opacity-80">
          <div className="flex items-center justify-center space-x-2">
            <span>💳</span>
            <span>EVC, Zaad, Sahal</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>🏦</span>
            <span>Premier Bank</span>
          </div>
          <div className="flex items-center justify-center space-x-2">
            <span>🌍</span>
            <span>Dahabshiil, WorldRemit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
