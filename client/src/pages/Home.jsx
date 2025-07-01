import React from 'react'
import HeroSection from '../components/home/HeroSection'
import MoviesSection from './MoviesSection'
import TheatersSection from './TheatersSection'

const Home = () => {
  return (
    <div>
      <HeroSection/>
      <MoviesSection/>
      <TheatersSection/>
    </div>
  )
}

export default Home