'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

import { getRooms } from '@/libs/supabaseApis';
import { Room } from '@/models/supabaseTypes';
import Search from '@/components/Search/Search';
import RoomCard from '@/components/RoomCard/RoomCard';
import SkeletonLoader from '@/components/SkeletonLoader/SkeletonLoader';
import SoftLoader from '@/components/SoftLoader/SoftLoader';

const Rooms = () => {
  const [roomTypeFilter, setRoomTypeFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();

  useEffect(() => {
    const searchQuery = searchParams.get('searchQuery');
    const roomType = searchParams.get('roomType');

    if (roomType) setRoomTypeFilter(roomType);
    if (searchQuery) setSearchQuery(searchQuery);
  }, [searchParams]);

  async function fetchData() {
    return getRooms();
  }

  const { data, error, isLoading } = useSWR('get/hotelRooms', fetchData);

  const filterRooms = (rooms: Room[]) => {
    if (!rooms || !Array.isArray(rooms)) return [];

    return rooms.filter(room => {
      // Apply room type filter
      if (
        roomTypeFilter &&
        roomTypeFilter.toLowerCase() !== 'all' &&
        room.type.toLowerCase() !== roomTypeFilter.toLowerCase()
      ) {
        return false;
      }

      //   Apply search query filter
      if (
        searchQuery &&
        !room.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      return true;
    });
  };

  const filteredRooms = filterRooms(data || []);

  return (
    <div className='container mx-auto pt-10 px-4'>
      <Search
        roomTypeFilter={roomTypeFilter}
        searchQuery={searchQuery}
        setRoomTypeFilter={setRoomTypeFilter}
        setSearchQuery={setSearchQuery}
      />

      {isLoading ? (
        <div className="mt-20">
          <div className="text-center mb-8">
            <SoftLoader
              size="medium"
              color="primary"
              text="Finding your perfect room"
            />
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonLoader
                key={index}
                variant="room-card"
                className="animate-soft-pulse"
              />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center mt-20">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Error loading rooms</p>
            <p>Please try refreshing the page or contact support.</p>
          </div>
        </div>
      ) : filteredRooms.length === 0 ? (
        <div className="text-center mt-20">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-400 dark:border-yellow-600 text-yellow-700 dark:text-yellow-300 px-6 py-8 rounded-xl max-w-md mx-auto">
            <h3 className="font-bold text-lg mb-2">No rooms found</h3>
            <p className="mb-4">Try adjusting your search criteria or browse all available rooms.</p>
            <button
              onClick={() => {
                setRoomTypeFilter('');
                setSearchQuery('');
              }}
              className="bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              🔄 Clear Filters
            </button>
          </div>
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-20'>
          {filteredRooms.map(room => (
            <RoomCard key={room.id || room._id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Rooms;
