'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaCopy, FaCheck, FaExclamationTriangle, FaShieldAlt, FaArrowRight, FaPhone, FaMobileAlt } from 'react-icons/fa';
import { BsClock, BsCheckCircle, BsXCircle } from 'react-icons/bs';
import { MdSms, MdQrCode } from 'react-icons/md';
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
  const [timeLeft, setTimeLeft] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [step, setStep] = useState<'instructions' | 'demo_simulation' | 'success'>('instructions');
  const [demoProgress, setDemoProgress] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const methodConfig = PAYMENT_METHODS[paymentMethod as keyof typeof PAYMENT_METHODS];

  useEffect(() => {
    if (!isOpen) return;

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const expiry = new Date(expiresAt).getTime();
      const distance = expiry - now;

      if (distance > 0) {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Expired');
      }
    };

    updateTimeLeft();
    const timer = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [isOpen, expiresAt]);

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      toast.success(`${type} copied to clipboard!`);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard');
    }
  };

  const getPaymentMethodLogo = (methodId: string) => {
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

  const simulateDemoPayment = async () => {
    setIsSimulating(true);
    setStep('demo_simulation');
    
    const steps = [
      { progress: 20, message: 'Connecting to payment gateway...' },
      { progress: 40, message: 'Validating payment details...' },
      { progress: 60, message: 'Processing payment request...' },
      { progress: 80, message: 'Confirming transaction...' },
      { progress: 100, message: 'Payment successful!' },
    ];

    for (const stepData of steps) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDemoProgress(stepData.progress);
      if (stepData.progress === 100) {
        setTimeout(() => {
          setStep('success');
          setIsSimulating(false);
        }, 1000);
      }
    }
  };

  const getInstructionSteps = () => {
    const instructions = formatPaymentInstructions(paymentMethod as any, referenceNumber);
    
    switch (paymentMethod) {
      case 'evc':
      case 'zaad':
      case 'sahal':
        return [
          {
            step: 1,
            title: 'Dial USSD Code',
            description: `Dial *${paymentMethod === 'evc' ? '712' : paymentMethod === 'zaad' ? '770' : '747'}*${referenceNumber}# on your phone`,
            icon: <FaPhone className="text-lg" />,
            code: `*${paymentMethod === 'evc' ? '712' : paymentMethod === 'zaad' ? '770' : '747'}*${referenceNumber}#`
          },
          {
            step: 2,
            title: 'Follow Menu',
            description: 'Follow the on-screen prompts to complete payment',
            icon: <MdSms className="text-lg" />
          },
          {
            step: 3,
            title: 'Confirm Amount',
            description: `Confirm payment of $${amount.toFixed(2)}`,
            icon: <FaCheck className="text-lg" />
          }
        ];
      
      case 'edahab':
        return [
          {
            step: 1,
            title: 'Open eDahab App',
            description: 'Launch the eDahab mobile application',
            icon: <FaMobileAlt className="text-lg" />
          },
          {
            step: 2,
            title: 'Go to Pay',
            description: 'Navigate to the payment section',
            icon: <FaArrowRight className="text-lg" />
          },
          {
            step: 3,
            title: 'Enter Reference',
            description: `Use reference number: ${referenceNumber}`,
            icon: <MdQrCode className="text-lg" />,
            code: referenceNumber
          }
        ];
      
      case 'premier_bank':
        return [
          {
            step: 1,
            title: 'Login to Online Banking',
            description: 'Access your Premier Bank online account',
            icon: <FaShieldAlt className="text-lg" />
          },
          {
            step: 2,
            title: 'Make Transfer',
            description: 'Transfer to account: 1234567890',
            icon: <FaArrowRight className="text-lg" />,
            code: '1234567890'
          },
          {
            step: 3,
            title: 'Add Reference',
            description: `Include reference: ${referenceNumber}`,
            icon: <FaCheck className="text-lg" />,
            code: referenceNumber
          }
        ];
      
      default:
        return [
          {
            step: 1,
            title: 'Visit Service Provider',
            description: `Go to nearest ${methodConfig?.provider} location`,
            icon: <FaArrowRight className="text-lg" />
          },
          {
            step: 2,
            title: 'Provide Reference',
            description: `Give reference number: ${referenceNumber}`,
            icon: <FaCheck className="text-lg" />,
            code: referenceNumber
          }
        ];
    }
  };

  const handleClose = () => {
    setStep('instructions');
    setDemoProgress(0);
    setIsSimulating(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className={`${getPaymentMethodBrand(paymentMethod)} text-white px-6 py-4 flex items-center justify-between`}>
          <div className="flex items-center space-x-3">
            <div className="text-3xl">{getPaymentMethodLogo(paymentMethod)}</div>
            <div>
              <h3 className="text-lg font-bold">
                {step === 'instructions' && 'Payment Instructions'}
                {step === 'demo_simulation' && 'Processing Payment'}
                {step === 'success' && 'Payment Successful'}
              </h3>
              <p className="text-white/80 text-sm">
                {methodConfig?.name} • {methodConfig?.provider}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>

        <div className="p-6 max-h-[calc(90vh-100px)] overflow-y-auto">
          {/* Payment Instructions */}
          {step === 'instructions' && (
            <div className="space-y-6">
              {/* Amount and Reference */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Amount</p>
                    <p className="text-xl font-bold text-primary">${amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Reference</p>
                    <div className="flex items-center space-x-2">
                      <p className="font-mono font-bold">{referenceNumber}</p>
                      <button
                        onClick={() => copyToClipboard(referenceNumber, 'Reference')}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                      >
                        {copied === 'Reference' ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-500" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer */}
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <BsClock className="text-orange-600 text-xl" />
                  <div>
                    <h4 className="font-semibold text-orange-900 dark:text-orange-300">Time Remaining</h4>
                    <p className="text-orange-700 dark:text-orange-400 font-mono text-lg">{timeLeft}</p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Follow these steps:</h4>
                <div className="space-y-4">
                  {getInstructionSteps().map((instruction, index) => (
                    <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {instruction.step}
                      </div>
                      <div className="flex-1">
                        <h5 className="font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                          {instruction.icon}
                          <span>{instruction.title}</span>
                        </h5>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">{instruction.description}</p>
                        {instruction.code && (
                          <div className="mt-2 flex items-center space-x-2">
                            <code className="bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded text-sm font-mono">
                              {instruction.code}
                            </code>
                            <button
                              onClick={() => copyToClipboard(instruction.code!, instruction.title)}
                              className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            >
                              {copied === instruction.title ? <FaCheck className="text-green-600" /> : <FaCopy className="text-gray-500" />}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Demo Payment Button */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-300">Demo Mode</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-400">Simulate payment completion for testing</p>
                  </div>
                  <button
                    onClick={simulateDemoPayment}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    🎯 Simulate Payment
                  </button>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <FaShieldAlt className="text-green-600 text-xl" />
                  <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-300">Secure Payment</h4>
                    <p className="text-sm text-green-700 dark:text-green-400">
                      Your payment is protected with bank-level security. Complete payment within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo Simulation */}
          {step === 'demo_simulation' && (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 mx-auto">
                <div className="relative w-full h-full">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="2"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="2"
                      strokeDasharray={`${demoProgress}, 100`}
                      className="transition-all duration-1000 ease-out"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">{demoProgress}%</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Processing Payment
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Simulating {methodConfig?.name} payment flow...
                </p>
              </div>

              <div className="space-y-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-tertiary-dark transition-all duration-1000 ease-out"
                    style={{ width: `${demoProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {demoProgress < 20 && 'Connecting to payment gateway...'}
                  {demoProgress >= 20 && demoProgress < 40 && 'Validating payment details...'}
                  {demoProgress >= 40 && demoProgress < 60 && 'Processing payment request...'}
                  {demoProgress >= 60 && demoProgress < 80 && 'Confirming transaction...'}
                  {demoProgress >= 80 && 'Payment successful!'}
                </p>
              </div>
            </div>
          )}

          {/* Success */}
          {step === 'success' && (
            <div className="space-y-6 text-center">
              <div className="w-24 h-24 mx-auto bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <BsCheckCircle className="text-4xl text-green-600" />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Payment Successful!
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Your booking has been confirmed and you will receive a confirmation email shortly.
                </p>
                
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                  <h4 className="font-semibold text-green-900 dark:text-green-300 mb-2">Transaction Details</h4>
                  <div className="text-sm space-y-1">
                    <p><span className="text-gray-600 dark:text-gray-400">Reference:</span> <span className="font-mono">{referenceNumber}</span></p>
                    <p><span className="text-gray-600 dark:text-gray-400">Amount:</span> ${amount.toFixed(2)}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">Method:</span> {methodConfig?.name}</p>
                    <p><span className="text-gray-600 dark:text-gray-400">Status:</span> <span className="text-green-600 font-semibold">Confirmed</span></p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full bg-primary text-white py-3 px-6 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
              >
                Complete Booking
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentInstructions;
