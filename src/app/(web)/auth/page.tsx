'use client';

import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { AiFillGithub } from 'react-icons/ai';
import { FcGoogle } from 'react-icons/fc';
import { signUp } from 'next-auth-sanity/client';
import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const defaultFormData = {
  email: '',
  name: '',
  password: '',
};

const Auth = () => {
  const [formData, setFormData] = useState(defaultFormData);

  const inputStyles =
    'border border-gray-300 sm:text-sm text-black rounded-lg block w-full p-2.5 focus:outline-none';

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.push('/');
  }, [router, session]);

  const loginHandler = async () => {
    try {
      await signIn();
      router.push('/');
    } catch (error) {
      console.log(error);
      toast.error("Something wen't wrong");
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const user = await signUp(formData);
      if (user) {
        toast.success('Success. Please sign in');
      }
    } catch (error) {
      console.log(error);
      toast.error("Something wen't wrong");
    } finally {
      setFormData(defaultFormData);
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
            Sign in or create an account to start booking
          </p>
        </div>

        {/* Social Login Buttons */}
        <div className='space-y-3 mb-6'>
          <button
            onClick={loginHandler}
            className='w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300'
          >
            <FcGoogle className='text-2xl mr-3' />
            <span className='font-medium'>Continue with Google</span>
          </button>
          <button
            onClick={loginHandler}
            className='w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-300'
          >
            <AiFillGithub className='text-2xl mr-3 text-gray-700' />
            <span className='font-medium'>Continue with GitHub</span>
          </button>
        </div>

        <div className='relative mb-6'>
          <div className='absolute inset-0 flex items-center'>
            <div className='w-full border-t border-gray-300'></div>
          </div>
          <div className='relative flex justify-center text-sm'>
            <span className='px-2 bg-white dark:bg-gray-800 text-gray-500'>Or continue with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form className='space-y-4' onSubmit={handleSubmit}>
          <div>
            <label htmlFor='email' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Email Address
            </label>
            <input
              type='email'
              name='email'
              id='email'
              placeholder='Enter your email'
              required
              className={`${inputStyles} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='name' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Full Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              placeholder='Enter your full name'
              required
              className={`${inputStyles} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>

          <div>
            <label htmlFor='password' className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
              Password
            </label>
            <input
              type='password'
              name='password'
              id='password'
              placeholder='Create a password (min 6 characters)'
              required
              minLength={6}
              className={`${inputStyles} dark:bg-gray-700 dark:text-white dark:border-gray-600`}
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>

          <button
            type='submit'
            className='w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors duration-300'
          >
            Create Account
          </button>
        </form>

        <div className='mt-6 text-center'>
          <p className='text-sm text-gray-600 dark:text-gray-400'>
            Already have an account?{' '}
            <button
              onClick={loginHandler}
              className='text-primary font-semibold hover:underline'
            >
              Sign In
            </button>
          </p>
        </div>

        <div className='mt-8 text-center'>
          <Link
            href='/'
            className='text-sm text-gray-500 hover:text-gray-700 underline'
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Auth;
