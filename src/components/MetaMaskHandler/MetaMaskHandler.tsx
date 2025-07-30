'use client';

import { useEffect } from 'react';
import { suppressMetaMaskErrors } from '@/libs/metamask';

const MetaMaskHandler = () => {
  useEffect(() => {
    // Suppress MetaMask errors on component mount
    suppressMetaMaskErrors();
  }, []);

  // This component doesn't render anything, it just handles MetaMask error suppression
  return null;
};

export default MetaMaskHandler; 