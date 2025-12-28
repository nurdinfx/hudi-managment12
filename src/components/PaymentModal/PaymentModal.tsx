'use client';

import { useState } from 'react';
import { FaTimes, FaMobileAlt, FaUniversity, FaGlobe, FaCreditCard, FaCheck, FaArrowLeft } from 'react-icons/fa';
import { BsShieldCheck, BsClock } from 'react-icons/bs';
import { MdSecurity } from 'react-icons/md';
import { getAvailablePaymentMethods, PAYMENT_METHODS } from '@/libs/supabasePaymentApis';
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
        return <FaMobileAlt className="text-2xl text-blue-600" />;
      case 'mobile_app':
        return <FaCreditCard className="text-2xl text-green-600" />;
      case 'bank_transfer':
        return <FaUniversity className="text-2xl text-green-600" />;
      case 'remittance':
        return <FaGlobe className="text-2xl text-purple-600" />;
      default:
        return <FaMobileAlt className="text-2xl text-gray-600" />;
    }
  };

  const getPaymentMethodBrand = (methodId: string) => {
    const brandColors = {
      evc: 'bg-gradient-to-r from-red-500 to-red-600',
      zaad: 'bg-gradient-to-r from-blue-500 to-blue-600',
      sahal: 'bg-gradient-to-r from-green-500 to-green-600',
      edahab: 'bg-gradient-to-r from-orange-500 to-orange-600',
      premier_bank: 'bg-gradient-to-r from-gray-700 to-gray-800',
      dahabshiil: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
      world_remit: 'bg-gradient-to-r from-purple-500 to-purple-600',
    };
    return brandColors[methodId as keyof typeof brandColors] || 'bg-gradient-to-r from-gray-500 to-gray-600';
  };

  const getPaymentMethodLogo = (methodId: string) => {
    // In a real app, these would be actual logos
    const logos = {
      evc: '🔥',
      zaad: '📱',
      sahal: '🌟',
      edahab: '💳',
      premier_bank: '🏦',
      dahabshiil: '💰',
      world_remit: '🌍',
    };
    return logos[methodId as keyof typeof logos] || '💳';
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

  const handleBack = () => {
    if (step === 'details') {
      setStep('select');
      setSelectedMethod('');
    } else if (step === 'confirm') {
      if (needsPhoneNumber(selectedMethod) || needsAccountNumber(selectedMethod)) {
        setStep('details');
      } else {
        setStep('select');
        setSelectedMethod('');
      }
    }
  };

  const selectedMethodData = paymentMethods.find(m => m.id === selectedMethod);
  const selectedMethodConfig = selectedMethod ? PAYMENT_METHODS[selectedMethod as keyof typeof PAYMENT_METHODS] : null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-tertiary-dark text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {step !== 'select' && (
              <button
                onClick={handleBack}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
              >
                <FaArrowLeft className="text-lg" />
              </button>
            )}
            <div>
              <h3 className="text-lg font-bold">
                {step === 'select' && 'Choose Payment Method'}
                {step === 'details' && 'Payment Details'}
                {step === 'confirm' && 'Confirm Payment'}
              </h3>
              <p className="text-white/80 text-sm">
                Secure • Fast • Reliable
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isProcessing}
            className="p-2 hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Step 1: Payment Method Selection */}
          {step === 'select' && (
            <div className="space-y-6">
              {/* Security Banner */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <BsShieldCheck className="text-green-600 text-xl" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-300">256-bit SSL Encryption</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">Your payment information is secure and protected</p>
                  </div>
                </div>
              </div>

              {/* Amount Summary */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Methods Grid */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Select your preferred payment method:</h4>
                
                {/* Mobile Money Methods */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Mobile Money</p>
                  {paymentMethods.filter(method => method.type === 'mobile_money' || method.type === 'mobile_app').map((method) => (
                    <button
                      key={method.id}
                      onClick={() => handleMethodSelect(method.id)}
                      className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300 group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`${getPaymentMethodBrand(method.id)} p-3 rounded-xl text-white text-xl shadow-lg`}>
                            {getPaymentMethodLogo(method.id)}
                          </div>
                          <div className="text-left">
                            <h5 className="font-semibold text-gray-900 dark:text-white">{method.name}</h5>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{method.provider}</p>
                            <p className="text-xs text-green-600 dark:text-green-400">Fee: {method.fee}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                            <FaArrowLeft className="rotate-180" />
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            ${(totalAmount * (1 + method.fee / 100)).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Bank Transfer */}
                {paymentMethods.filter(method => method.type === 'bank_transfer').length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Bank Transfer</p>
                    {paymentMethods.filter(method => method.type === 'bank_transfer').map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handleMethodSelect(method.id)}
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`${getPaymentMethodBrand(method.id)} p-3 rounded-xl text-white text-xl shadow-lg`}>
                              {getPaymentMethodLogo(method.id)}
                            </div>
                            <div className="text-left">
                              <h5 className="font-semibold text-gray-900 dark:text-white">{method.name}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{method.provider}</p>
                              <p className="text-xs text-green-600 dark:text-green-400">No fees</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <FaArrowLeft className="rotate-180" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              ${totalAmount.toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Remittance Services */}
                {paymentMethods.filter(method => method.type === 'remittance').length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">Money Transfer</p>
                    {paymentMethods.filter(method => method.type === 'remittance').map((method) => (
                      <button
                        key={method.id}
                        onClick={() => handleMethodSelect(method.id)}
                        className="w-full p-4 border-2 border-gray-200 dark:border-gray-600 rounded-xl hover:border-primary hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className={`${getPaymentMethodBrand(method.id)} p-3 rounded-xl text-white text-xl shadow-lg`}>
                              {getPaymentMethodLogo(method.id)}
                            </div>
                            <div className="text-left">
                              <h5 className="font-semibold text-gray-900 dark:text-white">{method.name}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{method.provider}</p>
                              <p className="text-xs text-green-600 dark:text-green-400">Fee: {method.fee}%</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                              <FaArrowLeft className="rotate-180" />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              ${(totalAmount * (1 + method.fee / 100)).toFixed(2)}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Security Footer */}
              <div className="flex items-center justify-center space-x-6 pt-4 border-t border-gray-200 dark:border-gray-600">
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <MdSecurity className="text-lg" />
                  <span className="text-sm">Secure</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <BsClock className="text-lg" />
                  <span className="text-sm">Instant</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                  <BsShieldCheck className="text-lg" />
                  <span className="text-sm">Protected</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment Details */}
          {step === 'details' && selectedMethodData && (
            <div className="space-y-6">
              {/* Selected Method Display */}
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4">
                <div className="flex items-center space-x-4">
                  <div className={`${getPaymentMethodBrand(selectedMethod)} p-3 rounded-xl text-white text-xl shadow-lg`}>
                    {getPaymentMethodLogo(selectedMethod)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{selectedMethodData.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{selectedMethodData.provider}</p>
                  </div>
                </div>
              </div>

              {needsPhoneNumber(selectedMethod) && (
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaMobileAlt className="inline mr-2" />
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+252 61 123 4567"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Enter your {selectedMethodData.name} mobile number for payment confirmation
                  </p>
                </div>
              )}

              {needsAccountNumber(selectedMethod) && (
                <div>
                  <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <FaUniversity className="inline mr-2" />
                    Account Number
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="Enter your account number"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white text-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 Enter your {selectedMethodData.name} account number
                  </p>
                </div>
              )}

              <button
                onClick={handleDetailsSubmit}
                className="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 3: Payment Confirmation */}
          {step === 'confirm' && selectedMethodData && selectedMethodConfig && (
            <div className="space-y-6">
              {/* Payment Summary */}
              <div className="bg-gradient-to-r from-primary/10 to-tertiary-dark/10 border border-primary/20 rounded-xl p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className={`${getPaymentMethodBrand(selectedMethod)} p-3 rounded-xl text-white text-xl shadow-lg`}>
                    {getPaymentMethodLogo(selectedMethod)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{selectedMethodData.name}</h4>
                    <p className="text-gray-600 dark:text-gray-400">{selectedMethodData.provider}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-300">Room Amount:</span>
                    <span className="font-medium">${totalAmount.toFixed(2)}</span>
                  </div>
                  
                  {selectedMethodData.fee > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Processing Fee ({selectedMethodData.fee}%):</span>
                      <span className="font-medium">${(totalAmount * selectedMethodData.fee / 100).toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total Amount:</span>
                      <span className="text-primary">${(totalAmount * (1 + selectedMethodData.fee / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {phoneNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Phone Number:</span>
                      <span className="font-medium">{phoneNumber}</span>
                    </div>
                  )}
                  
                  {accountNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-300">Account Number:</span>
                      <span className="font-medium">{accountNumber}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Instructions Preview */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-xl p-4">
                <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                  <BsClock className="mr-2" />
                  What happens next?
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  You&apos;ll receive detailed payment instructions and a reference number. Complete the payment using your {selectedMethodData.name} account within 24 hours.
                </p>
              </div>

              {/* Security Guarantee */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <FaCheck className="text-green-600 text-lg" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-300">100% Secure Transaction</h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Your booking is protected with bank-level security
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleConfirmPayment}
                disabled={isProcessing}
                className="w-full bg-primary text-white py-4 px-6 rounded-xl font-semibold hover:bg-primary/90 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 disabled:bg-primary/80 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center space-x-2 group"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className='w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3'></div>
                    <span>Processing...</span>
                    <div className="flex ml-2">
                      <span className="animate-soft-bounce">.</span>
                      <span className="animate-soft-bounce" style={{animationDelay: '0.2s'}}>.</span>
                      <span className="animate-soft-bounce" style={{animationDelay: '0.4s'}}>.</span>
                    </div>
                  </div>
                ) : (
                  <span className="group-hover:scale-105 transition-transform duration-300">
                    🔒 Confirm & Get Payment Instructions
                  </span>
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
