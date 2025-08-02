import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getRoom } from '@/libs/supabaseApis';
import {
  createPayment,
  PAYMENT_METHODS,
  generatePaymentReference,
  formatPaymentInstructions,
  getAvailablePaymentMethods,
  type SomaliPaymentMethod
} from '@/libs/supabasePaymentApis';

export interface SomaliPaymentRequest {
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  numberOfDays: number;
  hotelRoomSlug: string;
  paymentMethod: SomaliPaymentMethod;
  phoneNumber?: string;
  accountNumber?: string;
  language?: 'en' | 'ar';
}

export interface SomaliPaymentResponse {
  success: boolean;
  paymentId: string;
  amount: number;
  baseAmount: number;
  feeAmount: number;
  currency: string;
  paymentMethod: SomaliPaymentMethod;
  instructions: string;
  instructionsAr?: string;
  referenceNumber: string;
  expiresAt: string;
  provider: string;
}

export async function POST(req: Request) {
  try {
    const {
      checkinDate,
      checkoutDate,
      adults,
      children,
      hotelRoomSlug,
      numberOfDays,
      paymentMethod,
      phoneNumber,
      accountNumber,
    }: SomaliPaymentRequest = await req.json();

    // Validate required fields
    if (
      !checkinDate ||
      !checkoutDate ||
      !adults ||
      !hotelRoomSlug ||
      !numberOfDays ||
      !paymentMethod
    ) {
      return new NextResponse('All fields are required', { status: 400 });
    }

    // Validate payment method
    if (!PAYMENT_METHODS[paymentMethod]) {
      return new NextResponse('Invalid payment method', { status: 400 });
    }

    // Validate phone number for mobile money payments
    if (['evc', 'zaad', 'sahal', 'amtel', 'dahabshiil', 'taaj'].includes(paymentMethod) && !phoneNumber) {
      return new NextResponse('Phone number required for mobile money payments', { status: 400 });
    }

    // Validate account number for bank transfers
    if (paymentMethod === 'premier_bank' && !accountNumber) {
      return new NextResponse('Account number required for bank transfers', { status: 400 });
    }

    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return new NextResponse('Authentication required', { status: 401 });
    }

    const userId = session.user.id;
    const formattedCheckoutDate = checkoutDate.split('T')[0];
    const formattedCheckinDate = checkinDate.split('T')[0];

    // Get room details
    const room = await getRoom(hotelRoomSlug);
    
    if (!room) {
      return new NextResponse('Room not found', { status: 404 });
    }
    
    const discountPrice = room.price - (room.price / 100) * room.discount;
    const baseAmount = discountPrice * numberOfDays;
    
    // Calculate fees
    const feeAmount = (baseAmount * PAYMENT_METHODS[paymentMethod].fee) / 100;
    const totalAmount = baseAmount + feeAmount;

    // Validate amount limits
    const methodConfig = PAYMENT_METHODS[paymentMethod];
    if (totalAmount < methodConfig.minAmount) {
      return new NextResponse(`Minimum amount for ${methodConfig.name} is $${methodConfig.minAmount}`, { status: 400 });
    }
    if (totalAmount > methodConfig.maxAmount) {
      return new NextResponse(`Maximum amount for ${methodConfig.name} is $${methodConfig.maxAmount}`, { status: 400 });
    }

    // Generate unique payment ID and reference
    const paymentId = `SOM-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const referenceNumber = `REF-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Set expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Create payment record in Sanity (you'll need to create a payment schema)
    const paymentData = {
      _type: 'payment',
      paymentId,
      referenceNumber,
      userId,
      roomId: room._id,
      amount: totalAmount,
      baseAmount,
      feeAmount,
      currency: 'USD',
      paymentMethod,
      status: 'pending',
      checkinDate: formattedCheckinDate,
      checkoutDate: formattedCheckoutDate,
      adults,
      children,
      numberOfDays,
      phoneNumber,
      accountNumber,
      expiresAt,
      createdAt: new Date().toISOString(),
    };

    // TODO: Save payment to Sanity database
    // const savedPayment = await sanityClient.create(paymentData);

    // Generate payment instructions
    const instructions = methodConfig.instructions.replace('{reference}', referenceNumber);

    const response: SomaliPaymentResponse = {
      success: true,
      paymentId,
      amount: totalAmount,
      currency: 'USD',
      paymentMethod,
      instructions,
      referenceNumber,
      expiresAt,
    };

    return NextResponse.json(response, {
      status: 200,
      statusText: 'Payment session created',
    });

  } catch (error: any) {
    console.log('Somali payment failed:', error);
    return new NextResponse(error.message || 'Payment failed', { status: 500 });
  }
}

// Get available payment methods
export async function GET() {
  const methods = Object.entries(PAYMENT_METHODS).map(([key, config]) => ({
    id: key,
    name: config.name,
    minAmount: config.minAmount,
    maxAmount: config.maxAmount,
    fee: config.fee,
    type: ['evc', 'zaad', 'sahal', 'amtel', 'dahabshiil', 'taaj'].includes(key) ? 'mobile_money' : 
          key === 'premier_bank' ? 'bank_transfer' : 'remittance',
  }));

  return NextResponse.json({ methods });
}
