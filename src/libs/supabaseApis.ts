import { supabase, createServerSupabaseClient } from './supabase'
import { CreateBookingDto } from '@/models/room'
import { CreateReviewDto, UpdateReviewDto } from '@/models/review'

// Room operations
export async function getFeaturedRoom() {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('is_featured', true)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching featured room:', error)
    return null
  }
}

export async function getRooms() {
  if (!supabase) {
    console.warn('Supabase not configured')
    return []
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching rooms:', error)
    return []
  }
}

export async function getRoom(slug: string) {
  if (!supabase) {
    console.warn('Supabase not configured')
    return null
  }

  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching room:', error)
    return null
  }
}

export async function updateHotelRoom(roomId: string, isBooked: boolean = true) {
  try {
    const supabaseServer = createServerSupabaseClient()
    const { data, error } = await supabaseServer
      .from('rooms')
      .update({ is_booked: isBooked, updated_at: new Date().toISOString() })
      .eq('id', roomId)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating room:', error)
    throw error
  }
}

// Booking operations
export async function createBooking({
  adults,
  checkinDate,
  checkoutDate,
  children,
  discount,
  hotelRoom,
  numberOfDays,
  totalPrice,
  user,
}: CreateBookingDto) {
  try {
    const supabaseServer = createServerSupabaseClient()
    const { data, error } = await supabaseServer
      .from('bookings')
      .insert({
        user_id: user,
        room_id: hotelRoom,
        checkin_date: checkinDate,
        checkout_date: checkoutDate,
        number_of_days: numberOfDays,
        adults,
        children,
        total_price: totalPrice,
        discount: discount || 0,
      })
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating booking:', error)
    throw error
  }
}

export async function getUserBookings(userId: string) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        rooms:room_id (
          id,
          name,
          slug,
          price
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching user bookings:', error)
    return []
  }
}

// User operations
export async function getUserData(userId: string) {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching user data:', error)
    return null
  }
}

export async function createOrUpdateUser(userData: {
  id: string
  email: string
  name: string
  image?: string
}) {
  try {
    const supabaseServer = createServerSupabaseClient()
    const { data, error } = await supabaseServer
      .from('users')
      .upsert({
        id: userData.id,
        email: userData.email,
        name: userData.name,
        image: userData.image || null,
        updated_at: new Date().toISOString(),
      })
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating/updating user:', error)
    throw error
  }
}

// Review operations
export async function checkReviewExists(
  userId: string,
  roomId: string
): Promise<null | { id: string }> {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', userId)
      .eq('room_id', roomId)
      .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
  } catch (error) {
    console.error('Error checking review exists:', error)
    return null
  }
}

export async function createReview({
  hotelRoomId,
  reviewText,
  userId,
  userRating,
}: CreateReviewDto) {
  try {
    const supabaseServer = createServerSupabaseClient()
    const { data, error } = await supabaseServer
      .from('reviews')
      .insert({
        user_id: userId,
        room_id: hotelRoomId,
        rating: userRating,
        text: reviewText,
      })
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating review:', error)
    throw error
  }
}

export async function updateReview({
  reviewId,
  reviewText,
  userRating,
}: UpdateReviewDto) {
  try {
    const supabaseServer = createServerSupabaseClient()
    const { data, error } = await supabaseServer
      .from('reviews')
      .update({
        rating: userRating,
        text: reviewText,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating review:', error)
    throw error
  }
}

export async function getRoomReviews(roomId: string) {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users:user_id (
          name,
          image
        )
      `)
      .eq('room_id', roomId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error fetching room reviews:', error)
    return []
  }
}
