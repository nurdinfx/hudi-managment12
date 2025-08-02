// Quick test script for payment API
const testPayment = async () => {
  try {
    console.log('Testing Somali payment API...');
    
    // Test GET - get available payment methods
    const methodsResponse = await fetch('http://localhost:3000/api/somali-payment');
    const methods = await methodsResponse.json();
    console.log('Available payment methods:', methods);
    
    // Test room fetch
    const roomResponse = await fetch('http://localhost:3000/api/rooms');
    console.log('Room API status:', roomResponse.status);
    
    console.log('Basic API tests completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testPayment();
