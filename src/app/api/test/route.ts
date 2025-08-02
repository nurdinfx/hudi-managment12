import { NextResponse } from 'next/server';
import { getFeaturedRoom, getRooms } from '@/libs/supabaseApis';
import { getAvailablePaymentMethods } from '@/libs/supabasePaymentApis';

export async function GET() {
  try {
    console.log('Testing Supabase APIs...');
    
    // Test featured room
    const featuredRoom = await getFeaturedRoom();
    console.log('Featured room:', featuredRoom?.name || 'No featured room');
    
    // Test rooms
    const rooms = await getRooms();
    console.log('Rooms count:', rooms.length);
    
    // Test payment methods
    const paymentMethods = getAvailablePaymentMethods();
    console.log('Payment methods count:', paymentMethods.length);
    
    return NextResponse.json({
      success: true,
      featuredRoom: featuredRoom?.name || 'No featured room',
      roomsCount: rooms.length,
      paymentMethodsCount: paymentMethods.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API test failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
