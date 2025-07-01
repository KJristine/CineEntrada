import React, { useState, useEffect } from 'react'
import { MapPin, Star, Clock, Phone, Navigation, Ticket, Calendar, Users } from 'lucide-react'
import { theatersData } from '../data/theatersData'
import BookingModal from '../components/bookings/BookingModal'

const TheatersSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [selectedTheater, setSelectedTheater] = useState(null)
  const [bookingOpen, setBookingOpen] = useState(false)

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const section = document.getElementById('theaters')
    if (section) {
      observer.observe(section)
    }

    return () => {
      if (section) {
        observer.unobserve(section)
      }
    }
  }, [])

  return (
    <section id="theaters" className='relative bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white py-20 pt-32 overflow-hidden'>
      
      {/* Background Elements */}
      <div className='absolute inset-0 opacity-5'>
        <div className='absolute top-10 right-20 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute bottom-10 left-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500 rounded-full blur-3xl animate-pulse'></div>
      </div>

      <div className='relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16'>
        
        {/* Header Section */}
        <div className={`mb-16 text-center transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          
          {/* Premium Badge */}
          <div className='inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600/20 to-purple-700/20 border border-blue-500/30 backdrop-blur-sm px-6 py-3 rounded-full mb-6'>
            <MapPin className='w-4 h-4 text-blue-400' />
            <span className='text-blue-300 font-semibold tracking-wide text-sm'>FIND THEATERS</span>
            <Navigation className='w-4 h-4 text-blue-400' />
          </div>

          {/* Main Title */}
          <h2 className='text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight'>
            <span className='bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent'>
              Premium
            </span>
            <br />
            <span className='bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent'>
              Theaters
            </span>
          </h2>

          {/* Description */}
          <div className='max-w-3xl mx-auto space-y-4'>
            <p className='text-gray-300 text-lg leading-relaxed'>
              Experience world-class cinema in the Philippines' finest theaters. 
              <span className='text-blue-400 font-semibold'> Premium comfort</span> and cutting-edge technology.
            </p>
            
            {/* Stats */}
            <div className='flex items-center justify-center space-x-6 text-gray-400 mt-6'>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>{theatersData.length}</div>
                <div className='text-xs uppercase tracking-wider'>Theaters</div>
              </div>
              <div className='w-px h-8 bg-gray-600'></div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>IMAX</div>
                <div className='text-xs uppercase tracking-wider'>Available</div>
              </div>
              <div className='w-px h-8 bg-gray-600'></div>
              <div className='text-center'>
                <div className='text-2xl font-bold text-white'>4DX</div>
                <div className='text-xs uppercase tracking-wider'>Experience</div>
              </div>
            </div>
          </div>
        </div>

        {/* Theaters Grid */}
        <div className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          {theatersData.map((theater, index) => (
            <div
              key={theater.id}
              className='group bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-3xl overflow-hidden hover:border-blue-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10'
            >
              {/* Theater Image */}
              <div className='relative h-64 overflow-hidden'>
                <img
                  src={theater.image}
                  alt={theater.name}
                  className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1543536448-d209d2d13a1c?w=800&h=600&fit=crop&auto=format&q=80'
                  }}
                />
                
                {/* Overlay */}
                <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent'></div>
                
                {/* Rating Badge */}
                <div className='absolute top-4 right-4'>
                  <div className='flex items-center space-x-1 bg-black/70 backdrop-blur-sm px-3 py-2 rounded-full'>
                    <Star className='w-4 h-4 text-yellow-400' fill='currentColor' />
                    <span className='text-white font-bold'>{theater.rating}</span>
                  </div>
                </div>

                {/* Distance Badge */}
                <div className='absolute top-4 left-4'>
                  <div className='flex items-center space-x-1 bg-blue-600/80 backdrop-blur-sm px-3 py-2 rounded-full'>
                    <MapPin className='w-4 h-4 text-white' />
                    <span className='text-white font-bold text-sm'>{theater.distance}</span>
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className='absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <button
                    className='bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full transform hover:scale-110 transition-all duration-300'
                    onClick={() => {
                      setSelectedTheater(theater)
                      setBookingOpen(true)
                    }}
                  >
                    <Ticket className='w-5 h-5' />
                  </button>
                </div>
              </div>

              {/* Theater Info */}
              <div className='p-6 space-y-4'>
                
                {/* Theater Name & Address */}
                <div>
                  <h3 className='text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors'>
                    {theater.name}
                  </h3>
                  <p className='text-gray-400 flex items-center space-x-2 text-sm'>
                    <MapPin className='w-4 h-4' />
                    <span>{theater.address}</span>
                  </p>
                </div>

                {/* Amenities */}
                <div className='flex flex-wrap gap-2'>
                  {theater.amenities.slice(0, 3).map((amenity, idx) => (
                    <span
                      key={idx}
                      className='bg-gray-700/50 text-gray-300 px-3 py-1 text-xs rounded-full border border-gray-600/50'
                    >
                      {amenity}
                    </span>
                  ))}
                  {theater.amenities.length > 3 && (
                    <span className='text-blue-400 text-xs px-2 py-1'>
                      +{theater.amenities.length - 3} more
                    </span>
                  )}
                </div>

                {/* Theater Stats */}
                <div className='grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50'>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-white'>{theater.totalSeats}</div>
                    <div className='text-xs text-gray-400 uppercase tracking-wider'>Seats</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-green-400'>{theater.ticketPrice}</div>
                    <div className='text-xs text-gray-400 uppercase tracking-wider'>From</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-lg font-bold text-blue-400'>{theater.showtimes.length}</div>
                    <div className='text-xs text-gray-400 uppercase tracking-wider'>Shows</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className='flex space-x-3 pt-4'>
                  <button
                    className='flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2'
                    onClick={() => {
                      setSelectedTheater(theater)
                      setBookingOpen(true)
                    }}
                  >
                    <Ticket className='w-4 h-4' />
                    <span>Book Tickets</span>
                  </button>
                  
                  <a
                    href={`tel:${theater.phone || ''}`}
                    className='px-4 py-3 border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center'
                    title="Call"
                  >
                    <Phone className='w-4 h-4' />
                  </a>
                  
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(theater.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className='px-4 py-3 border border-gray-600 hover:border-blue-500 text-gray-300 hover:text-blue-400 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center'
                    title="Directions"
                  >
                    <Navigation className='w-4 h-4' />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
        <button
          className='group inline-flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105'
          onClick={() => {
            window.open('https://www.google.com/maps/search/cinema+near+me', '_blank', 'noopener,noreferrer')
          }}
        >
          <MapPin className='w-6 h-6 group-hover:scale-110 transition-transform duration-300' />
          <span>Find More Theaters</span>
          <Navigation className='w-5 h-5 group-hover:scale-110 transition-transform duration-300' />
        </button>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingOpen && selectedTheater && (
      <BookingModal
        show={bookingOpen}
        onClose={() => setBookingOpen(false)}
        selectedTheater={selectedTheater.name}
      />
      )}
    </section>
  )
}

export default TheatersSection