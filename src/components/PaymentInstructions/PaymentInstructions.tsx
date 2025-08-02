'use client';

import { useState } from 'react';
import { FaCopy, FaCheck, FaTimes } from 'react-icons/fa';
import { formatPaymentInstructions, PAYMENT_METHODS } from '@/libs/supabasePaymentApis';
import toast from 'react-hot-toast';

interface PaymentInstructionsProps {
  isOpen: boolean;
  onClose: () => void;
  paymentMethod: string;
  referenceNumber: string;
  amount: number;
  expiresAt: string;
}

const PaymentInstructions = ({ 
  isOpen, 
  onClose, 
  paymentMethod, 
  referenceNumber, 
  amount, 
  expiresAt 
}: PaymentInstructionsProps) => {
  const [language, setLanguage] = useState<'en' | 'ar'>('en');
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const methodConfig = PAYMENT_METHODS[paymentMethod as keyof typeof PAYMENT_METHODS];
  
  if (!isOpen || !methodConfig) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const formatExpiryTime = (expiryDate: string) => {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diff <= 0) return 'Expired';
    return `${hours}h ${minutes}m remaining`;
  };

  const instructions = formatPaymentInstructions(paymentMethod as any, referenceNumber, language);
  const totalWithFee = amount + (amount * methodConfig.fee / 100);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <FaCheck className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-800 dark:text-green-300">Payment Instructions</h2>
              <p className="text-sm text-green-600 dark:text-green-400">Complete your payment within 24 hours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <FaTimes className="text-xl text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Language Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === 'en' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  language === 'ar' 
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300'
                }`}
              >
                العربية
              </button>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Payment Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
                <span className="font-medium">{methodConfig.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                <span>${amount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-300">Processing Fee:</span>
                <span>${(amount * methodConfig.fee / 100).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-300 dark:border-gray-600 pt-2 mt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total to Pay:</span>
                  <span className="text-primary">${totalWithFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Number */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
            <label className="block text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
              Reference Number
            </label>
            <div className="flex items-center space-x-2">
              <code className="flex-1 bg-white dark:bg-gray-700 border border-blue-300 dark:border-blue-600 rounded px-3 py-2 font-mono text-lg">
                {referenceNumber}
              </code>
              <button
                onClick={() => copyToClipboard(referenceNumber, 'reference')}
                className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {copiedField === 'reference' ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
          </div>

          {/* Payment Instructions */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-3">
              {language === 'en' ? 'Payment Instructions' : 'تعليمات الدفع'}
            </h4>
            <div className={`whitespace-pre-line text-sm text-yellow-800 dark:text-yellow-200 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
              {instructions}
            </div>
          </div>

          {/* Expiry Timer */}
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-red-900 dark:text-red-300 font-medium">
                {language === 'en' ? 'Payment Expires In:' : 'ينتهي الدفع خلال:'}
              </span>
              <span className="text-red-600 dark:text-red-400 font-bold">
                {formatExpiryTime(expiresAt)}
              </span>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            <p>• {language === 'en' ? 'Keep this reference number for your records' : 'احتفظ بهذا الرقم المرجعي لسجلاتك'}</p>
            <p>• {language === 'en' ? 'Payment confirmation may take up to 30 minutes' : 'قد يستغرق تأكيد الدفع حتى 30 دقيقة'}</p>
            <p>• {language === 'en' ? 'Contact support if you encounter any issues' : 'اتصل بالدعم إذا واجهت أي مشاكل'}</p>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-6 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            {language === 'en' ? 'I Understand' : 'فهمت'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;
