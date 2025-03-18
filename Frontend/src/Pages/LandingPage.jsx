import React from 'react'
import Hero from '../Components/HeroSection/Hero'
import FeaturedProducts from '../Components/FeaturedProducts/FeaturedProducts'
import Navbar from '../Components/Navbar/Navbar'
import Category from '../Components/Category/Category'
import Testimonials from '../Components/Testimonals/Testimonials'
import Footer from '../Components/Footer/Footer'
import About from '../Components/About/About'

const LandingPage = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <FeaturedProducts />
      <Category />
      <Testimonials />
      <About />
      <Footer />
    </>
  )
}

export default LandingPage