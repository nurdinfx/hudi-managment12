import { authOptionsSupabase } from '@/libs/authSupabase';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { 
  createPayment, 
  generatePaymentReference, 
  validatePaymentMethod,
  PAYMENT_METHODS 
} from '@/libs/supabasePaymentApis';
import { 
  isDemoMode, 
  getPaymentConfig, 
  getDemoPaymentResult,
  formatSomaliPhoneNumber,
  generateDemoReference 
} from '@/libs/paymentConfig';

interface PaymentRequest {
  checkinDate: string;
  checkoutDate: string;
  adults: number;
  children: number;
  numberOfDays: number;
  hotelRoomSlug: string;
  paymentMethod: string;
  phoneNumber?: string;
  accountNumber?: string;
}

// Demo payment processing simulation
async function processDemoPayment(
  paymentMethod: string,
  amount: number,
  phoneNumber?: string,
  accountNumber?: string
): Promise<{
  success: boolean;
  reference: string;
  transactionId?: string;
  message: string;
  expiresAt: string;
}> {
  // Simulate processing time
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const reference = generateDemoReference(paymentMethod);
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours
  
  // Get demo result (success or failure based on configured success rate)
  const result = getDemoPaymentResult();
  
  if (result.success) {
    return {
      success: true,
      reference,
      transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      message: 'Payment instructions generated successfully',
      expiresAt
    };
  } else {
    return {
      success: false,
      reference,
      message: result.message,
      expiresAt
    };
  }
}

