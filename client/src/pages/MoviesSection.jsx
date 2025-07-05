import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, Calendar, Clock, Play, ChevronDown, Sparkles } from 'lucide-react'
import EmptyHero from '../components/home/EmptyHero'

const API_URL = import.meta.env.VITE_API_URL

// Format price as ₱ and always show two decimals, always numeric
const formatPrice = (price) => {
  if (typeof price === "string") {
    price = Number(price.replace(/[^\d.]/g, ""))
  }
  return `₱${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
}

const MoviesSection = () => {
  const [movies, setMovies] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isVisible, setIsVisible] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    // Fetch only active/scheduled-and-now-live movies for users
    fetch(`${API_URL}/api/movies/active`)
      .then(res => res.json())
      .then(data => {
        setMovies(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('movies')
    if (section) observer.observe(section)

    return () => {
      if (section) observer.unobserve(section)
    }
  }, [])

  // Get unique genres for filtering - "All" first
  const allGenres = [
    ...new Set(
      movies.flatMap(movie =>
        movie.genre ? movie.genre.split(' | ').map(g => g.trim()) : []
      )
    ),
  ].sort()

  const categories = ['All', ...allGenres]

  // Filter movies based on selected category
  const filteredMovies = selectedCategory === 'All'
    ? movies
    : movies.filter(
        movie =>
          movie.genre &&
          movie.genre.toLowerCase().includes(selectedCategory.toLowerCase())
      )

  // Show either first 8 or all movies based on showAll state
  const moviesToShow = showAll ? filteredMovies : filteredMovies.slice(0, 8)

  return (
    <section id="movies" className='relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white py-20 pt-32 overflow-hidden'>
      {/* Simplified Background Elements */}
      <div className='absolute inset-0 opacity-3'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-20 right-10 w-60 h-60 bg-purple-500 rounded-full blur-3xl animate-pulse'></div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16'>
        {/* Header Section */}
        <div className={`mb-16 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {/* Premium Badge */}
          <div className='inline-flex items-center space-x-2 bg-gradient-to-r from-red-600/20 to-red-700/20 border border-red-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-6'>
            <Sparkles className='w-4 h-4 text-red-400' />
            <span className='text-red-300 font-semibold tracking-wide text-sm'>PREMIUM COLLECTION</span>
            <Sparkles className='w-4 h-4 text-red-400' />
          </div>

          {/* Title */}
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight'>
            <span className='bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent'>
              Now
            </span>
            <br />
            <span className='bg-gradient-to-r from-red-400 via-red-500 to-red-600 bg-clip-text text-transparent'>
              Showing
            </span>
          </h2>

          {/* Description */}
          <div className='max-w-3xl mx-auto space-y-4'>
            <p className='text-gray-300 text-lg leading-relaxed'>
              Discover the latest blockbusters and critically acclaimed films. 
              <span className='text-red-400 font-semibold'> Premium quality</span> entertainment awaits.
            </p>
            
            {/* Stats */}
            <div className='flex items-center justify-center space-x-6 text-gray-400 mt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>{movies.length}</div>
                <div className='text-xs uppercase tracking-wider'>Movies</div>
              </div>
              <div className='w-px h-8 bg-gray-600'></div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>4K</div>
                <div className='text-xs uppercase tracking-wider'>Quality</div>
              </div>
              <div className='w-px h-8 bg-gray-600'></div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>24/7</div>
                <div className='text-xs uppercase tracking-wider'>Available</div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className={`mb-12 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className='flex flex-wrap justify-center gap-3'>
            {categories.slice(0, 7).map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setShowAll(false) // Reset to show first 8 when category changes
                }}
                className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/25'
                    : 'bg-gray-800/50 hover:bg-gray-700/70 text-gray-300 hover:text-white backdrop-blur-sm'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {!loading && moviesToShow.length === 0 && <EmptyHero />}
        {moviesToShow.length > 0 && (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            {moviesToShow.map((movie) => (
              <Link
                key={movie._id}
                to={`/movie/${movie._id}`}
                className='group bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-red-500/20 transition-all duration-500 hover:scale-105 block'
              >
                {/* Movie Poster */}
                <div className='relative aspect-[3/4] overflow-hidden'>
                  <img
                    src={movie.poster || movie.image}
                    alt={movie.title}
                    className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  />
                  
                  {/* Simple Overlay */}
                  <div className='absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
                    <div className='bg-red-600 text-white p-3 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300'>
                      <Play className='w-6 h-6 ml-0.5' fill='currentColor' />
                    </div>
                  </div>

                  {/* Studio Badge */}
                  {movie.studio && (
                    <div className='absolute top-3 left-3'>
                      <span className='bg-red-600 text-white px-2 py-1 text-xs font-bold uppercase rounded'>
                        {movie.studio}
                      </span>
                    </div>
                  )}

                  {/* Rating Badge */}
                  <div className='absolute top-3 right-3'>
                    <div className='flex items-center space-x-1 bg-black/70 px-2 py-1 rounded'>
                      <Star className='w-3 h-3 text-yellow-400' fill='currentColor' />
                      <span className='text-white text-xs font-bold'>
                        {movie.rating ? movie.rating : '8.5'}
                      </span>
                    </div>
                  </div>

                  {/* New Badge */}
                  {parseInt(movie.year) >= 2022 && (
                    <div className='absolute bottom-3 left-3'>
                      <span className='bg-green-500 text-white px-2 py-1 text-xs font-bold uppercase rounded animate-pulse'>
                        NEW
                      </span>
                    </div>
                  )}
                </div>

                {/* Movie Info */}
                <div className='p-4 space-y-3'>
                  <h3 className='text-lg font-bold leading-tight group-hover:text-red-400 transition-colors line-clamp-2'>
                    {movie.title}
                  </h3>

                  {/* Movie Meta */}
                  <div className='flex items-center justify-between text-gray-400 text-xs'>
                    <div className='flex items-center space-x-1'>
                      <Calendar className='w-3 h-3' />
                      <span>{movie.year}</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <Clock className='w-3 h-3' />
                      <span>{movie.duration}</span>
                    </div>
                  </div>

                  {/* Genre Tags */}
                  <div className='flex flex-wrap gap-1'>
                    {movie.genre &&
                      movie.genre.split(' | ').slice(0, 2).map((genre, index) => (
                        <span
                          key={index}
                          className='bg-gray-800 text-gray-300 px-2 py-1 text-xs rounded'
                        >
                          {genre}
                        </span>
                      ))}
                  </div>

                  {/* Description */}
                  <p className='text-gray-400 text-xs leading-relaxed line-clamp-2'>
                    {movie.description}
                  </p>

                  {/* CTA and Price */}
                  <div className='flex items-center justify-between pt-2 border-t border-gray-700/50'>
                    <div className='text-red-400 text-xs font-semibold group-hover:text-red-300 transition-colors'>
                      View Details →
                    </div>
                    <div className='flex items-center space-x-1 text-yellow-400'>
                      <Star className='w-3 h-3' fill='currentColor' />
                      <span className='text-xs font-bold'>
                        {movie.rating ? movie.rating : '8.5'}
                      </span>
                    </div>
                  </div>
                  {/* Show price if available */}
                  {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 && (
                    <div className="pt-2 text-xs text-green-400 font-bold">
                      {(() => {
                        // Find minimum price among showtimes
                        const minPrice = Math.min(
                          ...movie.showtimes
                            .filter(st => st && st.price !== undefined)
                            .map(st =>
                              typeof st.price === "string"
                                ? Number(st.price.replace(/[^\d.]/g, ""))
                                : Number(st.price)
                            )
                        )
                        return isFinite(minPrice)
                          ? `From ${formatPrice(minPrice)}`
                          : ''
                      })()}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Show More/Less Button */}
        {filteredMovies.length > 8 && (
          <div className={`text-center transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <button
              onClick={() => setShowAll(!showAll)}
              className='group inline-flex items-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-4 rounded-xl font-bold transition-all duration-300 shadow-xl hover:shadow-red-500/25 transform hover:scale-105'
            >
              <span>
                {showAll 
                  ? 'Show Less' 
                  : `Show All ${filteredMovies.length} Movies`
                }
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${
                showAll ? 'rotate-180' : ''
              }`} />
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}

export default MoviesSection