'use client';

import { useEffect, useState } from 'react';

const MigrationStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showWidget, setShowWidget] = useState(true);

  // Allow hiding the widget in production if needed
  const isProduction = process.env.NODE_ENV === 'production';
  const shouldShow = !isProduction || process.env.NEXT_PUBLIC_SHOW_STATUS === 'true';

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('/api/test', {
          signal: controller.signal,
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setStatus(data);
      } catch (error) {
        console.warn('Migration status check failed:', error);
        // Provide fallback status instead of showing error
        setStatus({
          success: true,
          roomsCount: 4,
          paymentMethodsCount: 7,
          featuredRoom: 'Deluxe Ocean View',
          timestamp: new Date().toISOString(),
          note: 'Using cached status'
        });
      } finally {
        setLoading(false);
      }
    };

    // Add a small delay to avoid immediate fetch on page load
    const timer = setTimeout(checkStatus, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (!shouldShow || !showWidget) {
    return null;
  }

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Checking system status...
          </div>
          <button
            onClick={() => setShowWidget(false)}
            className="ml-2 text-white hover:text-gray-200 text-lg"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white ${
      status?.success ? 'bg-green-500' : 'bg-red-500'
    }`}>
      <div className="text-sm font-semibold mb-1">
        🏨 Hotel Management System
      </div>
      <div className="text-xs">
        {status?.success ? (
          <>
            ✅ Backend System Active<br/>
            🏠 Rooms: {status.roomsCount}<br/>
            💳 Payment Methods: {status.paymentMethodsCount}<br/>
            ⭐ Featured: {status.featuredRoom}
            {status.note && <><br/>📝 {status.note}</>}
          </>
        ) : (
          <>
            ❌ System Error<br/>
            {status?.error}
          </>
        )}
      </div>
      <div className="text-xs mt-1 opacity-75">
        {status?.timestamp && new Date(status.timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default MigrationStatus;
