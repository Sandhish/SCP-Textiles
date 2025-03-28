import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Hero from '../Components/HeroSection/Hero';
import FeaturedProducts from '../Components/FeaturedProducts/FeaturedProducts';
import Category from '../Components/Category/Category';
import Testimonials from '../Components/Testimonals/Testimonials';
import About from '../Components/About/About';
import Footer from '../Components/Footer/Footer';

const LandingPage = ({ onAddToWishlist }) => {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts onAddToWishlist={onAddToWishlist} />
      <Category />
      <Testimonials />
      <About />
      <Footer />
    </>
  );
};

export default LandingPage;