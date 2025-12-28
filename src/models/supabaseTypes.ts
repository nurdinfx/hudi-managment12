// Updated types for Supabase integration

export type User = {
  id: string;
  email: string;
  name: string;
  image: string | null;
  about: string | null;
  created_at: string;
  updated_at: string;
};

export type Room = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  discount: number;
  type: string;
  dimension: string;
  number_of_beds: number;
  is_booked: boolean;
  is_featured: boolean;
  special_note: string | null;
  cover_image: string;
  images: string[];
  amenities: string[];
  created_at: string;
  updated_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  room_id: string;
  checkin_date: string;
  checkout_date: string;
  number_of_days: number;
  adults: number;
  children: number;
  total_price: number;
  discount: number;
  created_at: string;
  updated_at: string;
  // Joined data
  rooms?: {
    id: string;
    name: string;
    slug: string;
    price: number;
  };
};

export type Review = {
  id: string;
  user_id: string;
  room_id: string;
  rating: number;
  text: string;
  created_at: string;
  updated_at: string;
  // Joined data
  users?: {
    name: string;
    image: string | null;
  };
};

export type CreateBookingDto = {
  user: string;
  hotelRoom: string;
  checkinDate: string;
  checkoutDate: string;
  numberOfDays: number;
  adults: number;
  children: number;
  totalPrice: number;
  discount: number;
};

export type CreateReviewDto = {
  hotelRoomId: string;
  reviewText: string;
  userId: string;
  userRating: number;
};

export type UpdateReviewDto = {
  reviewId: string;
  reviewText: string;
  userRating: number;
};
