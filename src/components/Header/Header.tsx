'use client';

import Link from 'next/link';
import { useContext, useState } from 'react';
import { FaUserCircle, FaSignOutAlt, FaCog, FaUser, FaChevronDown } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

import ThemeContext from '@/context/themeContext';
import Image from 'next/image';

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut({ callbackUrl: '/' });
      toast.success('Successfully logged out');
      setShowUserMenu(false);
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  return (
    <header className='py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between'>
      <div className='flex items-center w-full md:2/3'>
        <Link href='/' className='font-black text-tertiary-dark'>
          Hotelzz
        </Link>
        <ul className='flex items-center ml-5'>
          <li className='flex items-center relative'>
            {session?.user ? (
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 bg-primary/10 hover:bg-primary/20 px-3 py-2 rounded-lg transition-all duration-300 group"
                >
                  {session.user.image ? (
                    <div className='w-8 h-8 rounded-full overflow-hidden'>
                      <Image
                        src={session.user.image}
                        alt={session.user.name!}
                        width={32}
                        height={32}
                        className='scale-animation img'
                      />
                    </div>
                  ) : (
                    <FaUserCircle className='text-2xl text-primary' />
                  )}
                  <div className="hidden md:block">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{session.user.name}</span>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">Online</span>
                    </div>
                  </div>
                  <FaChevronDown className={`text-xs text-gray-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <>
                    {/* Backdrop */}
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    
                    {/* Menu */}
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 z-20 overflow-hidden">
                      {/* User Info */}
                      <div className="px-4 py-3 bg-gradient-to-r from-primary/10 to-tertiary-dark/10 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          {session.user.image ? (
                            <div className='w-12 h-12 rounded-full overflow-hidden'>
                              <Image
                                src={session.user.image}
                                alt={session.user.name!}
                                width={48}
                                height={48}
                                className='scale-animation img'
                              />
                            </div>
                          ) : (
                            <FaUserCircle className='text-3xl text-primary' />
                          )}
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">{session.user.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{session.user.email}</p>
                            <div className="flex items-center space-x-1 mt-1">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          href={`/users/${session.user.id}`}
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaUser className="text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">My Profile</span>
                            <p className="text-xs text-gray-500">View bookings and settings</p>
                          </div>
                        </Link>
                        
                        <Link
                          href="/rooms"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <FaCog className="text-gray-500" />
                          <div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">Browse Rooms</span>
                            <p className="text-xs text-gray-500">Find your perfect stay</p>
                          </div>
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="border-t border-gray-200 dark:border-gray-700">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                        >
                          <FaSignOutAlt />
                          <span className="text-sm font-medium">Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href='/auth' className="flex items-center space-x-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-300">
                <FaUserCircle className='text-xl' />
                <span className="text-sm font-medium">Sign In</span>
              </Link>
            )}
          </li>
          <li className='ml-4'>
            {darkTheme ? (
              <MdOutlineLightMode
                className='cursor-pointer text-2xl hover:text-yellow-500 transition-colors'
                onClick={() => {
                  setDarkTheme(false);
                  localStorage.removeItem('hotel-theme');
                }}
              />
            ) : (
              <MdDarkMode
                className='cursor-pointer text-2xl hover:text-blue-500 transition-colors'
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
