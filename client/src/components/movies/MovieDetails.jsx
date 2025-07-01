import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Star, Users, Clock, Globe, Award, Ticket, Zap, Play, ChevronDown } from 'lucide-react'
import BookingModal from '../bookings/BookingModal'
import TrailerModal from './TrailerModal'
import '../../index.css'

const API_URL = import.meta.env.VITE_API_URL

// Helper to sort showtimes by time (e.g. "2:00 PM", "11:30 AM")
const sortShowtimes = (showtimes) => {
  const parseTime = (timeStr) => {
    if (!timeStr) return 0
    const [time, modifier] = timeStr.split(' ')
    if (!time || !modifier) return 0
    let [hours, minutes] = time.split(':').map(Number)
    if (modifier.toLowerCase() === 'pm' && hours !== 12) hours += 12
    if (modifier.toLowerCase() === 'am' && hours === 12) hours = 0
    return hours * 60 + minutes
  }
  return [...(showtimes || [])].sort((a, b) => parseTime(a.time) - parseTime(b.time))
}

const formatPrice = (price) => {
  if (typeof price === "string") {
    price = Number(price.replace(/[^\d.]/g, ""))
  }
  return `₱${Number(price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
}

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const [movie, setMovie] = useState(null)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)
  const [isBookingOpen, setIsBookingOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`${API_URL}/api/movies/${id}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        setMovie(data)
        setLoading(false)
      })
      .catch(() => {
        setMovie(null)
        setLoading(false)
      })
  }, [id])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('book') === '1') setIsBookingOpen(true)
  }, [location.search])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <span className="text-2xl animate-pulse">Loading movie details...</span>
      </div>
    )
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <h2 className="text-3xl font-bold mb-4">Movie Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold mt-4"
        >
          Back to Home
        </button>
      </div>
    )
  }

  const openTrailer = () => setIsTrailerOpen(true)
  const closeTrailer = () => setIsTrailerOpen(false)
  const handleBookTickets = () => setIsBookingOpen(true)

  return (
    <>
      <div className='min-h-screen bg-gray-950 text-white overflow-hidden'>
        {/* Background and overlays */}
        <div className='relative min-h-screen flex items-center overflow-hidden'>
          <div
            className='absolute inset-0 scale-105 transition-transform duration-1000'
            style={{
              backgroundImage: `url(${movie.backdrop || movie.poster || movie.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundAttachment: 'fixed'
            }}
          >
            <div className='absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent'></div>
            <div className='absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/60'></div>
            <div className='absolute inset-0 bg-gradient-to-br from-red-900/20 via-transparent to-purple-900/20'></div>
          </div>
          {/* Floating particles */}
          <div className='absolute inset-0 overflow-hidden'>
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className='absolute w-1 h-1 bg-white rounded-full animate-pulse opacity-20'
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 3}s`
                }}
              />
            ))}
          </div>
          {/* Main content */}
          <div className='relative z-10 w-full px-4 sm:px-6 md:px-10 lg:px-24'>
            <div className='max-w-7xl mx-auto'>
              {/* Responsive: Hide poster on 2xl and below, show only on 2xl+ */}
              <div className='flex flex-col 2xl:grid 2xl:grid-cols-12 gap-8 md:gap-14 lg:gap-16 items-center'>
                {/* Poster (hidden on 2xl and below) */}
                <div className='hidden 2xl:flex w-full justify-center 2xl:justify-start mb-8 2xl:mb-0 2xl:col-span-5'>
                  <div className='relative group w-full max-w-xs sm:max-w-sm md:max-w-md'>
                    <div className='absolute -inset-4 bg-gradient-to-r from-red-500/50 via-purple-500/50 to-blue-500/50 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700'></div>
                    <div className='relative'>
                      <img
                        src={movie.poster || movie.image}
                        alt={movie.title}
                        className='w-full rounded-3xl shadow-2xl object-cover'
                      />
                      {movie.studio && (
                        <div className='absolute -top-4 -right-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-300 text-xs sm:text-base'>
                          {movie.studio}
                        </div>
                      )}
                      <div className='absolute -bottom-4 -left-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-2xl font-bold shadow-2xl transform -rotate-12 hover:rotate-0 transition-transform duration-300 flex items-center space-x-2 text-xs sm:text-base'>
                        <Star className='w-4 h-4 sm:w-5 sm:h-5 fill-current' />
                        <span>{movie.rating || '8.5'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Details */}
                <div className='w-full 2xl:col-span-7 space-y-6 sm:space-y-8'>
                  <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight'>
                    <span className='bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent'>
                      {movie.title}
                    </span>
                  </h1>
                  {/* Badges and info: always visible, but on mobile, show poster badges here */}
                  <div className='flex flex-wrap items-center gap-2 sm:gap-4 mb-2'>
                    <span className='bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold'>
                      {movie.genre?.split(' | ')[0]}
                    </span>
                    <span className='text-gray-300 font-medium text-xs sm:text-base'>{movie.year}</span>
                    <div className='flex items-center space-x-1 text-green-400 text-xs sm:text-base'>
                      <Users className='w-4 h-4' />
                      <span className='font-medium'>PG-13</span>
                    </div>
                    {/* Show badges on mobile only, but move below on xs */}
                  </div>
                  {/* Badges row for mobile: move below on screens <450px */}
                  <div className="flex flex-wrap gap-2 mt-2
                    w-full
                    sm:w-auto
                    2xl:hidden
                  ">
                    <span className='flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-2xl font-bold shadow-2xl text-xs'>
                      <Star className='w-4 h-4 fill-current mr-1' />
                      {movie.rating || '8.5'}
                    </span>
                    {movie.studio && (
                      <span className='flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1 rounded-2xl font-bold shadow-2xl text-xs'>
                        {movie.studio}
                      </span>
                    )}
                  </div>
                  <div className='flex flex-wrap items-center gap-4 sm:gap-6 text-gray-300'>
                    <div className='flex items-center space-x-2 text-xs sm:text-base'>
                      <Clock className='w-4 h-4 sm:w-5 sm:h-5 text-blue-400' />
                      <span>{movie.duration}</span>
                    </div>
                    <div className='flex items-center space-x-2 text-xs sm:text-base'>
                      <Globe className='w-4 h-4 sm:w-5 sm:h-5 text-purple-400' />
                      <span>English</span>
                    </div>
                    <div className='flex items-center space-x-2 text-xs sm:text-base'>
                      <Award className='w-4 h-4 sm:w-5 sm:h-5 text-yellow-400' />
                      <span>IMDb Choice</span>
                    </div>
                  </div>
                  <div className='flex flex-wrap gap-2 sm:gap-3'>
                    {movie.genre?.split(' | ').map((genre, index) => (
                      <span
                        key={index}
                        className='bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 text-gray-200 px-3 sm:px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium hover:from-red-600 hover:to-red-700 hover:text-white transition-all duration-300 cursor-pointer'
                      >
                        {genre}
                      </span>
                    ))}
                  </div>
                  <p className='text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl md:max-w-3xl'>
                    {movie.description}
                  </p>
                  <div className='flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4'>
                    <button
                      onClick={handleBookTickets}
                      className='group relative bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg overflow-hidden transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-red-500/25 w-full sm:w-auto'
                    >
                      <div className='absolute inset-0 bg-gradient-to-r from-red-700 via-red-800 to-red-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div className='relative flex items-center space-x-2 sm:space-x-3 justify-center'>
                        <Ticket className='w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-12 transition-transform duration-300' />
                        <span>Book Now</span>
                        <Zap className='w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 transition-transform duration-300' />
                      </div>
                    </button>
                    <button
                      onClick={openTrailer}
                      className='group relative border-2 border-white/30 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-bold text-base sm:text-lg backdrop-blur-sm overflow-hidden transition-all duration-300 transform hover:scale-105 hover:border-white/60 w-full sm:w-auto'
                    >
                      <div className='absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                      <div className='relative flex items-center space-x-2 sm:space-x-3 justify-center'>
                        <Play className='w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300' />
                        <span>Trailer</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Down arrow */}
          <div className='absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce'>
            <ChevronDown className='w-6 h-6 sm:w-8 sm:h-8 text-white/60' />
          </div>
        </div>
        {/* Stats and Showtimes */}
        <div className='relative bg-gradient-to-b from-gray-950 via-gray-900 to-black py-10 sm:py-16 md:py-20'>
          <div className='absolute inset-0 opacity-5'>
            <div className='absolute inset-0' style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, red 2px, transparent 2px),
                               radial-gradient(circle at 75% 75%, blue 1px, transparent 1px)`,
              backgroundSize: '100px 100px'
            }}></div>
          </div>
          <div className='relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-10 lg:px-24'>
            {/* Stat Cards */}
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-10 md:mb-16'>
              {[
                { label: 'Rating', value: `${movie.rating || '8.5'}/10` },
                { label: 'Year', value: movie.year },
                { label: 'Duration', value: movie.duration },
                { label: 'Studio', value: movie.studio }
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-[#111827] border border-gray-500/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center"
                >
                  <div className="text-white text-xl font-bold mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12'>
              {/* Showtimes only */}
              <div className='lg:col-span-2 space-y-6 sm:space-y-8'>
                <h2 className='text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent'>
                  Showtimes Today
                </h2>
                <div className='space-y-3 sm:space-y-4'>
                  {sortShowtimes(movie.showtimes).map((show, index) => (
                    <div
                      key={index}
                      className="w-full bg-[#111827] border border-gray-500/40 rounded-2xl px-6 py-4 mb-4 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-lg font-bold text-white sm:text-2xl">{show.time}</div>
                        <div className="text-gray-400 text-sm sm:text-base">
                          {typeof show.available === 'number'
                            ? `${show.available} available`
                            : (show.seats || 'Available')}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-green-400 font-bold text-lg sm:text-xl">
                          {formatPrice(show.price)}
                        </div>
                        <div className="text-gray-400 text-xs sm:text-sm">per ticket</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {isBookingOpen && (
        <BookingModal
          show={isBookingOpen}
          onClose={() => setIsBookingOpen(false)}
          selectedMovie={movie._id}
        />
      )}

      {/* Trailer Modal */}
      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={closeTrailer}
        movieTitle={movie.title}
        trailerUrl={movie.trailer}
      />
    </>
  )
}

export default MovieDetails