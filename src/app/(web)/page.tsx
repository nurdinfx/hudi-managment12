import FeaturedRoom from '@/components/FeaturedRoom/FeaturedRoom';
import Gallery from '@/components/Gallery/Gallery';
import HeroSection from '@/components/HeroSection/HeroSection';
import NewsLetter from '@/components/NewsLetter/NewsLetter';
import PageSearch from '@/components/PageSearch/PageSearch';
import { getFeaturedRoom } from '@/libs/supabaseApis';

const Home = async () => {
  let featuredRoom = null;
  
  try {
    featuredRoom = await getFeaturedRoom();
  } catch (error) {
    // Silently handle the error without console warning
    featuredRoom = null;
  }

  // Provide fallback data when Sanity is not configured or fails
  if (!featuredRoom) {
    featuredRoom = {
      _id: 'fallback-room',
      name: 'Luxury Suite',
      description: 'Experience luxury and comfort in our premium suite with stunning views and world-class amenities.',
      price: 299,
      discount: 50,
      images: [
        {
          _key: 'fallback-image-1',
          url: '/images/hero-1.jpeg'
        },
        {
          _key: 'fallback-image-2',
          url: '/images/hero-2.jpeg'
        },
        {
          _key: 'fallback-image-3',
          url: '/images/hero-3.jpeg'
        }
      ],
      coverImage: {
        url: '/images/hero-1.jpeg'
      },
      type: 'suite',
      dimension: '450 sq ft',
      numberOfBeds: 2,
      offeredAmenities: [
        { _key: 'wifi', amenity: 'WiFi', icon: 'wifi' },
        { _key: 'tv', amenity: 'TV', icon: 'tv' },
        { _key: 'ac', amenity: 'Air Conditioning', icon: 'snowflake' },
        { _key: 'minibar', amenity: 'Mini Bar', icon: 'glass' }
      ],
      slug: { _type: 'slug', current: 'luxury-suite' },
      specialNote: 'Special rates available for extended stays.',
      isBooked: false,
      isFeatured: true
    };
  }

  return (
    <>
      <HeroSection />
      <PageSearch />
      <FeaturedRoom featuredRoom={featuredRoom} />
      <Gallery />
      <NewsLetter />
    </>
  );
};

export default Home;
