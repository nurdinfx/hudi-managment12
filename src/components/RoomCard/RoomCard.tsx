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

  return (
    <div className='rounded-xl w-72 mb-10 mx-auto md:mx-0 overflow-hidden text-black'>
      <div className='h-60 overflow-hidden'>
        <Image
          src={cover_image || '/images/hero-1.jpeg'}
          alt={name}
          width={250}
          height={250}
          className='img scale-animation'
        />
      </div>

      <div className='p-4 bg-white'>
        <div className='flex justify-between text-xl font-semibold'>
          <p>{name}</p>
          <p>$ {price}</p>
        </div>

        <p className='pt-2 text-xs'>{type} Room</p>

        <p className='pt-3 pb-6'>{description.slice(0, 100)}...</p>

        <div className="space-y-2">
          <button
            onClick={() => setIsQuickBookOpen(true)}
            disabled={is_booked}
            className={`w-full py-3 rounded-xl text-white text-lg font-bold transition-all duration-500 ${
              is_booked
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary hover:-translate-y-2 hover:shadow-lg'
            }`}
          >
            {is_booked ? '🔒 BOOKED' : '⚡ QUICK BOOK'}
          </button>

          <Link
            href={`/rooms/${slug}`}
            className='bg-secondary text-black inline-block text-center w-full py-2 rounded-xl text-base font-semibold hover:bg-secondary/90 transition-all duration-300'
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
