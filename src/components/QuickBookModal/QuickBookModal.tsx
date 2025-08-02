'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DatePicker from 'react-datepicker';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FaTimes } from 'react-icons/fa';
import 'react-datepicker/dist/react-datepicker.css';

import { Room } from '@/models/supabaseTypes';
import PaymentModal from '@/components/PaymentModal/PaymentModal';
import PaymentInstructions from '@/components/PaymentInstructions/PaymentInstructions';

interface QuickBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

const QuickBookModal = ({ isOpen, onClose, room }: QuickBookModalProps) => {
  const { data: session } = useSession();
  const router = useRouter();

  const [checkinDate, setCheckinDate] = useState<Date | null>(null);
  const [checkoutDate, setCheckoutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentData, setPaymentData] = useState<{
    method: string;
    reference: string;
    amount: number;
    expiresAt: string;
  } | null>(null);

  if (!isOpen) return null;

  const calcMinCheckoutDate = () => {
    if (checkinDate) {
      const nextDay = new Date(checkinDate);
      nextDay.setDate(nextDay.getDate() + 1);
      return nextDay;
    }
    return null;
  };

  const calcNumDays = () => {
    if (!checkinDate || !checkoutDate) return 0;
    const timeDiff = checkoutDate.getTime() - checkinDate.getTime();
    const noOfDays = Math.ceil(timeDiff / (24 * 60 * 60 * 1000));
    return noOfDays;
  };

  const discountPrice = room.price - (room.price / 100) * room.discount;
  const totalAmount = calcNumDays() > 0 ? calcNumDays() * discountPrice : 0;

  const handleBookNowClick = () => {
    console.log('Book now clicked in QuickBookModal');

    // Check if user is authenticated
    if (!session) {
      toast.error('Please sign in to book a room');
      onClose();
      router.push('/auth');
      return;
    }

    if (!checkinDate || !checkoutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (checkinDate > checkoutDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    const days = calcNumDays();
    if (days <= 0) {
      toast.error('Please select valid dates');
      return;
    }

    console.log('Opening payment modal...');
    setIsPaymentModalOpen(true);
  };

  const handlePaymentMethodSelect = async (method: string, phoneNumber?: string, accountNumber?: string) => {
    setIsProcessingPayment(true);
    
    try {
      const numberOfDays = calcNumDays();

      const { data } = await axios.post('/api/somali-payment', {
        checkinDate,
        checkoutDate,
        adults,
        children,
        numberOfDays,
        hotelRoomSlug: room.slug,
        paymentMethod: method,
        phoneNumber: ['evc', 'zaad', 'sahal', 'edahab'].includes(method) ? phoneNumber : undefined,
        accountNumber: method === 'premier_bank' ? accountNumber : undefined,
      });
      
      if (data && data.reference) {
        setPaymentData({
          method,
          reference: data.reference,
          amount: totalAmount,
          expiresAt: data.expiresAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        });
        
        setIsPaymentModalOpen(false);
        setIsInstructionsOpen(true);
        toast.success('Payment instructions generated!');
      } else {
        toast.error('Failed to generate payment instructions');
      }
    } catch (error: any) {
      console.log('Error: ', error);

      if (error.response?.status === 401) {
        toast.error('Please sign in to complete booking');
        onClose();
        router.push('/auth');
      } else if (error.response?.data) {
        toast.error(error.response.data);
      } else {
        toast.error('An error occurred while processing your booking');
      }
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleClose = () => {
    if (!isProcessingPayment) {
      setCheckinDate(null);
      setCheckoutDate(null);
      setAdults(1);
      setChildren(0);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Quick Book</h2>
              <p className="text-gray-600 dark:text-gray-300">{room.name}</p>
            </div>
            <button
              onClick={handleClose}
              disabled={isProcessingPayment}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
            >
              <FaTimes className="text-xl text-gray-500" />
            </button>
          </div>

          <div className="p-6">
            {/* Room Info */}
            <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">${room.price}</span>
                {room.discount > 0 && (
                  <span className="text-green-600 text-sm">-{room.discount}% off</span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">{room.type} Room</p>
            </div>

            {/* Date Selection */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Check In</label>
                <DatePicker
                  selected={checkinDate}
                  onChange={date => setCheckinDate(date)}
                  dateFormat="dd/MM/yyyy"
                  minDate={new Date()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholderText="Select date"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check Out</label>
                <DatePicker
                  selected={checkoutDate}
                  onChange={date => setCheckoutDate(date)}
                  dateFormat="dd/MM/yyyy"
                  disabled={!checkinDate}
                  minDate={calcMinCheckoutDate()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholderText="Select date"
                />
              </div>
            </div>

            {/* Guests Selection */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Adults</label>
                <input
                  type="number"
                  value={adults}
                  onChange={e => setAdults(+e.target.value)}
                  min={1}
                  max={5}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Children</label>
                <input
                  type="number"
                  value={children}
                  onChange={e => setChildren(+e.target.value)}
                  min={0}
                  max={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </div>

            {/* Total Price */}
            {totalAmount > 0 && (
              <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total ({calcNumDays()} nights):</span>
                  <span className="text-xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBookNowClick}
              disabled={room.is_booked || isProcessingPayment}
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 ${
                room.is_booked 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg'
              }`}
            >
              {room.is_booked ? '🔒 Room Booked' : '💳 Continue to Payment'}
            </button>

            {!session && (
              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-3">
                Please <button onClick={() => router.push('/auth')} className="text-primary underline">sign in</button> to book
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        totalAmount={totalAmount}
        onPaymentMethodSelect={handlePaymentMethodSelect}
        isProcessing={isProcessingPayment}
      />

      {/* Payment Instructions Modal */}
      {paymentData && (
        <PaymentInstructions
          isOpen={isInstructionsOpen}
          onClose={() => {
            setIsInstructionsOpen(false);
            handleClose(); // Close the quick book modal too
          }}
          paymentMethod={paymentData.method}
          referenceNumber={paymentData.reference}
          amount={paymentData.amount}
          expiresAt={paymentData.expiresAt}
        />
      )}
    </>
  );
};

export default QuickBookModal;
