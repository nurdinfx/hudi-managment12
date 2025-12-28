'use client';

import Link from 'next/link';
import { useContext, useState, useRef, useEffect } from 'react';
import { FaUserCircle, FaSignOutAlt, FaUser, FaCog, FaChevronDown } from 'react-icons/fa';
import { MdDarkMode, MdOutlineLightMode, MdEmail, MdDashboard } from 'react-icons/md';
import { BsBookmarksFill } from 'react-icons/bs';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';
import Image from 'next/image';

import ThemeContext from '@/context/themeContext';

const Header = () => {
  const { darkTheme, setDarkTheme } = useContext(ThemeContext);
  const { data: session, status } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      setShowUserMenu(false);
      await signOut({ callbackUrl: '/' });
      toast.success('👋 Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const closeMenu = () => {
    setShowUserMenu(false);
  };

  return (
    <header className='py-10 px-4 container mx-auto text-xl flex flex-wrap md:flex-nowrap items-center justify-between'>
      <div className='flex items-center w-full md:2/3'>
        <Link href='/' className='font-black text-tertiary-dark'>
          Hotelzz
        </Link>
        <ul className='flex items-center ml-5'>
          <li className='flex items-center relative' ref={menuRef}>
            {/* User Icon Button - Shows for both logged in and logged out */}
            <button 
              onClick={session ? toggleUserMenu : () => window.location.href = '/auth'}
              className="relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {session?.user ? (
                // Logged in user - show profile image or user icon
                <>
                  {session.user.image ? (
                    <div className='w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20 hover:border-primary/50 transition-all duration-300'>
                      <Image
                        src={session.user.image}
                        alt={session.user.name || 'User'}
                        width={40}
                        height={40}
                        className='w-full h-full object-cover'
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-tertiary-dark rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300">
                      <FaUserCircle className='text-xl' />
                    </div>
                  )}
                  
                  {/* Online indicator */}
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                </>
              ) : (
                // Not logged in - show simple user icon
                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20 rounded-full flex items-center justify-center transition-all duration-300 group">
                  <FaUserCircle className='text-xl text-gray-600 dark:text-gray-300 group-hover:text-primary transition-colors duration-300' />
                </div>
              )}
            </button>

            {/* Professional Dropdown Menu - Only when logged in */}
            {session && showUserMenu && (
              <div className="absolute top-full right-0 mt-3 w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden animate-fadeInUp">
                {/* Header with user info */}
                <div className="px-6 py-4 bg-gradient-to-r from-primary/10 via-primary/5 to-tertiary-dark/10 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4">
                    {session.user.image ? (
                      <div className='w-12 h-12 rounded-full overflow-hidden border-2 border-primary/30'>
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={48}
                          height={48}
                          className='w-full h-full object-cover'
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-tertiary-dark rounded-full flex items-center justify-center text-white">
                        <FaUserCircle className='text-2xl' />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 dark:text-white text-base truncate">
                        {session.user.name || 'User'}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {session.user.email}
                      </p>
                      <div className="flex items-center mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 dark:text-green-400 font-medium">Online</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-2">
                  <Link
                    href={`/users/${session.user.id}`}
                    onClick={closeMenu}
                    className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FaUser className="text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">My Profile</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View bookings & settings</p>
                    </div>
                  </Link>

                  <Link
                    href="/rooms"
                    onClick={closeMenu}
                    className="flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <BsBookmarksFill className="text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Browse Rooms</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Find your perfect stay</p>
                    </div>
                  </Link>

                  <button
                    onClick={() => {
                      closeMenu();
                      // Add settings functionality here
                      toast.info('Settings coming soon!');
                    }}
                    className="w-full flex items-center px-6 py-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-all duration-200 group"
                  >
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FaCog className="text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-gray-900 dark:text-white text-sm">Preferences</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">App settings & notifications</p>
                    </div>
                  </button>
                </div>

                {/* Logout section */}
                <div className="border-t border-gray-200 dark:border-gray-700 p-2">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 text-red-600 dark:text-red-400 group"
                  >
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                      <FaSignOutAlt className="text-red-600 dark:text-red-400" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-sm">Sign Out</p>
                      <p className="text-xs opacity-75">See you later! 👋</p>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </li>
          
          {/* Theme toggle */}
          <li className='ml-4'>
            <button
              onClick={() => {
                if (darkTheme) {
                  setDarkTheme(false);
                  localStorage.removeItem('hotel-theme');
                } else {
                  setDarkTheme(true);
                  localStorage.setItem('hotel-theme', 'true');
                }
              }}
              className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 flex items-center justify-center transition-all duration-300 hover:scale-110"
            >
              {darkTheme ? (
                <MdOutlineLightMode className='text-xl text-yellow-500' />
              ) : (
                <MdDarkMode className='text-xl text-blue-600' />
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* Navigation menu */}
      <ul className='flex items-center justify-between w-full md:w-1/3 mt-4 gap-6'>
        <li className='hover:-translate-y-2 duration-500 transition-all'>
          <Link href='/' className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Home
          </Link>
        </li>
        <li className='hover:-translate-y-2 duration-500 transition-all'>
          <Link href='/rooms' className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Rooms
          </Link>
        </li>
        <li className='hover:-translate-y-2 duration-500 transition-all'>
          <Link href='/contact' className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors">
            Contact
          </Link>
        </li>
      </ul>
    </header>
  );
};

export default Header;
