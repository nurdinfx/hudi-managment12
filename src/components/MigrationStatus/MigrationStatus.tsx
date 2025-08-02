'use client';

import { useEffect, useState } from 'react';

const MigrationStatus = () => {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch('/api/test');
        const data = await response.json();
        setStatus(data);
      } catch (error) {
        setStatus({ success: false, error: 'Failed to fetch status' });
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
  }, []);

  if (loading) {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded-lg shadow-lg">
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Checking system status...
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
            ✅ Supabase Migration Complete<br/>
            🏠 Rooms: {status.roomsCount}<br/>
            💳 Payment Methods: {status.paymentMethodsCount}<br/>
            ⭐ Featured: {status.featuredRoom}
          </>
        ) : (
          <>
            ❌ System Error<br/>
            {status?.error}
          </>
        )}
      </div>
      <div className="text-xs mt-1 opacity-75">
        {status?.timestamp}
      </div>
    </div>
  );
};

export default MigrationStatus;
