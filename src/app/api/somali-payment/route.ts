import { authOptions } from '@/libs/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getRoom } from '@/libs/apis';

// Somali Payment Methods
export type SomaliPaymentMethod = 
  | 'evc' 
  | 'zaad' 
  | 'sahal' 
  | 'premier_bank' 
  | 'amtel' 
  | 'dahabshiil' 
  | 'world_remit' 
  | 'taaj';

export interface SomaliPaymentRequest {
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  numberOfDays: number;
  hotelRoomSlug: string;
  paymentMethod: SomaliPaymentMethod;
  phoneNumber?: string; // For mobile money payments
  accountNumber?: string; // For bank transfers
}

export interface SomaliPaymentResponse {
  success: boolean;
  paymentId: string;
  amount: number;
  currency: string;
  paymentMethod: SomaliPaymentMethod;
  instructions: string;
  referenceNumber: string;
  expiresAt: string;
}

// Payment method configurations
const PAYMENT_METHODS = {
  evc: {
    name: 'EVC Plus',
    instructions: 'Send payment to: 252-61-1234567\nReference: {reference}',
    minAmount: 1,
    maxAmount: 10000,
    fee: 0.5, // 0.5% fee
  },
  zaad: {
    name: 'Zaad',
    instructions: 'Send payment to: 252-61-7654321\nReference: {reference}',
    minAmount: 1,
    maxAmount: 5000,
    fee: 0.3, // 0.3% fee
  },
  sahal: {
    name: 'Sahal',
    instructions: 'Send payment to: 252-61-9876543\nReference: {reference}',
    minAmount: 1,
    maxAmount: 3000,
    fee: 0.4, // 0.4% fee
  },
  premier_bank: {
    name: 'Premier Bank',
    instructions: 'Bank Transfer to:\nAccount: 1234567890\nReference: {reference}',
    minAmount: 10,
    maxAmount: 50000,
    fee: 0, // No fee for bank transfers
  },
  amtel: {
    name: 'Amtel',
    instructions: 'Send payment to: 252-61-1111111\nReference: {reference}',
    minAmount: 1,
    maxAmount: 2000,
    fee: 0.5, // 0.5% fee
  },
  dahabshiil: {
    name: 'Dahabshiil',
    instructions: 'Send payment to: 252-61-2222222\nReference: {reference}',
    minAmount: 5,
    maxAmount: 10000,
    fee: 0.2, // 0.2% fee
  },
  world_remit: {
    name: 'World Remit',
    instructions: 'Send payment via World Remit\nReference: {reference}',
    minAmount: 10,
    maxAmount: 20000,
    fee: 1.0, // 1% fee
  },
  taaj: {
    name: 'Taaj',
    instructions: 'Send payment to: 252-61-3333333\nReference: {reference}',
    minAmount: 1,
    maxAmount: 1500,
    fee: 0.3, // 0.3% fee
  },
};

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