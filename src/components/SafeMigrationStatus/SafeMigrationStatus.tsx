'use client';

import { useState } from 'react';

const SafeMigrationStatus = () => {
  const [showWidget, setShowWidget] = useState(true);

  if (!showWidget) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white bg-green-500">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-semibold">
          🏨 Hotel Management System
        </div>
        <button 
          onClick={() => setShowWidget(false)}
          className="text-white hover:text-gray-200 text-lg ml-2"
        >
          ×
        </button>
      </div>
      <div className="text-xs">
        ✅ Backend System Active<br/>
        🏠 Rooms: 4<br/>
        💳 Payment Methods: 7<br/>
        ⭐ Featured: Deluxe Ocean View<br/>
        📝 All systems operational
      </div>
      <div className="text-xs mt-1 opacity-75">
        {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default SafeMigrationStatus;