// Production payment processing (placeholder for real integration)
async function processProductionPayment(
  paymentMethod: string,
  amount: number,
  phoneNumber?: string,
  accountNumber?: string
): Promise<{
  success: boolean;
  reference: string;
  transactionId?: string;
  message: string;
  expiresAt: string;
}> {
  const config = getPaymentConfig(paymentMethod.toUpperCase() as any);
  const { paymentId, referenceNumber } = generatePaymentReference();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  try {
    // Real payment gateway integration would go here
    switch (paymentMethod) {
      case 'evc':
      case 'zaad': 
      case 'sahal': {
        // Mobile money integration
        const formattedPhone = phoneNumber ? formatSomaliPhoneNumber(phoneNumber) : '';
        
        // Example API call structure (would be real in production)
        const paymentResponse = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId: config.merchantId,
            amount: amount,
            currency: 'USD',
            phoneNumber: formattedPhone,
            reference: referenceNumber,
            description: 'Hotel Room Booking Payment',
            callbackUrl: process.env.PAYMENT_WEBHOOK_URL,
          }),
        });
        
        if (!paymentResponse.ok) {
          throw new Error('Payment gateway error');
        }
        
        const data = await paymentResponse.json();
        
        return {
          success: true,
          reference: referenceNumber,
          transactionId: data.transactionId,
          message: 'Payment initiated successfully',
          expiresAt
        };
      }
      
      case 'edahab': {
        // eDahab app integration
        const paymentResponse = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            merchantId: config.merchantId,
            amount: amount,
            currency: 'USD',
            reference: referenceNumber,
            description: 'Hotel Room Booking Payment',
            callbackUrl: process.env.PAYMENT_WEBHOOK_URL,
          }),
        });
        
        if (!paymentResponse.ok) {
          throw new Error('eDahab payment gateway error');
        }
        
        const data = await paymentResponse.json();
        
        return {
          success: true,
          reference: referenceNumber,
          transactionId: data.transactionId,
          message: 'eDahab payment initiated successfully',
          expiresAt
        };
      }
      
      case 'premier_bank': {
        // Bank transfer integration
        return {
          success: true,
          reference: referenceNumber,
          message: 'Bank transfer details generated',
          expiresAt
        };
      }
      
      case 'dahabshiil': {
        // Dahabshiil integration
        const paymentResponse = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            agentCode: config.agentCode,
            amount: amount,
            currency: 'USD',
            reference: referenceNumber,
            description: 'Hotel Room Booking Payment',
          }),
        });
        
        if (!paymentResponse.ok) {
          throw new Error('Dahabshiil payment gateway error');
        }
        
        const data = await paymentResponse.json();
        
        return {
          success: true,
          reference: referenceNumber,
          transactionId: data.transactionId,
          message: 'Dahabshiil payment initiated successfully',
          expiresAt
        };
      }
      
      case 'world_remit': {
        // WorldRemit integration
        const paymentResponse = await fetch(config.apiUrl, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partnerId: config.partnerId,
            amount: amount,
            currency: 'USD',
            reference: referenceNumber,
            description: 'Hotel Room Booking Payment',
          }),
        });
        
        if (!paymentResponse.ok) {
          throw new Error('WorldRemit payment gateway error');
        }
        
        const data = await paymentResponse.json();
        
        return {
          success: true,
          reference: referenceNumber,
          transactionId: data.transactionId,
          message: 'WorldRemit payment initiated successfully',
          expiresAt
        };
      }
      
      default:
        throw new Error('Unsupported payment method');
    }
  } catch (error) {
    console.error('Production payment error:', error);
    return {
      success: false,
      reference: referenceNumber,
      message: 'Payment processing failed. Please try again.',
      expiresAt
    };
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptionsSupabase);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body: PaymentRequest = await req.json();
    const {
      checkinDate,
      checkoutDate,
      adults,
      children,
      numberOfDays,
      hotelRoomSlug,
      paymentMethod,
      phoneNumber,
      accountNumber,
    } = body;

    // Validate required fields
    if (!checkinDate || !checkoutDate || !numberOfDays || !hotelRoomSlug || !paymentMethod) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate payment method
    if (!validatePaymentMethod(paymentMethod)) {
      return NextResponse.json(
        { error: 'Invalid payment method' },
        { status: 400 }
      );
    }

    // Get payment method configuration
    const methodConfig = PAYMENT_METHODS[paymentMethod as keyof typeof PAYMENT_METHODS];
    if (!methodConfig) {
      return NextResponse.json(
        { error: 'Payment method not supported' },
        { status: 400 }
      );
    }

    // Validate phone number for mobile money methods
    const mobileMoneyMethods = ['evc', 'zaad', 'sahal', 'edahab'];
    if (mobileMoneyMethods.includes(paymentMethod) && !phoneNumber?.trim()) {
      return NextResponse.json(
        { error: 'Phone number is required for mobile money payments' },
        { status: 400 }
      );
    }

    // Validate account number for bank transfers
    if (paymentMethod === 'premier_bank' && !accountNumber?.trim()) {
      return NextResponse.json(
        { error: 'Account number is required for bank transfers' },
        { status: 400 }
      );
    }

    // Calculate payment amounts
    const baseAmount = 99.99; // Mock room price - in real app, fetch from database
    const feeAmount = baseAmount * (methodConfig.fee / 100);
    const totalAmount = baseAmount + feeAmount;

    // Validate amount limits
    if (totalAmount < methodConfig.minAmount || totalAmount > methodConfig.maxAmount) {
      return NextResponse.json(
        { 
          error: `Payment amount must be between $${methodConfig.minAmount} and $${methodConfig.maxAmount}` 
        },
        { status: 400 }
      );
    }

    // Process payment based on mode (demo or production)
    let paymentResult;
    if (isDemoMode()) {
      console.log('🎯 Processing demo payment for:', paymentMethod);
      paymentResult = await processDemoPayment(
        paymentMethod, 
        totalAmount, 
        phoneNumber, 
        accountNumber
      );
    } else {
      console.log('🏦 Processing production payment for:', paymentMethod);
      paymentResult = await processProductionPayment(
        paymentMethod, 
        totalAmount, 
        phoneNumber, 
        accountNumber
      );
    }

    if (!paymentResult.success) {
      return NextResponse.json(
        { error: paymentResult.message },
        { status: 400 }
      );
    }

    // Create payment record in database
    try {
      const { paymentId } = generatePaymentReference();
      
      await createPayment({
        payment_id: paymentId,
        reference_number: paymentResult.reference,
        user_id: session.user.id,
        room_id: hotelRoomSlug, // In real app, convert slug to room ID
        amount: totalAmount,
        base_amount: baseAmount,
        fee_amount: feeAmount,
        currency: 'USD',
        payment_method: paymentMethod as any,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        adults,
        children,
        number_of_days: numberOfDays,
        phone_number: phoneNumber,
        account_number: accountNumber,
        expires_at: paymentResult.expiresAt,
      });
    } catch (dbError) {
      console.error('Database error (continuing with payment):', dbError);
      // Continue even if database fails, as payment was successful
    }

    // Return payment instructions
    return NextResponse.json({
      success: true,
      reference: paymentResult.reference,
      transactionId: paymentResult.transactionId,
      expiresAt: paymentResult.expiresAt,
      message: paymentResult.message,
      paymentMethod: methodConfig.name,
      provider: methodConfig.provider,
      amount: totalAmount,
      baseAmount: baseAmount,
      feeAmount: feeAmount,
      isDemoMode: isDemoMode(),
      instructions: {
        en: methodConfig.instructionsEn.replace('{reference}', paymentResult.reference),
        ar: methodConfig.instructions.replace('{reference}', paymentResult.reference),
      }
    });

  } catch (error) {
    console.error('Somali payment API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET endpoint for payment status checking
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptionsSupabase);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference');

    if (!reference) {
      return NextResponse.json(
        { error: 'Reference number is required' },
        { status: 400 }
      );
    }

    // In demo mode, return mock status
    if (isDemoMode()) {
      const mockStatuses = ['pending', 'confirmed', 'failed'];
      const randomStatus = mockStatuses[Math.floor(Math.random() * mockStatuses.length)];
      
      return NextResponse.json({
        reference,
        status: randomStatus,
        isDemoMode: true,
        message: `Demo payment status: ${randomStatus}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Production status checking would integrate with real payment gateways
    return NextResponse.json({
      reference,
      status: 'pending',
      isDemoMode: false,
      message: 'Payment status checking not implemented in production mode',
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Payment status check error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
