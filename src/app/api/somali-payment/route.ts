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
      language = 'en',
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

    // Validate phone number for mobile money and app payments
    const mobileMethods = ['evc', 'zaad', 'sahal', 'edahab'];
    if (mobileMethods.includes(paymentMethod) && !phoneNumber) {
      return new NextResponse('Phone number required for mobile payments', { status: 400 });
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
    const methodConfig = PAYMENT_METHODS[paymentMethod];
    const feeAmount = (baseAmount * methodConfig.fee) / 100;
    const totalAmount = baseAmount + feeAmount;

    // Validate amount limits
    if (totalAmount < methodConfig.minAmount) {
      return new NextResponse(
        `Minimum amount for ${methodConfig.name} is $${methodConfig.minAmount}`,
        { status: 400 }
      );
    }
    if (totalAmount > methodConfig.maxAmount) {
      return new NextResponse(
        `Maximum amount for ${methodConfig.name} is $${methodConfig.maxAmount}`,
        { status: 400 }
      );
    }

    // Generate unique payment ID and reference
    const { paymentId, referenceNumber } = generatePaymentReference();

    // Set expiration time (24 hours from now)
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    // Create payment record in Supabase
    const paymentData = {
      payment_id: paymentId,
      reference_number: referenceNumber,
      user_id: userId,
      room_id: room.id,
      amount: totalAmount,
      base_amount: baseAmount,
      fee_amount: feeAmount,
      currency: 'USD',
      payment_method: paymentMethod,
      checkin_date: formattedCheckinDate,
      checkout_date: formattedCheckoutDate,
      adults,
      children,
      number_of_days: numberOfDays,
      phone_number: phoneNumber || null,
      account_number: accountNumber || null,
      expires_at: expiresAt,
    };

    // Save payment to Supabase
    const savedPayment = await createPayment(paymentData);

    // Generate payment instructions in both languages
    const instructions = formatPaymentInstructions(paymentMethod, referenceNumber, language);
    const instructionsAr = language === 'en' ? formatPaymentInstructions(paymentMethod, referenceNumber, 'ar') : undefined;

    const response: SomaliPaymentResponse = {
      success: true,
      paymentId,
      amount: totalAmount,
      baseAmount,
      feeAmount,
      currency: 'USD',
      paymentMethod,
      instructions,
      instructionsAr,
      referenceNumber,
      expiresAt,
      provider: methodConfig.provider,
    };

    return NextResponse.json(response, {
      status: 200,
      statusText: 'Payment session created',
    });

  } catch (error: any) {
    console.error('Somali payment failed:', error);
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
