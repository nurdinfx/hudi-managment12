'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useSession } from 'next-auth/react';

import ThemeContext from '@/context/themeContext';
import Image from 'next/image';

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);

  const { data: session } = useSession();

  return (
    <header className='py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between'>
      <div className='flex items-center w-full md:2/3'>
        <Link href='/' className='font-black text-tertiary-dark'>
          Hotelzz
        </Link>
        <ul className='flex items-center ml-5'>
          <li className='flex items-center'>
            {session?.user ? (
              <div className="flex items-center space-x-2">
                <Link href={`/users/${session.user.id}`} className="flex items-center space-x-2">
                  {session.user.image ? (
                    <div className='w-10 h-10 rounded-full overflow-hidden'>
                      <Image
                        src={session.user.image}
                        alt={session.user.name!}
                        width={40}
                        height={40}
                        className='scale-animation img'
                      />
                    </div>
                  ) : (
                    <FaUserCircle className='cursor-pointer text-2xl' />
                  )}
                  <span className="hidden md:block text-sm font-medium">{session.user.name}</span>
                </Link>
                <div className="w-2 h-2 bg-green-500 rounded-full" title="Signed in"></div>
              </div>
            ) : (
              <Link href='/auth' className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-300">
                <FaUserCircle className='text-xl' />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
          </li>
          <li className='ml-2'>
            {darkTheme ? (
              <MdOutlineLightMode
                className='cursor-pointer'
                onClick={() => {
                  setDarkTheme(false);
                  localStorage.removeItem('hotel-theme');
                }}
              />
            ) : (
              <MdDarkMode
                className='cursor-pointer'
                onClick={() => {
                  setDarkTheme(true);
                  localStorage.setItem('hotel-theme', 'true');
                }}
              />
            )}
          </li>
        </ul>
      </div>

      <ul className='flex items-center justify-between w-full md:w-1/3 mt-4 gap-6'>
        <li className='hover:-translate-y-2 duration-500 transition-all'>
          <Link href='/'>Home</Link>
        </li>
        <li className='hover:-translate-y-2 duration-500 transition-all'>
          <Link href='/rooms'>Rooms</Link>
        </li>
        <li className='hover:-translate-y-2 duration-500 transition-all'>
          <Link href='/contact'>Contact</Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
