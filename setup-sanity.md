# 🚀 Sanity CMS Setup Guide

## **Step 1: Create Sanity Project**

1. **Go to https://www.sanity.io/manage**
2. **Sign up/Login** with your account
3. **Click "Create new project"**
4. **Name it:** `hotel-management`
5. **Choose dataset:** `production`
6. **Copy your Project ID** (looks like: `abc12345`)

## **Step 2: Get Your Sanity Token**

1. **In your Sanity project dashboard**
2. **Go to "API" section**
3. **Click "Add API token"**
4. **Name it:** `hotel-management-token`
5. **Permissions:** `Editor` (read/write)
6. **Copy the token** (starts with `sk...`)

## **Step 3: Update .env.local File**

Replace the content in your `.env.local` file with:

```env
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_STUDIO_TOKEN=your-sanity-token-here

# NextAuth Configuration
NEXTAUTH_SECRET=development-secret-key-123456789
NEXTAUTH_URL=http://localhost:3000
```

**Replace:**
- `your-project-id-here` with your actual Project ID
- `your-sanity-token-here` with your actual token

## **Step 4: Add Sample Data**

Once you have the environment variables set up, you can add sample hotel data through the Sanity Studio.

## **Step 5: Restart Your App**

```bash
npm run dev
```

## **Expected Result:**

After setup, you should see:
- ✅ No more "Sanity CMS is not configured" messages
- ✅ Real hotel data instead of fallback data
- ✅ Full booking functionality
- ✅ User management system

## **Need Help?**

If you get stuck, let me know and I'll help you troubleshoot! 