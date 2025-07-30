import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';

import { authOptions } from '@/libs/auth';
import { getUserBookings } from '@/libs/apis';

export async function GET(req: Request, res: Response) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new NextResponse('Authentication Required', { status: 401 });
  }

  const userId = session.user.id;

  try {
    const bookings = await getUserBookings(userId);
    return NextResponse.json(bookings, { status: 200, statusText: 'Successful' });
  } catch (error) {
    console.log('Error fetching user bookings:', error);
    return new NextResponse('Unable to fetch bookings', { status: 400 });
  }
} 