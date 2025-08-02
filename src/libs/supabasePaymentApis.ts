import { supabase, createServerSupabaseClient } from './supabase'

export type SomaliPaymentMethod = 
  | 'evc' 
  | 'zaad' 
  | 'sahal' 
  | 'premier_bank' 
  | 'amtel' 
  | 'dahabshiil' 
  | 'world_remit' 
  | 'taaj'
  | 'edahab'
  | 'hormud'
  | 'somtel';

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
}

export interface PaymentRecord {
  id: string;
  payment_id: string;
  reference_number: string;
  user_id: string;
  room_id: string;
  amount: number;
  base_amount: number;
  fee_amount: number;
  currency: string;
  payment_method: SomaliPaymentMethod;
  status: 'pending' | 'confirmed' | 'failed' | 'expired' | 'cancelled';
  checkin_date: string;
  checkout_date: string;
  adults: number;
  children: number;
  number_of_days: number;
  phone_number?: string;
  account_number?: string;
  transaction_id?: string;
  provider_response?: any;
  notes?: string;
  expires_at: string;
  confirmed_at?: string;
  created_at: string;
  updated_at: string;
}

// Enhanced payment method configurations
export const PAYMENT_METHODS = {
  evc: {
    name: 'EVC Plus',
    provider: 'Hormuud',
    instructions: 'وجه الدفع إلى: *712*{reference}#\nأو إرسال إلى: 252-61-XXXXXXX',
    instructionsEn: 'Dial: *712*{reference}# or Send to: 252-61-XXXXXXX',
    minAmount: 1,
    maxAmount: 10000,
    fee: 0.5,
    currency: 'USD',
    type: 'mobile_money',
    isActive: true,
  },
  zaad: {
    name: 'Zaad Service',
    provider: 'Telesom',
    instructions: 'وجه الدفع إلى: *770*{reference}#\nأو إرسال إلى: 252-63-XXXXXXX',
    instructionsEn: 'Dial: *770*{reference}# or Send to: 252-63-XXXXXXX',
    minAmount: 1,
    maxAmount: 5000,
    fee: 0.3,
    currency: 'USD',
    type: 'mobile_money',
    isActive: true,
  },
  sahal: {
    name: 'Sahal',
    provider: 'Golis',
    instructions: 'وجه الدفع إلى: *747*{reference}#\nأو إرسال إلى: 252-90-XXXXXXX',
    instructionsEn: 'Dial: *747*{reference}# or Send to: 252-90-XXXXXXX',
    minAmount: 1,
    maxAmount: 3000,
    fee: 0.4,
    currency: 'USD',
    type: 'mobile_money',
    isActive: true,
  },
  edahab: {
    name: 'eDahab',
    provider: 'Hormuud',
    instructions: 'افتح تطبيق eDahab واذهب للدفع\nالرقم المرجعي: {reference}',
    instructionsEn: 'Open eDahab app, go to Pay\nReference: {reference}',
    minAmount: 1,
    maxAmount: 15000,
    fee: 0.25,
    currency: 'USD',
    type: 'mobile_app',
    isActive: true,
  },
  premier_bank: {
    name: 'Premier Bank',
    provider: 'Premier Bank',
    instructions: 'تحويل بنكي إلى:\nرقم الحساب: 1234567890\nالرقم المرجعي: {reference}',
    instructionsEn: 'Bank Transfer to:\nAccount: 1234567890\nReference: {reference}',
    minAmount: 10,
    maxAmount: 50000,
    fee: 0,
    currency: 'USD',
    type: 'bank_transfer',
    isActive: true,
  },
  dahabshiil: {
    name: 'Dahabshiil',
    provider: 'Dahabshiil',
    instructions: 'زيارة أقرب فرع داهب شيل\nالرقم المرجعي: {reference}',
    instructionsEn: 'Visit nearest Dahabshiil branch\nReference: {reference}',
    minAmount: 5,
    maxAmount: 25000,
    fee: 0.2,
    currency: 'USD',
    type: 'remittance',
    isActive: true,
  },
  world_remit: {
    name: 'WorldRemit',
    provider: 'WorldRemit',
    instructions: 'إرسال عبر تطبيق WorldRemit\nالرقم المرجعي: {reference}',
    instructionsEn: 'Send via WorldRemit app\nReference: {reference}',
    minAmount: 10,
    maxAmount: 20000,
    fee: 1.0,
    currency: 'USD',
    type: 'remittance',
    isActive: true,
  },
};

