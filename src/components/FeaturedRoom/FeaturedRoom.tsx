'use client';

import { FC } from 'react';
import Image from 'next/image';

import { Room } from '@/models/room';
import Link from 'next/link';

type Props = {
  featuredRoom: Room | null;
};

const FeaturedRoom: FC<Props> = props => {
  const { featuredRoom } = props;

  // Handle null/undefined featuredRoom
  if (!featuredRoom) {
    return (
      <section className='flex md:flex-row flex-col px-4 py-10 items-center gap-12 container mx-auto'>
        <div className='md:grid gap-8 grid-cols-1'>
          <div className='rounded-2xl overflow-hidden h-48 mb-4 md:mb-0 bg-gray-200 animate-pulse'></div>
          <div className='grid grid-cols-2 gap-8 h-48'>
            <div className='rounded-2xl overflow-hidden bg-gray-200 animate-pulse'></div>
            <div className='rounded-2xl overflow-hidden bg-gray-200 animate-pulse'></div>
          </div>
        </div>
        <div className='md:py-10 md:w-1/2 text-left'>
          <h3 className='font-heading mb-12'>Featured Room</h3>
          <p className='font-normal max-w-md text-gray-500'>Loading featured room...</p>
        </div>
      </section>
    );
  }

  // Safely get additional images without mutating the original array
  const additionalImages = featuredRoom.images?.slice(1, 3) || [];

  return (
    <section className='flex md:flex-row flex-col px-4 py-10 items-center gap-12 container mx-auto'>
      <div className='md:grid gap-8 grid-cols-1'>
        <div className='rounded-2xl overflow-hidden h-48 mb-4 md:mb-0'>
          <Image
            src={featuredRoom.coverImage?.url || '/images/hero-1.jpeg'}
            alt={featuredRoom.name || 'Featured Room'}
            width={300}
            height={300}
            className='img scale-animation'
            priority
          />
        </div>
        <div className='grid grid-cols-2 gap-8 h-48'>
          {additionalImages.map((image, index) => (
            <div key={image._key || index} className='rounded-2xl overflow-hidden'>
              <Image
                src={image.url || '/images/hero-1.jpeg'}
                alt={image._key || `Room image ${index + 1}`}
                width={300}
                height={300}
                className='img scale-animation'
              />
            </div>
          ))}
          {/* Fill empty slots if less than 2 additional images */}
          {additionalImages.length < 2 && (
            <>
              {Array.from({ length: 2 - additionalImages.length }).map((_, index) => (
                <div key={`empty-${index}`} className='rounded-2xl overflow-hidden bg-gray-200'></div>
              ))}
            </>
          )}
        </div>
      </div>

      <div className='md:py-10 md:w-1/2 text-left'>
        <h3 className='font-heading mb-12'>Featured Room</h3>

        <p className='font-normal max-w-md'>{featuredRoom.description || 'Experience luxury and comfort in our premium accommodations.'}</p>

        <div className='flex flex-col md:flex-row md:items-end justify-between mt-5'>
          <div className='flex mb-3 md:mb-0'>
            <div className='flex gap-3 flex-col items-center justify-center mr-4'>
              <p className='text-xs lg:text-xl text-center'>Start From</p>
              <p className='md:font-bold flex font-medium text-lg xl:text-5xl'>
                $ {featuredRoom.price || 0}
              </p>
            </div>
            <div className='flex gap-3 flex-col items-center justify-center mr-4'>
              <p className='text-xs lg:text-xl text-center'>Discount</p>
              <p className='md:font-bold flex font-medium text-lg xl:text-5xl'>
                $ {featuredRoom.discount || 0}
              </p>
            </div>
          </div>

          <Link
            href={`/rooms/${featuredRoom.slug?.current || 'luxury-suite'}`}
            className='border h-fit text-center border-tertiary-dark text-tertiary-dark px-3 py-2 lg:py-5 lg:px-7 rounded-2xl font-bold lg:text-xl hover:bg-tertiary-dark hover:text-white transition-colors duration-300'
          >
            More Details
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedRoom;
