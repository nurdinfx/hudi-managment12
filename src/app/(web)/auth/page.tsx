'use client';

import { useEffect, useState } from 'react';
import { AiFillGithub, AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { MdEmail, MdPerson, MdLock } from 'react-icons/md';
import { signIn, useSession, getProviders } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import SoftLoader from '@/components/SoftLoader/SoftLoader';

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
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [router, session, callbackUrl]);

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
        case 'CredentialsSignin':
          toast.error('Invalid email or password. Please try again.');
          break;
        default:
          toast.error('Authentication failed. Please try again.');
      }
    }
  }, [error]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (isSignUp) {
      if (!formData.name) {
        errors.name = 'Name is required';
      }
      if (!formData.confirmPassword) {
        errors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSocialSignIn = async (providerId: string) => {
    try {
      setLoading(providerId);
      const result = await signIn(providerId, {
        callbackUrl,
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

  const handleCredentialsAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading('credentials');
      
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        name: isSignUp ? formData.name : undefined,
        isSignUp: isSignUp.toString(),
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else if (result?.ok) {
        toast.success(isSignUp ? 'Account created successfully!' : 'Welcome back!');
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('Auth error:', error);
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
    <section className='container mx-auto py-12 px-4'>
      <div className='max-w-md mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Welcome to Hotelzz
          </h1>
          <p className='text-gray-600 dark:text-gray-300'>
            {isSignUp ? 'Create your account to start booking' : 'Sign in to your account'}
          </p>
        </div>

        {/* Auth Toggle */}
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 mb-6">
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setIsSignUp(false)}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                !isSignUp 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsSignUp(true)}
              className={`py-2 px-4 rounded-md text-sm font-medium transition-all duration-200 ${
                isSignUp 
                ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm' 
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className='space-y-3 mb-6'>
          {providers && Object.values(providers).map((provider) => {
            if (provider.id === 'credentials') return null;
            
            const isDemo = provider.id === 'demo';
            
            return (
              <button
                key={provider.id}
                onClick={() => handleSocialSignIn(provider.id)}
                disabled={loading === provider.id}
                className={`w-full flex items-center justify-center px-4 py-3 rounded-lg transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed group ${
                  isDemo 
                  ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:scale-[1.01]' 
                  : 'border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md hover:scale-[1.01]'
                }`}
              >
                {loading === provider.id ? (
                  <div className="flex items-center">
                    <div className={`w-5 h-5 border-2 rounded-full animate-spin mr-3 ${
                      isDemo ? 'border-white/30 border-t-white' : 'border-blue-600/30 border-t-blue-600'
                    }`}></div>
                    <span className={isDemo ? 'text-white' : 'text-gray-900 dark:text-white'}>
                      Signing in...
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="group-hover:scale-110 transition-transform duration-300">
                      {isDemo ? (
                        <svg className='w-5 h-5 mr-3' fill='currentColor' viewBox='0 0 20 20'>
                          <path fillRule='evenodd' d='M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z' clipRule='evenodd' />
                        </svg>
                      ) : (
                        getProviderIcon(provider.id)
                      )}
                    </div>
                    <span className={`font-medium ${isDemo ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                      {isDemo ? '🚀 Try Demo Account' : getProviderName(provider.id)}
                    </span>
                  </>
                )}
              </button>
            );
          })}
        </div>

        <div className='relative mb-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white dark:bg-gray-800 text-gray-500'>Or continue with email</span>
          </div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleCredentialsAuth} className='space-y-4'>
          {isSignUp && (
            <div>
              <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Full Name
              </label>
              <div className="relative">
                <MdPerson className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type='text'
                  name='name'
                  id='name'
                  placeholder='Enter your full name'
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                    formErrors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
              {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
            </div>
          )}

          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Email Address
            </label>
            <div className="relative">
              <MdEmail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type='email'
                name='email'
                id='email'
                placeholder='Enter your email'
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  formErrors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
            </div>
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
              Password
            </label>
            <div className="relative">
              <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name='password'
                id='password'
                placeholder={isSignUp ? 'Create a password (min 6 characters)' : 'Enter your password'}
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                  formErrors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
              </button>
            </div>
            {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
          </div>

          {isSignUp && (
            <div>
              <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Confirm Password
              </label>
              <div className="relative">
                <MdLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name='confirmPassword'
                  id='confirmPassword'
                  placeholder='Confirm your password'
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white transition-colors ${
                    formErrors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
              </div>
              {formErrors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formErrors.confirmPassword}</p>}
            </div>
          )}

          <button
            type='submit'
            disabled={loading === 'credentials'}
            className='w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:opacity-80 disabled:cursor-not-allowed disabled:scale-100 group'
          >
            {loading === 'credentials' ? (
              <div className="flex items-center justify-center">
                <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2'></div>
                <span>{isSignUp ? 'Creating Account...' : 'Signing In...'}</span>
              </div>
            ) : (
              <span className="group-hover:scale-105 transition-transform duration-300">
                {isSignUp ? '🎯 Create Account' : '🚀 Sign In'}
              </span>
            )}
          </button>
        </form>

        {/* Benefits */}
        <div className='mt-8 space-y-3'>
          <h3 className='text-lg font-semibold text-gray-900 dark:text-white text-center'>
            Why join Hotelzz?
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
