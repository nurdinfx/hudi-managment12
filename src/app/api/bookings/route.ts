import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/libs/auth';
import { createBooking, updateHotelRoom } from '@/libs/supabaseApis';

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Authentication Required', { status: 401 });
  }

  try {
    const {
      hotelRoom,
      checkinDate,
      checkoutDate,
      numberOfDays,
      adults,
      children,
      totalPrice,
      discount,
    } = await req.json();

    if (!hotelRoom || !checkinDate || !checkoutDate || !numberOfDays || !adults || !children || !totalPrice) {
      return new NextResponse('All fields are required', { status: 400 });
    }

    const userId = session.user.id;

    // Create the booking
    const booking = await createBooking({
      hotelRoom,
      checkinDate,
      checkoutDate,
      numberOfDays,
      adults,
      children,
      totalPrice,
      discount,
      user: userId,
    });

    // Update hotel room availability
    await updateHotelRoom(hotelRoom);

    return NextResponse.json(booking, { status: 201, statusText: 'Booking created successfully' });
  } catch (error: any) {
    console.log('Error creating booking:', error);
    return new NextResponse(error.message || 'Unable to create booking', { status: 500 });
  }
}
