// MetaMask utility functions to prevent connection errors

export const isMetaMaskAvailable = (): boolean => {
  if (typeof window === 'undefined') return false;
  return typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask === true;
};

export const safeMetaMaskConnect = async (): Promise<boolean> => {
  try {
    if (!isMetaMaskAvailable()) {
      console.log('MetaMask is not available');
      return false;
    }

    // Double-check that ethereum exists before using it
    if (!window.ethereum) {
      console.log('Ethereum object not found');
      return false;
    }

    // Check if already connected
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length > 0) {
      console.log('Already connected to MetaMask');
      return true;
    }

    // Request connection
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    console.log('Successfully connected to MetaMask');
    return true;
  } catch (error) {
    console.log('MetaMask connection failed:', error);
    return false;
  }
};

// Prevent MetaMask errors from appearing in console
export const suppressMetaMaskErrors = (): void => {
  if (typeof window === 'undefined') return;

  // Override console.error to filter out MetaMask-related errors
  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const errorMessage = args.join(' ');
    if (
      errorMessage.includes('MetaMask') ||
      errorMessage.includes('Failed to connect to MetaMask') ||
      errorMessage.includes('chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn')
    ) {
      // Silently ignore MetaMask-related errors
      return;
    }
    originalConsoleError.apply(console, args);
  };
};

// Initialize MetaMask error suppression
if (typeof window !== 'undefined') {
  suppressMetaMaskErrors();
} 