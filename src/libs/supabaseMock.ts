// Mock Supabase client for development and demo purposes
// This simulates the Supabase API with in-memory data

let mockData = {
  users: [
    {
      id: 'user-1',
      email: 'admin@hotel.com',
      name: 'Hotel Admin',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      about: 'Hotel management administrator',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'user-2',
      email: 'guest@example.com',
      name: 'John Doe',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      about: 'Frequent hotel guest',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ] as any[],
  rooms: [
    {
      id: '1',
      name: 'Deluxe Ocean View',
      slug: 'deluxe-ocean-view',
      description: 'Beautiful oceanfront room with stunning views of the crystal blue waters. Perfect for romantic getaways with modern amenities and luxurious comfort.',
      price: 150,
      discount: 10,
      type: 'Deluxe',
      dimension: '35 sqm',
      number_of_beds: 1,
      is_booked: false,
      is_featured: true,
      special_note: 'Perfect for romantic getaways',
      cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=800',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
      ],
      amenities: ['WiFi', 'Ocean View', 'Air Conditioning', 'Mini Bar', 'Balcony', 'Room Service'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Standard City Room',
      slug: 'standard-city-room',
      description: 'Comfortable city view room with modern amenities perfect for business travelers. Clean, efficient, and well-equipped.',
      price: 100,
      discount: 5,
      type: 'Standard',
      dimension: '25 sqm',
      number_of_beds: 1,
      is_booked: false,
      is_featured: false,
      special_note: 'Great for business travelers',
      cover_image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
      images: [
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'
      ],
      amenities: ['WiFi', 'City View', 'Air Conditioning', 'Work Desk', 'Coffee Maker'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Family Suite',
      slug: 'family-suite',
      description: 'Spacious suite perfect for families with children. Includes separate living area and all the amenities needed for a comfortable family stay.',
      price: 200,
      discount: 15,
      type: 'Suite',
      dimension: '50 sqm',
      number_of_beds: 2,
      is_booked: false,
      is_featured: true,
      special_note: 'Includes complimentary breakfast for children',
      cover_image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
      images: [
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=800'
      ],
      amenities: ['WiFi', 'Kitchen', 'Living Area', 'Balcony', 'Kids Area', 'Refrigerator'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Luxury Presidential Suite',
      slug: 'luxury-presidential-suite',
      description: 'The ultimate in luxury accommodation with panoramic views, premium amenities, and personalized service.',
      price: 500,
      discount: 20,
      type: 'Presidential',
      dimension: '80 sqm',
      number_of_beds: 2,
      is_booked: false,
      is_featured: false,
      special_note: 'Includes personal butler service',
      cover_image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
      images: [
        'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=800'
      ],
      amenities: ['WiFi', 'Panoramic View', 'Jacuzzi', 'Private Balcony', 'Butler Service', 'Premium Bar'],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ] as any[],
  bookings: [
    {
      id: 'booking-1',
      user_id: 'user-2',
      room_id: '1',
      checkin_date: '2024-02-15',
      checkout_date: '2024-02-18',
      number_of_days: 3,
      adults: 2,
      children: 0,
      total_price: 405, // 150 * 3 days with discount
      discount: 45,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ] as any[],
  reviews: [
    {
      id: 'review-1',
      user_id: 'user-2',
      room_id: '1',
      rating: 5,
      text: 'Amazing ocean view room! The service was exceptional and the room was spotless. Highly recommend for couples.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: 'review-2',
      user_id: 'user-1',
      room_id: '3',
      rating: 4,
      text: 'Great family suite with plenty of space. Kids loved the amenities and the breakfast was delicious.',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ] as any[],
  payments: [
    {
      id: 'payment-1',
      payment_id: 'SOM-1736272800000-abc123def',
      reference_number: 'REF-1736272800000-ABC123',
      user_id: 'user-2',
      room_id: '1',
      amount: 405,
      base_amount: 450,
      fee_amount: 2.25,
      currency: 'USD',
      payment_method: 'evc',
      status: 'confirmed',
      checkin_date: '2024-02-15',
      checkout_date: '2024-02-18',
      adults: 2,
      children: 0,
      number_of_days: 3,
      phone_number: '+252611234567',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      confirmed_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
  ] as any[],
};

export const mockSupabase = {
  from: (table: string) => ({
    select: (columns: string = '*') => ({
      eq: (column: string, value: any) => ({
        single: async () => {
          const data = mockData[table as keyof typeof mockData];
          const result = data.find((item: any) => item[column] === value);
          return { data: result || null, error: null };
        },
        order: (column: string, options?: any) => ({
          eq: (col: string, val: any) => ({
            async then(resolve: any) {
              const data = mockData[table as keyof typeof mockData];
              const filtered = data.filter((item: any) => item[col] === val);
              resolve({ data: filtered, error: null });
            }
          })
        }),
        async then(resolve: any) {
          const data = mockData[table as keyof typeof mockData];
          const filtered = data.filter((item: any) => item[column] === value);
          resolve({ data: filtered, error: null });
        }
      }),
      order: (column: string, options?: any) => ({
        async then(resolve: any) {
          const data = mockData[table as keyof typeof mockData];
          const sorted = [...data].sort((a, b) => {
            const aVal = a[column];
            const bVal = b[column];
            if (options?.ascending === false) {
              return bVal > aVal ? 1 : -1;
            }
            return aVal > bVal ? 1 : -1;
          });
          resolve({ data: sorted, error: null });
        }
      }),
      async then(resolve: any) {
        const data = mockData[table as keyof typeof mockData];
        resolve({ data, error: null });
      }
    }),
    insert: (data: any) => ({
      select: () => ({
        single: async () => {
          const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockData[table as keyof typeof mockData].push(newItem);
          return { data: newItem, error: null };
        },
        async then(resolve: any) {
          const newItem = {
            id: Math.random().toString(36).substr(2, 9),
            ...data,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };
          mockData[table as keyof typeof mockData].push(newItem);
          resolve({ data: [newItem], error: null });
        }
      })
    }),
    update: (data: any) => ({
      eq: (column: string, value: any) => ({
        select: () => ({
          single: async () => {
            const items = mockData[table as keyof typeof mockData];
            const index = items.findIndex((item: any) => item[column] === value);
            if (index !== -1) {
              items[index] = { ...items[index], ...data, updated_at: new Date().toISOString() };
              return { data: items[index], error: null };
            }
            return { data: null, error: new Error('Item not found') };
          }
        })
      })
    }),
    upsert: (data: any) => ({
      select: () => ({
        async then(resolve: any) {
          const items = mockData[table as keyof typeof mockData];
          const existingIndex = items.findIndex((item: any) => item.id === data.id);
          
          if (existingIndex !== -1) {
            items[existingIndex] = { ...items[existingIndex], ...data, updated_at: new Date().toISOString() };
            resolve({ data: [items[existingIndex]], error: null });
          } else {
            const newItem = {
              ...data,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            };
            items.push(newItem);
            resolve({ data: [newItem], error: null });
          }
        }
      })
    })
  }),
  rpc: (functionName: string, params?: any) => {
    switch (functionName) {
      case 'expire_old_payments':
        return Promise.resolve({ data: null, error: null });
      case 'get_payment_summary':
        const payments = mockData.payments.filter((p: any) => p.user_id === params?.user_uuid);
        const summary = {
          total_payments: payments.length,
          pending_payments: payments.filter((p: any) => p.status === 'pending').length,
          confirmed_payments: payments.filter((p: any) => p.status === 'confirmed').length,
          total_amount: payments
            .filter((p: any) => p.status === 'confirmed')
            .reduce((sum: number, p: any) => sum + p.amount, 0),
        };
        return Promise.resolve({ data: [summary], error: null });
      default:
        return Promise.resolve({ data: null, error: null });
    }
  }
};

export const createMockServerSupabaseClient = () => mockSupabase;

// Helper to get mock data for testing
export const getMockData = () => mockData;
export const setMockData = (newData: typeof mockData) => {
  mockData = newData;
};
