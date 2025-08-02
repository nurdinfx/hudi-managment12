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

        <Link
          href={`/rooms/${slug}`}
          className='bg-primary inline-block text-center w-full py-4 rounded-xl text-white text-xl font-bold hover:-translate-y-2 hover:shadow-lg transition-all duration-500'
        >
          {is_booked ? 'BOOKED' : 'BOOK NOW'}
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;
