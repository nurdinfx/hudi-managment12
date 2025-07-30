#!/usr/bin/env node

console.log('🏨 Hotel Management - Sanity CMS Setup Helper\n');

console.log('📋 Follow these steps to set up Sanity CMS:\n');

console.log('1️⃣  Go to https://www.sanity.io/manage');
console.log('2️⃣  Create a new project called "hotel-management"');
console.log('3️⃣  Copy your Project ID (looks like: abc12345)');
console.log('4️⃣  Go to API section and create a token');
console.log('5️⃣  Copy the token (starts with sk...)');
console.log('6️⃣  Update your .env.local file with these values\n');

console.log('📝 Your .env.local should look like this:');
console.log('==========================================');
console.log('NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here');
console.log('NEXT_PUBLIC_SANITY_DATASET=production');
console.log('SANITY_STUDIO_TOKEN=your-sanity-token-here');
console.log('NEXTAUTH_SECRET=development-secret-key-123456789');
console.log('NEXTAUTH_URL=http://localhost:3000');
console.log('==========================================\n');

console.log('✅ After setup, restart your app with: npm run dev');
console.log('🎉 You should see real hotel data instead of fallback data!'); 