// Create payment record
export async function createPayment(paymentData: {
  payment_id: string;
  reference_number: string;
  user_id: string;
  room_id: string;
  amount: number;
  base_amount: number;
  fee_amount: number;
  currency: string;
  payment_method: SomaliPaymentMethod;
  checkin_date: string;
  checkout_date: string;
  adults: number;
  children: number;
  number_of_days: number;
  phone_number?: string;
  account_number?: string;
  expires_at: string;
}) {
  try {
    const supabaseServer = createServerSupabaseClient();
    const { data, error } = await supabaseServer
      .from('payments')
      .insert(paymentData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating payment (using fallback):', error);
    // Return mock data for development
    return { id: paymentData.payment_id, ...paymentData };
  }
}

// Get payment by ID
export async function getPayment(paymentId: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        rooms:room_id (
          id,
          name,
          slug,
          price
        ),
        users:user_id (
          id,
          name,
          email
        )
      `)
      .eq('payment_id', paymentId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching payment:', error);
    return null;
  }
}

// Get user payments
export async function getUserPayments(userId: string) {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        *,
        rooms:room_id (
          id,
          name,
          slug,
          price,
          cover_image
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching user payments:', error);
    return [];
  }
}

// Update payment status
export async function updatePaymentStatus(
  paymentId: string,
  status: PaymentRecord['status'],
  transactionId?: string,
  providerResponse?: any,
  notes?: string
) {
  try {
    const supabaseServer = createServerSupabaseClient();
    const updateData: any = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (transactionId) updateData.transaction_id = transactionId;
    if (providerResponse) updateData.provider_response = providerResponse;
    if (notes) updateData.notes = notes;
    if (status === 'confirmed') updateData.confirmed_at = new Date().toISOString();

    const { data, error } = await supabaseServer
      .from('payments')
      .update(updateData)
      .eq('payment_id', paymentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
  }
}

// Expire old payments
export async function expireOldPayments() {
  try {
    const supabaseServer = createServerSupabaseClient();
    const { data, error } = await supabaseServer.rpc('expire_old_payments');
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error expiring old payments:', error);
    throw error;
  }
}

// Get payment summary for user
export async function getPaymentSummary(userId: string) {
  try {
    const { data, error } = await supabase.rpc('get_payment_summary', { 
      user_uuid: userId 
    });
    
    if (error) throw error;
    return data?.[0] || {
      total_payments: 0,
      pending_payments: 0,
      confirmed_payments: 0,
      total_amount: 0,
    };
  } catch (error) {
    console.error('Error fetching payment summary:', error);
    return {
      total_payments: 0,
      pending_payments: 0,
      confirmed_payments: 0,
      total_amount: 0,
    };
  }
}

// Validate payment method
export function validatePaymentMethod(method: string): method is SomaliPaymentMethod {
  return Object.keys(PAYMENT_METHODS).includes(method);
}

// Get available payment methods
export function getAvailablePaymentMethods() {
  return Object.entries(PAYMENT_METHODS)
    .filter(([_, config]) => config.isActive)
    .map(([key, config]) => ({
      id: key,
      name: config.name,
      provider: config.provider,
      minAmount: config.minAmount,
      maxAmount: config.maxAmount,
      fee: config.fee,
      currency: config.currency,
      type: config.type,
    }));
}

// Generate payment reference
export function generatePaymentReference(): { paymentId: string; referenceNumber: string } {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substr(2, 9);
  const refStr = Math.random().toString(36).substr(2, 6).toUpperCase();
  
  return {
    paymentId: `SOM-${timestamp}-${randomStr}`,
    referenceNumber: `REF-${timestamp}-${refStr}`,
  };
}

// Format payment instructions
export function formatPaymentInstructions(
  method: SomaliPaymentMethod,
  reference: string,
  language: 'en' | 'ar' = 'en'
): string {
  const config = PAYMENT_METHODS[method];
  if (!config) return '';

  const instructions = language === 'ar' ? config.instructions : config.instructionsEn;
  return instructions.replace('{reference}', reference);
}
