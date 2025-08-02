'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

const GetStarted = () => {
  const { data: session } = useSession();

  const features = [
    {
      icon: 'fas fa-bed',
      title: 'Comfortable Rooms',
      description: 'Enjoy luxurious and comfortable rooms with modern amenities and stunning views.'
    },
    {
      icon: 'fas fa-wifi',
      title: 'Free WiFi',
      description: 'Stay connected with complimentary high-speed WiFi throughout the hotel.'
    },
    {
      icon: 'fas fa-utensils',
      title: 'Restaurant & Bar',
      description: 'Savor delicious cuisine and refreshing drinks at our on-site restaurant and bar.'
    },
    {
      icon: 'fas fa-swimming-pool',
      title: 'Swimming Pool',
      description: 'Relax and unwind in our beautiful outdoor swimming pool and deck area.'
    },
    {
      icon: 'fas fa-concierge-bell',
      title: '24/7 Service',
      description: 'Our friendly staff is available around the clock to assist with your needs.'
    },
    {
      icon: 'fas fa-car',
      title: 'Parking',
      description: 'Complimentary parking is available for all our guests.'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Browse Rooms',
      description: 'Explore our collection of beautiful rooms and find the perfect one for your stay.',
      link: '/rooms'
    },
    {
      step: '2',
      title: 'Create Account',
      description: 'Sign up for an account to access exclusive features and manage your bookings.',
      link: '/auth'
    },
    {
      step: '3',
      title: 'Make Reservation',
      description: 'Select your dates, choose your room, and complete your booking in just a few clicks.'
    },
    {
      step: '4',
      title: 'Enjoy Your Stay',
      description: 'Check in and enjoy all the amenities and services we have to offer.'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-primary mb-6">Get Started with Hotelzz</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
          Welcome to your gateway to exceptional hospitality. Discover comfort, luxury, and 
          unforgettable experiences at Hotelzz. Let us guide you through your journey with us.
        </p>
        {!session ? (
          <Link 
            href="/auth"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors duration-300"
          >
            Start Your Journey
          </Link>
        ) : (
          <Link 
            href="/rooms"
            className="inline-block bg-primary text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-primary/90 transition-colors duration-300"
          >
            Browse Our Rooms
          </Link>
        )}
      </div>

      {/* Features Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Why Choose Hotelzz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <i className={`${feature.icon} text-white text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-black font-bold text-xl">
                {step.step}
              </div>
              <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">{step.description}</p>
              {step.link && (
                <Link 
                  href={step.link}
                  className="text-primary hover:text-primary/80 font-semibold underline"
                >
                  Get Started
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-tertiary-dark rounded-2xl p-12 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to Begin Your Experience?</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of satisfied guests who have made Hotelzz their home away from home.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/rooms"
            className="bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
          >
            View Rooms
          </Link>
          <Link 
            href="/contact"
            className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition-colors duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
