import { FC, useState } from 'react';
import Image from 'next/image';

import { Room } from '@/models/supabaseTypes';
import Link from 'next/link';
import QuickBookModal from '@/components/QuickBookModal/QuickBookModal';

type Props = {
  room: Room;
};

const RoomCard: FC<Props> = props => {
  const {
    room,
    room: { cover_image, name, price, type, description, slug, is_booked },
  } = props;

  const [isQuickBookOpen, setIsQuickBookOpen] = useState(false);

  const handleQuickBookClick = () => {
    console.log('Quick Book clicked for room:', room.name);
    setIsQuickBookOpen(true);
  };

  return (
    <div className='rounded-xl w-full max-w-sm mb-10 mx-auto overflow-hidden text-black bg-white shadow-lg hover:shadow-xl transition-shadow duration-300'>
      <div className='h-60 overflow-hidden relative'>
        <Image
          src={cover_image || '/images/hero-1.jpeg'}
          alt={name}
          width={400}
          height={240}
          className='img scale-animation object-cover'
        />
        {is_booked && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
            BOOKED
          </div>
        )}
      </div>

      <div className='p-4'>
        <div className='flex justify-between items-start mb-2'>
          <h3 className='text-lg font-bold text-gray-900 leading-tight'>{name}</h3>
          <div className="text-right">
            <p className='text-xl font-bold text-primary'>${price}</p>
            {room.discount > 0 && (
              <p className='text-sm text-green-600'>-{room.discount}% off</p>
            )}
          </div>
        </div>

        <p className='text-sm text-gray-600 mb-2'>{type} Room • {room.dimension}</p>

        <p className='text-sm text-gray-700 mb-4 line-clamp-3'>{description.slice(0, 120)}...</p>

        <div className="space-y-2">
          <button
            onClick={handleQuickBookClick}
            disabled={is_booked}
            className={`w-full py-3 rounded-lg text-white text-base font-semibold transition-all duration-300 ${
              is_booked
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 hover:shadow-lg active:transform active:scale-95'
            }`}
            type="button"
          >
            {is_booked ? '🔒 ROOM BOOKED' : '⚡ QUICK BOOK NOW'}
          </button>

          <Link
            href={`/rooms/${slug}`}
            className='bg-gray-100 text-gray-700 inline-block text-center w-full py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-all duration-300 border border-gray-300'
          >
            📋 View Full Details
          </Link>
        </div>
      </div>

      <QuickBookModal
        isOpen={isQuickBookOpen}
        onClose={() => setIsQuickBookOpen(false)}
        room={room}
      />
    </div>
  );
};

export default RoomCard;
