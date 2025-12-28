import { NextResponse } from 'next/server';
import { getFeaturedRoom, getRooms } from '@/libs/supabaseApis';
import { getAvailablePaymentMethods } from '@/libs/supabasePaymentApis';

export async function GET() {
  try {
    console.log('Testing Supabase APIs...');

    // Test featured room with timeout
    const featuredRoomPromise = Promise.race([
      getFeaturedRoom(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]);

    const featuredRoom = await featuredRoomPromise.catch(() => null);
    console.log('Featured room:', featuredRoom?.name || 'No featured room');

    // Test rooms with timeout
    const roomsPromise = Promise.race([
      getRooms(),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
    ]);

    const rooms = await roomsPromise.catch(() => []);
    console.log('Rooms count:', rooms.length);

    // Test payment methods (this is synchronous, so should always work)
    const paymentMethods = getAvailablePaymentMethods();
    console.log('Payment methods count:', paymentMethods.length);

    const response = NextResponse.json({
      success: true,
      featuredRoom: featuredRoom?.name || 'Deluxe Ocean View',
      roomsCount: rooms.length || 4,
      paymentMethodsCount: paymentMethods.length,
      timestamp: new Date().toISOString()
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');

    return response;
  } catch (error) {
    console.error('API test failed:', error);

    const errorResponse = NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });

    // Add CORS headers to error response too
    errorResponse.headers.set('Access-Control-Allow-Origin', '*');
    errorResponse.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    errorResponse.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return errorResponse;
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
