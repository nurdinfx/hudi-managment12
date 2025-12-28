# Supabase Integration Setup Guide

This guide will help you set up Supabase as the backend for your hotel management system.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js and npm installed
3. Your project already cloned and dependencies installed

## Step 1: Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New project"
3. Choose your organization
4. Enter project details:
   - Name: `hotel-management` (or your preferred name)
   - Database Password: Generate a strong password
   - Region: Choose closest to your users
5. Click "Create new project"

## Step 2: Set Up Database Schema

1. In your Supabase dashboard, go to the **SQL Editor**
2. Create a new query
3. Copy and paste the entire content from `supabase-setup.sql`
4. Run the query to create all tables, indexes, and policies

## Step 3: Configure Environment Variables

1. In your Supabase dashboard, go to **Settings** > **API**
2. Copy the following values:
   - Project URL
   - `anon` `public` key
   - `service_role` `secret` key (for server-side operations)

3. Create or update your `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# OAuth Providers (optional)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

## Step 4: Update Authentication (Optional)

If you want to use the new Supabase-compatible authentication:

1. Update your NextAuth configuration in `src/app/api/auth/[...nextauth]/route.ts`:

```typescript
import { authOptionsSupabase } from '@/libs/authSupabase';

const handler = NextAuth(authOptionsSupabase);
export { handler as GET, handler as POST };
```

## Step 5: Migrate Sample Data (Optional)

If you have existing data in Sanity, you'll need to migrate it to Supabase:

1. Export your data from Sanity
2. Transform the data to match Supabase schema
3. Import using the Supabase dashboard or SQL scripts

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Test the following features:
   - User authentication
   - Room listing
   - Booking creation
   - Review system

## Step 7: Set Up Row Level Security (RLS)

The SQL setup script already includes RLS policies, but you can customize them:

1. Go to **Authentication** > **Policies** in Supabase dashboard
2. Review and modify policies as needed
3. Test with different user roles

## Available API Functions

The following functions are now available in `src/libs/supabaseApis.ts`:

### Room Operations
- `getFeaturedRoom()` - Get featured room
- `getRooms()` - Get all rooms
- `getRoom(slug)` - Get room by slug
- `updateHotelRoom(roomId, isBooked)` - Update room booking status

### Booking Operations
- `createBooking(bookingData)` - Create new booking
- `getUserBookings(userId)` - Get user's bookings

### User Operations
- `getUserData(userId)` - Get user data
- `createOrUpdateUser(userData)` - Create or update user

### Review Operations
- `checkReviewExists(userId, roomId)` - Check if review exists
- `createReview(reviewData)` - Create new review
- `updateReview(reviewData)` - Update existing review
- `getRoomReviews(roomId)` - Get room reviews

## Migration Strategy

You can run both Sanity and Supabase in parallel during migration:

1. Keep existing Sanity code for content management
2. Use Supabase for user data, bookings, and reviews
3. Gradually migrate room data to Supabase
4. Update components to use new API functions

## Benefits of Supabase Integration

- **Real-time subscriptions** for live updates
- **Built-in authentication** with social providers
- **Row Level Security** for data protection
- **Automatic API generation** 
- **Scalable PostgreSQL database**
- **Edge functions** for serverless logic
- **File storage** for images and documents

## Troubleshooting

### Common Issues

1. **Environment variables not loading**
   - Restart your development server
   - Check `.env.local` file location and syntax

2. **RLS blocking operations**
   - Check your policies in Supabase dashboard
   - Ensure users are properly authenticated

3. **TypeScript errors**
   - Update imports to use new types from `supabaseTypes.ts`
   - Check function signatures match new API

4. **Connection issues**
   - Verify Supabase project URL and keys
   - Check network connectivity
   - Review Supabase project status

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

## Next Steps

1. Set up real-time subscriptions for live booking updates
2. Implement file storage for room images
3. Add advanced search and filtering
4. Set up database backups and monitoring
5. Configure production deployment
