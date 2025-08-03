// Payment Configuration for Demo/Production Switching
// This file controls whether payments are in demo mode or production mode

export const PAYMENT_CONFIG = {
  // Set to false for production, true for demo
  IS_DEMO_MODE: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_DEMO_MODE === 'true',
  
  // Demo settings
  DEMO_SUCCESS_RATE: 0.95, // 95% success rate for demo payments
  DEMO_PROCESSING_TIME: 5000, // 5 seconds processing time
  
  // Production settings (when IS_DEMO_MODE is false)
  PRODUCTION_WEBHOOK_URL: process.env.PAYMENT_WEBHOOK_URL || '',
  PRODUCTION_API_KEY: process.env.PAYMENT_API_KEY || '',
  
  // Somali Payment Gateway Integration Settings
  PAYMENT_GATEWAYS: {
    // EVC Plus (Hormuud)
    EVC: {
      demo: {
        merchantId: 'DEMO_EVC_MERCHANT',
        apiUrl: 'https://demo-api.hormuud.com/evc',
        apiKey: 'demo_evc_key_123',
        shortCode: '*712*',
        isActive: true,
      },
      production: {
        merchantId: process.env.EVC_MERCHANT_ID || '',
        apiUrl: process.env.EVC_API_URL || 'https://api.hormuud.com/evc',
        apiKey: process.env.EVC_API_KEY || '',
        shortCode: '*712*',
        isActive: !!process.env.EVC_API_KEY,
      }
    },
    
    // Zaad Service (Telesom)
    ZAAD: {
      demo: {
        merchantId: 'DEMO_ZAAD_MERCHANT',
        apiUrl: 'https://demo-api.telesom.com/zaad',
        apiKey: 'demo_zaad_key_456',
        shortCode: '*770*',
        isActive: true,
      },
      production: {
        merchantId: process.env.ZAAD_MERCHANT_ID || '',
        apiUrl: process.env.ZAAD_API_URL || 'https://api.telesom.com/zaad',
        apiKey: process.env.ZAAD_API_KEY || '',
        shortCode: '*770*',
        isActive: !!process.env.ZAAD_API_KEY,
      }
    },
    
    // Sahal (Golis)
    SAHAL: {
      demo: {
        merchantId: 'DEMO_SAHAL_MERCHANT',
        apiUrl: 'https://demo-api.golis.com/sahal',
        apiKey: 'demo_sahal_key_789',
        shortCode: '*747*',
        isActive: true,
      },
      production: {
        merchantId: process.env.SAHAL_MERCHANT_ID || '',
        apiUrl: process.env.SAHAL_API_URL || 'https://api.golis.com/sahal',
        apiKey: process.env.SAHAL_API_KEY || '',
        shortCode: '*747*',
        isActive: !!process.env.SAHAL_API_KEY,
      }
    },
    
    // eDahab (Hormuud)
    EDAHAB: {
      demo: {
        merchantId: 'DEMO_EDAHAB_MERCHANT',
        apiUrl: 'https://demo-api.hormuud.com/edahab',
        apiKey: 'demo_edahab_key_012',
        isActive: true,
      },
      production: {
        merchantId: process.env.EDAHAB_MERCHANT_ID || '',
        apiUrl: process.env.EDAHAB_API_URL || 'https://api.hormuud.com/edahab',
        apiKey: process.env.EDAHAB_API_KEY || '',
        isActive: !!process.env.EDAHAB_API_KEY,
      }
    },
    
    // Premier Bank
    PREMIER_BANK: {
      demo: {
        accountNumber: '1234567890',
        swiftCode: 'PREMSOMA',
        bankCode: 'DEMO_PREMIER',
        isActive: true,
      },
      production: {
        accountNumber: process.env.PREMIER_ACCOUNT_NUMBER || '',
        swiftCode: process.env.PREMIER_SWIFT_CODE || '',
        bankCode: process.env.PREMIER_BANK_CODE || '',
        isActive: !!process.env.PREMIER_ACCOUNT_NUMBER,
      }
    },
    
    // Dahabshiil
    DAHABSHIIL: {
      demo: {
        agentCode: 'DEMO_DAHABSHIIL',
        apiUrl: 'https://demo-api.dahabshiil.com',
        apiKey: 'demo_dahabshiil_key_345',
        isActive: true,
      },
      production: {
        agentCode: process.env.DAHABSHIIL_AGENT_CODE || '',
        apiUrl: process.env.DAHABSHIIL_API_URL || 'https://api.dahabshiil.com',
        apiKey: process.env.DAHABSHIIL_API_KEY || '',
        isActive: !!process.env.DAHABSHIIL_API_KEY,
      }
    },
    
    // WorldRemit
    WORLD_REMIT: {
      demo: {
        partnerId: 'DEMO_WORLDREMIT',
        apiUrl: 'https://demo-api.worldremit.com',
        apiKey: 'demo_worldremit_key_678',
        isActive: true,
      },
      production: {
        partnerId: process.env.WORLDREMIT_PARTNER_ID || '',
        apiUrl: process.env.WORLDREMIT_API_URL || 'https://api.worldremit.com',
        apiKey: process.env.WORLDREMIT_API_KEY || '',
        isActive: !!process.env.WORLDREMIT_API_KEY,
      }
    }
  }
};

