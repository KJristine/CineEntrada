import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TrailerModal from '../movies/TrailerModal'
import EmptyHero from './EmptyHero'

const API_URL = import.meta.env.VITE_API_URL

const HeroSection = () => {
  const [movies, setMovies] = useState([])
  const [currentMovie, setCurrentMovie] = useState(0)
  const [isLoaded, setIsLoaded] = useState(true)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const navigate = useNavigate()

  // Fetch only active/scheduled-and-now-live movies for users
  useEffect(() => {
    fetch(`${API_URL}/api/movies/active`)
      .then(res => res.json())
      .then(data => setMovies(data))
  }, [])

  // Clean auto-slide functionality
  useEffect(() => {
    if (movies.length === 0) return
    const interval = setInterval(() => {
      setIsLoaded(false)
      setTimeout(() => {
        setCurrentMovie((prev) => (prev + 1) % movies.length)
        setIsLoaded(true)
      }, 300)
    }, 4500)
    return () => clearInterval(interval)
  }, [movies])

  if (movies.length === 0) return <EmptyHero />
  const currentMovieData = movies[currentMovie]

  // Balanced title sizing - prevents cut-off while maintaining readability
  const getTitleSizeClasses = (title) => {
    const length = title.length
    if (length > 25) {
      return 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl'
    } else if (length > 15) {
      return 'text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl'
    } else {
      return 'text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl'
    }
  }

  const openTrailer = () => setIsTrailerOpen(true)
  const closeTrailer = () => setIsTrailerOpen(false)

  // Instead of opening modal, navigate to MovieDetails with ?book=1
  const handleBookNow = () => {
    navigate(`/movie/${currentMovieData._id}?book=1`)
  }

  return (
    <>
      <div className='relative w-full h-screen overflow-hidden'>
        {/* Clean Background Image Transition */}
        <div 
          className={`absolute inset-0 bg-cover bg-no-repeat transition-opacity duration-300 ease-out ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ 
            backgroundImage: `url(${currentMovieData.backdrop || currentMovieData.poster || currentMovieData.image})`,
            backgroundPosition: currentMovieData.backgroundPosition || 'center center'
          }}
        >
          {/* Simple gradient overlay */}
          <div className='absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent'></div>
          <div className='absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30'></div>
        </div>

        {/* Content with balanced spacing */}
        <div className='relative z-10 flex items-center h-full w-full px-8 sm:px-12 md:px-16 lg:px-24 xl:px-32 2xl:px-40 pt-16'>
          <div className='w-full max-w-7xl mx-auto'>
            <div className='max-w-5xl mx-auto sm:mx-0'>
              <div className={`text-center sm:text-left transition-all duration-300 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>

                {/* Studio Badge */}
                <div className='mb-3 sm:mb-4 flex items-center justify-center sm:justify-start space-x-3 sm:space-x-4 flex-wrap gap-y-2'>
                  <span className='bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-6 py-1.5 sm:py-2 text-sm font-bold uppercase tracking-wider rounded-full'>
                    {currentMovieData.studio}
                  </span>
                  <div className='flex items-center space-x-2 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full'>
                    <svg className='w-4 h-4 text-yellow-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                    <span className='text-white text-sm font-semibold'>{currentMovieData.rating || '8.5'}</span>
                  </div>
                </div>

                {/* Balanced Title - Proper spacing and height */}
                <h1 className={`${getTitleSizeClasses(currentMovieData.title)} font-black text-white mb-4 sm:mb-5 lg:mb-6 leading-tight tracking-tight drop-shadow-2xl break-words`}>
                  {currentMovieData.title}
                </h1>

                {/* Movie Info */}
                <div className='flex items-center justify-center sm:justify-start text-white/90 mb-4 sm:mb-5 space-x-3 flex-wrap gap-y-2'>
                  <span className='text-sm font-medium bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full'>
                    {currentMovieData.genre}
                  </span>
                  <div className='flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd' />
                    </svg>
                    <span className='font-medium text-sm'>{currentMovieData.year}</span>
                  </div>
                  <div className='flex items-center space-x-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-full'>
                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                      <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z' clipRule='evenodd' />
                    </svg>
                    <span className='font-medium text-sm'>{currentMovieData.duration}</span>
                  </div>
                </div>

                {/* Description with proper spacing */}
                <p className='text-white/95 text-base sm:text-lg leading-relaxed mb-6 sm:mb-7 lg:mb-8 max-w-2xl lg:max-w-3xl mx-auto sm:mx-0 font-light line-clamp-4'>
                  {currentMovieData.description}
                </p>

                {/* Action Buttons */}
                <div className='flex flex-col sm:flex-row items-center sm:items-start justify-center sm:justify-start space-y-3 sm:space-y-0 sm:space-x-4'>
                  <button
                    onClick={handleBookNow}
                    className='group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center space-x-3 shadow-2xl hover:shadow-red-500/25 transform hover:scale-105 w-full sm:w-auto'
                  >
                    <svg className='w-5 h-5 group-hover:rotate-12 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' />
                    </svg>
                    <span>Book Tickets</span>
                  </button>
                  <button 
                    onClick={openTrailer}
                    className='group border-2 border-white/40 text-white hover:bg-white/10 hover:border-white/60 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-bold text-base transition-all duration-300 flex items-center space-x-3 backdrop-blur-sm hover:backdrop-blur-md transform hover:scale-105 w-full sm:w-auto'
                  >
                    <svg className='w-5 h-5 group-hover:scale-110 transition-transform duration-300' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span>Watch Trailer</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <TrailerModal 
        isOpen={isTrailerOpen}
        onClose={closeTrailer}
        movieTitle={currentMovieData.title}
        trailerUrl={currentMovieData.trailer}
      />
    </>
  )
}

export default HeroSection