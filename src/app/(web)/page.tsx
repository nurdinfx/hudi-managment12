import FeaturedRoom from '@/components/FeaturedRoom/FeaturedRoom';
import Gallery from '@/components/Gallery/Gallery';
import HeroSection from '@/components/HeroSection/HeroSection';
import NewsLetter from '@/components/NewsLetter/NewsLetter';
import PageSearch from '@/components/PageSearch/PageSearch';
import SafeMigrationStatus from '@/components/SafeMigrationStatus/SafeMigrationStatus';
import AuthPrompt from '@/components/AuthPrompt/AuthPrompt';
import { getFeaturedRoom } from '@/libs/supabaseApis';

const Home = async () => {
  let featuredRoom = null;
  
  try {
    featuredRoom = await getFeaturedRoom();
  } catch (error) {
    // Silently handle the error without console warning
    featuredRoom = null;
  }

  // Provide fallback data when database is not available
  if (!featuredRoom) {
    featuredRoom = {
      id: 'fallback-room',
      name: 'Luxury Suite',
      description: 'Experience luxury and comfort in our premium suite with stunning views and world-class amenities.',
      price: 299,
      discount: 50,
      images: [
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
        'https://images.unsplash.com/photo-1520637836862-4d197d17c50a?w=800',
        'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'
      ],
      cover_image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      type: 'suite',
      dimension: '450 sq ft',
      number_of_beds: 2,
      amenities: ['WiFi', 'TV', 'Air Conditioning', 'Mini Bar'],
      slug: 'luxury-suite',
      special_note: 'Special rates available for extended stays.',
      is_booked: false,
      is_featured: true
    };
  }

  return (
    <>
      <HeroSection />
      <PageSearch />
      <AuthPrompt />
      <FeaturedRoom featuredRoom={featuredRoom} />
      <Gallery />
      <NewsLetter />
      <SafeMigrationStatus />
    </>
  );
};

export default Home;
