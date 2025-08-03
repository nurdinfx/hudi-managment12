'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    // Filter out common development/HMR errors that don't affect functionality
    const isHMRError = error.message?.includes('Failed to fetch') && 
                      (error.stack?.includes('webpack') || 
                       error.stack?.includes('hmrM') ||
                       error.stack?.includes('fullstory'));
    
    if (!isHMRError) {
      // Only log non-HMR errors
      this.setState({
        error,
        errorInfo
      });
    } else {
      // For HMR errors, just reset the error state
      setTimeout(() => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
      }, 100);
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset error state when children change (e.g., route change)
    if (prevProps.children !== this.props.children && this.state.hasError) {
      this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    }
  }

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
          <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mx-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Oops! Something went wrong
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-6">
                We encountered an unexpected error. Don&apos;t worry, we&apos;re on it!
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full bg-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
                >
                  🔄 Refresh Page
                </button>
                
                <button
                  onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                  className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    🐛 Debug Info (Development)
                  </summary>
                  <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono text-gray-600 dark:text-gray-300 overflow-auto max-h-32">
                    <strong>Error:</strong> {this.state.error.message}
                    {this.state.errorInfo && (
                      <>
                        <br /><br />
                        <strong>Stack:</strong>
                        <pre className="whitespace-pre-wrap text-xs">{this.state.errorInfo.componentStack}</pre>
                      </>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Simple hook version for functional components
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      // Log the error
      console.error('Caught error:', error);
      
      // Filter out HMR/development errors
      const isHMRError = error.message?.includes('Failed to fetch') && 
                        (error.stack?.includes('webpack') || 
                         error.stack?.includes('hmrM') ||
                         error.stack?.includes('fullstory'));
      
      if (isHMRError) {
        // Reset HMR errors automatically
        setError(null);
      }
    }
  }, [error]);

  return { error, setError, clearError: () => setError(null) };
}

// Global error handler for unhandled promises
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    // Prevent HMR/FullStory errors from showing in console
    if (event.reason?.message?.includes('Failed to fetch') && 
        (event.reason?.stack?.includes('webpack') || 
         event.reason?.stack?.includes('hmrM') ||
         event.reason?.stack?.includes('fullstory'))) {
      event.preventDefault();
      console.debug('Suppressed HMR fetch error:', event.reason.message);
    }
  });
}
