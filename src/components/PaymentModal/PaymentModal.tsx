'use client';

import { useState } from 'react';
import { FaTimes, FaMobileAlt, FaUniversity, FaGlobe } from 'react-icons/fa';
import { getAvailablePaymentMethods } from '@/libs/supabasePaymentApis';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  onPaymentMethodSelect: (method: string, phoneNumber?: string, accountNumber?: string) => void;
  isProcessing?: boolean;
}

const PaymentModal = ({ isOpen, onClose, totalAmount, onPaymentMethodSelect, isProcessing = false }: PaymentModalProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [step, setStep] = useState<'select' | 'details' | 'confirm'>('select');

  const paymentMethods = getAvailablePaymentMethods();

  const getPaymentIcon = (type: string) => {
    switch (type) {
      case 'mobile_money':
      case 'mobile_app':
        return <FaMobileAlt className="text-2xl text-blue-600" />;
      case 'bank_transfer':
        return <FaUniversity className="text-2xl text-green-600" />;
      case 'remittance':
        return <FaGlobe className="text-2xl text-purple-600" />;
      default:
        return <FaMobileAlt className="text-2xl text-gray-600" />;
    }
  };

  const getPaymentMethodColor = (type: string) => {
    switch (type) {
      case 'mobile_money':
      case 'mobile_app':
        return 'border-blue-500 hover:bg-blue-50';
      case 'bank_transfer':
        return 'border-green-500 hover:bg-green-50';
      case 'remittance':
        return 'border-purple-500 hover:bg-purple-50';
      default:
        return 'border-gray-500 hover:bg-gray-50';
    }
  };

  const needsPhoneNumber = (methodId: string) => {
    return ['evc', 'zaad', 'sahal', 'edahab'].includes(methodId);
  };

  const needsAccountNumber = (methodId: string) => {
    return methodId === 'premier_bank';
  };

  const handleMethodSelect = (methodId: string) => {
    setSelectedMethod(methodId);
    if (needsPhoneNumber(methodId) || needsAccountNumber(methodId)) {
      setStep('details');
    } else {
      setStep('confirm');
    }
  };

  const handleDetailsSubmit = () => {
    if (needsPhoneNumber(selectedMethod) && !phoneNumber.trim()) {
      toast.error('Please enter your phone number');
      return;
    }
    if (needsAccountNumber(selectedMethod) && !accountNumber.trim()) {
      toast.error('Please enter your account number');
      return;
    }
    setStep('confirm');
  };

  const handleConfirmPayment = () => {
    onPaymentMethodSelect(selectedMethod, phoneNumber, accountNumber);
  };

  const handleClose = () => {
    if (!isProcessing) {
      setStep('select');
      setSelectedMethod('');
      setPhoneNumber('');
      setAccountNumber('');
      onClose();
    }
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Choose Payment Method</h2>
            <p className="text-gray-600 dark:text-gray-300">Total Amount: <span className="font-semibold text-primary">${totalAmount}</span></p>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors disabled:opacity-50"
          >
            <FaTimes className="text-xl text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {step === 'select' && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold mb-4">Select your preferred payment method:</h3>
              <div className="grid gap-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method.id)}
                    className={`p-4 border-2 rounded-xl text-left transition-all hover:shadow-md ${getPaymentMethodColor(method.type)} ${
                      selectedMethod === method.id ? 'border-primary bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        {getPaymentIcon(method.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">{method.name}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{method.provider}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              Fee: {method.fee}% 
                            </p>
                            <p className="text-xs text-gray-500">
                              Max: ${method.maxAmount}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 'details' && selectedMethodData && (
            <div className="space-y-6">
              <button 
                onClick={() => setStep('select')}
                className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
              >
                <span>←</span>
                <span>Back to payment methods</span>
              </button>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex items-center space-x-3 mb-3">
                  {getPaymentIcon(selectedMethodData.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{selectedMethodData.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{selectedMethodData.provider}</p>
                  </div>
                </div>
              </div>

              {needsPhoneNumber(selectedMethod) && (
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+252611234567"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your {selectedMethodData.name} mobile number</p>
                </div>
              )}

              {needsAccountNumber(selectedMethod) && (
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter your account number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                  <p className="text-xs text-gray-500 mt-1">Enter your {selectedMethodData.name} account number</p>
                </div>
              )}

              <button
                onClick={handleDetailsSubmit}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
          )}

          {step === 'confirm' && selectedMethodData && (
            <div className="space-y-6">
              <button 
                onClick={() => needsPhoneNumber(selectedMethod) || needsAccountNumber(selectedMethod) ? setStep('details') : setStep('select')}
                className="text-primary hover:text-primary/80 text-sm flex items-center space-x-1"
              >
                <span>←</span>
                <span>Back</span>
              </button>
              
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Confirm Payment Details</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Payment Method:</span>
                    <span className="font-semibold">{selectedMethodData.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Provider:</span>
                    <span>{selectedMethodData.provider}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Amount:</span>
                    <span className="font-semibold">${totalAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Processing Fee:</span>
                    <span>${(totalAmount * selectedMethodData.fee / 100).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total:</span>
                      <span className="text-primary">${(totalAmount + (totalAmount * selectedMethodData.fee / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Phone Number:</span>
                      <span>{phoneNumber}</span>
                    </div>
                  )}
                  
                  {accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Account Number:</span>
                      <span>{accountNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">What happens next?</h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You'll receive payment instructions and a reference number. Complete the payment using your {selectedMethodData.name} account within 24 hours.
                </p>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full bg-primary text-white py-4 px-6 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <span>Confirm & Get Payment Instructions</span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