// Get current configuration based on environment
export function getPaymentConfig(gateway: keyof typeof PAYMENT_CONFIG.PAYMENT_GATEWAYS) {
  const config = PAYMENT_CONFIG.PAYMENT_GATEWAYS[gateway];
  return PAYMENT_CONFIG.IS_DEMO_MODE ? config.demo : config.production;
}

// Check if we're in demo mode
export function isDemoMode(): boolean {
  return PAYMENT_CONFIG.IS_DEMO_MODE;
}

// Get demo payment result (for simulation)
export function getDemoPaymentResult(): { success: boolean; message: string } {
  const random = Math.random();
  
  if (random < PAYMENT_CONFIG.DEMO_SUCCESS_RATE) {
    return {
      success: true,
      message: 'Payment completed successfully'
    };
  } else {
    const errorMessages = [
      'Insufficient balance',
      'Network timeout',
      'Invalid PIN',
      'Service temporarily unavailable'
    ];
    return {
      success: false,
      message: errorMessages[Math.floor(Math.random() * errorMessages.length)]
    };
  }
}

// Validate payment configuration for production
export function validateProductionConfig(): { valid: boolean; missing: string[] } {
  if (PAYMENT_CONFIG.IS_DEMO_MODE) {
    return { valid: true, missing: [] };
  }
  
  const missing: string[] = [];
  
  // Check required environment variables for production
  const requiredVars = [
    'PAYMENT_WEBHOOK_URL',
    'PAYMENT_API_KEY',
    'EVC_MERCHANT_ID',
    'EVC_API_KEY',
    'ZAAD_MERCHANT_ID', 
    'ZAAD_API_KEY',
    'SAHAL_MERCHANT_ID',
    'SAHAL_API_KEY',
    'EDAHAB_MERCHANT_ID',
    'EDAHAB_API_KEY',
    'PREMIER_ACCOUNT_NUMBER',
    'DAHABSHIIL_AGENT_CODE',
    'DAHABSHIIL_API_KEY',
    'WORLDREMIT_PARTNER_ID',
    'WORLDREMIT_API_KEY'
  ];
  
  requiredVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    }
  });
  
  return {
    valid: missing.length === 0,
    missing
  };
}

// Format phone number for Somali mobile money
export function formatSomaliPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Add country code if missing
  if (digits.startsWith('6') || digits.startsWith('9')) {
    return `252${digits}`;
  }
  
  if (digits.startsWith('252')) {
    return digits;
  }
  
  return `252${digits}`;
}

// Generate demo reference numbers that look realistic
export function generateDemoReference(paymentMethod: string): string {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.random().toString(36).substr(2, 4).toUpperCase();
  
  const prefixes = {
    evc: 'EVC',
    zaad: 'ZAD', 
    sahal: 'SHL',
    edahab: 'EDH',
    premier_bank: 'PBK',
    dahabshiil: 'DBS',
    world_remit: 'WRM'
  };
  
  const prefix = prefixes[paymentMethod as keyof typeof prefixes] || 'PAY';
  return `${prefix}${timestamp}${random}`;
}

// Environment Variables Documentation for Production
export const PRODUCTION_ENV_DOCS = {
  description: "Required environment variables for production payment processing",
  variables: {
    // General
    NEXT_PUBLIC_DEMO_MODE: "Set to 'false' for production",
    PAYMENT_WEBHOOK_URL: "URL to receive payment notifications",
    PAYMENT_API_KEY: "Master API key for payment processing",
    
    // EVC Plus
    EVC_MERCHANT_ID: "Hormuud EVC merchant ID",
    EVC_API_URL: "Hormuud EVC API endpoint",
    EVC_API_KEY: "Hormuud EVC API key",
    
    // Zaad Service  
    ZAAD_MERCHANT_ID: "Telesom Zaad merchant ID",
    ZAAD_API_URL: "Telesom Zaad API endpoint",
    ZAAD_API_KEY: "Telesom Zaad API key",
    
    // Sahal
    SAHAL_MERCHANT_ID: "Golis Sahal merchant ID", 
    SAHAL_API_URL: "Golis Sahal API endpoint",
    SAHAL_API_KEY: "Golis Sahal API key",
    
    // eDahab
    EDAHAB_MERCHANT_ID: "Hormuud eDahab merchant ID",
    EDAHAB_API_URL: "Hormuud eDahab API endpoint", 
    EDAHAB_API_KEY: "Hormuud eDahab API key",
    
    // Premier Bank
    PREMIER_ACCOUNT_NUMBER: "Premier Bank receiving account number",
    PREMIER_SWIFT_CODE: "Premier Bank SWIFT code",
    PREMIER_BANK_CODE: "Premier Bank institution code",
    
    // Dahabshiil
    DAHABSHIIL_AGENT_CODE: "Dahabshiil agent/partner code",
    DAHABSHIIL_API_URL: "Dahabshiil API endpoint",
    DAHABSHIIL_API_KEY: "Dahabshiil API key",
    
    // WorldRemit
    WORLDREMIT_PARTNER_ID: "WorldRemit partner ID",
    WORLDREMIT_API_URL: "WorldRemit API endpoint", 
    WORLDREMIT_API_KEY: "WorldRemit API key"
  }
};
