'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const AuthPrompt = () => {
  const { data: session, status } = useSession();

  // Don't show if user is signed in or still loading
  if (status === 'loading' || session) return null;

  return (
    <div className="bg-gradient-to-r from-primary to-tertiary-dark text-white py-8">
      <div className="container mx-auto px-4 text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Book Your Perfect Stay?</h3>
        <p className="text-lg mb-6 opacity-90">
          Sign in to access instant booking, Somali payment methods, and manage your reservations
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/auth"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            Sign In / Sign Up
          </Link>
          <Link 
            href="/rooms"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300"
          >
            Browse Rooms
          </Link>
        </div>
        <div className="mt-6 flex justify-center space-x-6 text-sm opacity-80">
          <div className="flex items-center space-x-2">
            <span>💳</span>
            <span>EVC, Zaad, Sahal</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🏦</span>
            <span>Premier Bank</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>🌍</span>
            <span>Dahabshiil, WorldRemit</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPrompt;
