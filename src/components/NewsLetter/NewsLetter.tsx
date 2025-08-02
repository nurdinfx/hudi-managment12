'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

const NewsLetter = () => {
  const { data: session } = useSession();

  return (
    <section className='container mx-auto px-4'>
      <div className='bg-primary text-white px-4 rounded-xl md:rounded-[30px] flex flex-col justify-center items-center py-6 md:py-24'>
        <p className='md:font-semibold text-lg md:text-xl text-center mb-3'>
          {session ? 'Stay Updated with Our Latest Offers' : 'Join Our Hotel Community'}
        </p>
        <h6 className='md:font-semibold font-medium text-2xl md:text-3xl lg:text-5xl text-center mb-4'>
          {session ? 'Sign Up for Our Newsletter' : 'Create Your Account Today'}
        </h6>

        {session ? (
          // Newsletter signup for signed-in users
          <form className='flex-col justify-center w-full md:flex-row flex pt-8'>
            <input
              type='email'
              placeholder='Your email'
              className='bg-[#026057] h-11 md:h-16 mb-2 md:mb-0 rounded-xl pl-6 md:mr-5 md:w-[452px] text-white placeholder:text-white focus:outline-none'
            />
            <button type='submit' className='btn-tertiary'>
              Subscribe
            </button>
          </form>
        ) : (
          // Auth CTA for non-signed-in users
          <div className='flex-col justify-center w-full md:flex-row flex pt-8 space-y-4 md:space-y-0 md:space-x-4'>
            <Link
              href='/auth'
              className='bg-secondary text-black px-8 py-4 rounded-xl font-bold text-lg hover:bg-secondary/90 transition-colors duration-300 text-center'
            >
              🚀 Sign Up Now
            </Link>
            <Link
              href='/rooms'
              className='bg-[#026057] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#026057]/90 transition-colors duration-300 text-center'
            >
              🏠 Browse Rooms
            </Link>
          </div>
        )}

        {!session && (
          <p className='text-center mt-6 opacity-90 max-w-md'>
            Sign up to access exclusive deals, instant booking, and Somali payment methods
          </p>
        )}
      </div>
    </section>
  );
};

export default NewsLetter;
