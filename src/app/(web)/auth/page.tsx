'use client';

import { useEffect, useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { signIn, useSession, getProviders } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface Provider {
  id: string;
  name: string;
  type: string;
  signinUrl: string;
  callbackUrl: string;
}

const Auth = () => {
  const [providers, setProviders] = useState<Record<string, Provider> | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [router, session]);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const res = await getProviders();
        setProviders(res);
      } catch (error) {
        console.error('Error fetching providers:', error);
      }
    };
    fetchProviders();
  }, []);

  useEffect(() => {
    if (error) {
      switch (error) {
        case 'Configuration':
          toast.error('Authentication service not configured properly');
          break;
        case 'AccessDenied':
          toast.error('Access denied. Please try again.');
          break;
        case 'Verification':
          toast.error('Email verification failed. Please try again.');
          break;
        default:
          toast.error('Authentication failed. Please try again.');
      }
    }
  }, [error]);

  const handleSignIn = async (providerId: string) => {
    try {
      setLoading(providerId);
      const result = await signIn(providerId, {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        toast.error('Authentication failed. Please try again.');
      } else if (result?.url) {
        toast.success('Signing in...');
        router.push(result.url);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Authentication failed. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  const getProviderIcon = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return <FcGoogle className='text-2xl mr-3' />;
      case 'github':
        return <AiFillGithub className='text-2xl mr-3 text-gray-700' />;
      default:
        return null;
    }
  };

  const getProviderName = (providerId: string) => {
    switch (providerId) {
      case 'google':
        return 'Continue with Google';
      case 'github':
        return 'Continue with GitHub';
      default:
        return `Continue with ${providerId}`;
    }
  };

  return (
    <section className='container mx-auto py-12'>
      <div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Welcome to Hotelzz
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            Sign in to start booking your perfect stay
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className='space-y-3 mb-6'>
          {providers && Object.values(providers).map((provider) => {
            // Skip credentials provider as it's not configured
            if (provider.id === 'credentials') return null;
            
            return (
              <button
                key={provider.id}
                onClick={() => handleSignIn(provider.id)}
                disabled={loading === provider.id}
                className='w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600'
              >
                {loading === provider.id ? (
                  <div className='w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-3'></div>
                ) : (
                  getProviderIcon(provider.id)
                )}
                <span className='font-medium text-gray-900 dark:text-white'>
                  {loading === provider.id ? 'Signing in...' : getProviderName(provider.id)}
                </span>
              </button>
            );
          })}
          
          {/* Fallback if no providers available */}
          {!providers || Object.keys(providers).length === 0 && (
            <div className='text-center py-8'>
              <p className='text-gray-500 dark:text-gray-400 mb-4'>
                Authentication providers not available
              </p>
              <p className='text-sm text-gray-400 dark:text-gray-500'>
                Please contact support for assistance
              </p>
            </div>
          )}
        </div>

        {/* Information */}
        <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6'>
          <div className='flex items-start'>
            <div className='flex-shrink-0'>
              <svg className='w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z' clipRule='evenodd' />
              </svg>
            </div>
            <div className='ml-3'>
              <h3 className='text-sm font-medium text-blue-800 dark:text-blue-200'>
                Quick & Secure Authentication
              </h3>
              <p className='text-sm text-blue-700 dark:text-blue-300 mt-1'>
                Sign in with your existing Google or GitHub account for instant access.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className='space-y-3 mb-8'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white text-center'>
            Why sign in?
          </h3>
          <ul className='space-y-2 text-sm text-gray-600 dark:text-gray-300'>
            <li className='flex items-center'>
              <svg className='w-4 h-4 text-green-600 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
              Book rooms instantly with Somali payment options
            </li>
            <li className='flex items-center'>
              <svg className='w-4 h-4 text-green-600 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
              Track your booking history and preferences
            </li>
            <li className='flex items-center'>
              <svg className='w-4 h-4 text-green-600 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
              Leave reviews and ratings for rooms
            </li>
            <li className='flex items-center'>
              <svg className='w-4 h-4 text-green-600 mr-2' fill='currentColor' viewBox='0 0 20 20'>
                <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
              </svg>
              Get personalized recommendations
            </li>
          </ul>
        </div>

        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline transition-colors'
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Auth;
