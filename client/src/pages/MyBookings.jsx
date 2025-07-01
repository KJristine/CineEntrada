import React, { useEffect, useState } from 'react'
import { Ticket, Calendar, Clock, MapPin, Users, Sparkles, X, CheckCircle } from 'lucide-react'
import { moviesData } from '../data/moviesData'
import { theatersData } from '../data/theatersData'
import Barcode from 'react-barcode'
import '../index.css' // Import global styles including animation

const fetchBookings = async () => {
  const res = await fetch('/api/bookings')
  return res.ok ? res.json() : []
}

const getMovie = (title) => moviesData.find(m => m.title === title)
const getTheater = (name) => theatersData.find(t => t.name === name)

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showBarcode, setShowBarcode] = useState(null)
  const [sortBy, setSortBy] = useState('date-desc')
  const [showCancelModal, setShowCancelModal] = useState({ show: false, booking: null })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    fetchBookings().then(data => {
      setBookings(data)
      setLoading(false)
    })
  }, [])

  const sortedBookings = [...bookings].sort((a, b) => {
    if (sortBy === 'date-desc') {
      return new Date(b.createdAt) - new Date(a.createdAt)
    }
    if (sortBy === 'date-asc') {
      return new Date(a.createdAt) - new Date(b.createdAt)
    }
    // For sorting by movie, handle both string and object
    if (sortBy === 'movie') {
      const aTitle = typeof a.movie === 'object' ? a.movie?.title : a.movie
      const bTitle = typeof b.movie === 'object' ? b.movie?.title : b.movie
      return (aTitle || '').localeCompare(bTitle || '')
    }
    if (sortBy === 'theater') {
      return a.theater.localeCompare(b.theater)
    }
    return 0
  })

  // Cancel booking handler (PATCH: mark as cancelled)
  const handleCancelBooking = async (bookingId) => {
    setShowCancelModal({ show: false, booking: null })
    const res = await fetch(`/api/bookings/${bookingId}/cancel`, { method: 'PATCH' })
    if (res.ok) {
      setBookings(bookings => bookings.map(b =>
        b._id === bookingId ? { ...b, status: 'cancelled' } : b
      ))
      setShowSuccessModal(true)
    } else {
      alert('Failed to cancel booking.')
    }
  }

  const isCancelable = (b) => {
    if (b.status === 'cancelled') return false
    if (!b.date || !b.time) return false
    const showDateTime = new Date(`${b.date} ${b.time}`)
    const now = new Date()
    return showDateTime.getTime() - now.getTime() > 2 * 60 * 60 * 1000
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-32 pb-20 overflow-hidden">
      {/* Ethereal Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-96 h-96 bg-pink-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-gradient-radial from-red-600/30 via-transparent to-transparent rounded-full blur-2xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-2 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
            Your Booked <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent">Tickets</span>
          </h2>
        </div>

        {/* Sort Dropdown */}
        <div className="flex justify-end mb-4">
          <select
            className="bg-gray-900 border border-pink-500/30 text-pink-200 px-4 py-2 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-pink-500 transition"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="movie">Movie Title (A-Z)</option>
            <option value="theater">Theater (A-Z)</option>
          </select>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center h-40">
            <span className="text-pink-400 text-xl animate-pulse">Loading your tickets...</span>
          </div>
        )}

        {/* No Bookings */}
        {!loading && bookings.length === 0 && (
          <div className="flex flex-col items-center justify-center h-60">
            <Ticket className="w-16 h-16 text-pink-500 mb-4 animate-bounce" />
            <div className="text-2xl font-bold text-pink-200 mb-2">No tickets booked yet!</div>
            <div className="text-gray-400 mb-4">Book your first movie and your tickets will appear here.</div>
            <a
              href="/"
              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-pink-500/30 transition-all duration-300"
            >
              Book Now
            </a>
          </div>
        )}

        {/* Bookings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {sortedBookings.map((b, i) => {
            // Use populated movie object if available, fallback to static data
            const movie = typeof b.movie === 'object' ? b.movie : getMovie(b.movie)
            const theater = getTheater(b.theater)
            const isCancelled = b.status === 'cancelled'
            return (
              <div
                key={b._id || i}
                className={`w-full max-w-md mx-auto bg-gradient-to-br from-gray-900/80 to-gray-950/90 border-2 border-pink-500/30 rounded-2xl shadow-xl flex flex-col overflow-hidden mb-8 ${isCancelled ? 'opacity-60 grayscale' : ''}`}
              >
                {/* Poster */}
                <div className="w-full aspect-video bg-black flex items-center justify-center relative">
                  <img
                    src={movie?.poster || movie?.image || '/fallback.jpg'}
                    alt={movie?.title || (typeof b.movie === 'string' ? b.movie : '')}
                    className="w-full h-56 object-cover rounded-t-2xl"
                  />
                  {isCancelled && (
                    <span className="absolute top-3 right-3 bg-gray-800/90 text-red-400 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-red-400/30 shadow-lg z-10">
                      Cancelled
                    </span>
                  )}
                </div>
                {/* Details */}
                <div className="flex-1 flex flex-col justify-between px-8 py-7">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow">
                        {theater?.name || b.theater}
                      </span>
                      <span className="bg-black/40 text-pink-200 px-2 py-1 rounded text-xs font-semibold">
                        {movie?.year || ''}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {movie?.title || (typeof b.movie === 'string' ? b.movie : '')}
                    </h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {(movie?.genre ? movie.genre.split(' | ') : []).map((g, idx) => (
                        <span key={idx} className="bg-gray-800 text-pink-200 px-2 py-1 text-xs rounded">
                          {g}
                        </span>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-3 text-gray-300 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-pink-400" />
                        <span>{b.date}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4 text-purple-400" />
                        <span>{b.time}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                      <MapPin className="w-4 h-4 text-pink-300" />
                      <span>{theater?.address || ''}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mb-3">
                      <Users className="w-4 h-4 text-pink-200" />
                      <span>{b.seats.length} seat{b.seats.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {b.seats.map((seat, idx) => (
                        <span key={idx} className="bg-pink-600/30 text-pink-100 px-2 py-1 rounded text-xs font-semibold border border-pink-400/30">
                          {seat}
                        </span>
                      ))}
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      Booked on {new Date(b.createdAt).toLocaleString()}
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 flex-nowrap">
                    <button
                      className="flex-1 min-w-0 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow hover:scale-105 transition-transform truncate"
                      onClick={() => setShowBarcode(i)}
                      disabled={isCancelled}
                      title={isCancelled ? "Booking is cancelled" : "Show E-Ticket"}
                    >
                      E-Ticket
                    </button>
                    {isCancelled ? (
                      <span
                        className="flex-1 min-w-0 bg-gray-700 text-red-400 px-4 py-2 rounded-full font-bold text-sm border border-red-400/30 select-none cursor-not-allowed text-center truncate"
                        title="This booking has been cancelled"
                      >
                        Cancelled
                      </span>
                    ) : isCancelable(b) ? (
                      <button
                        className="flex-1 min-w-0 bg-gradient-to-r from-red-600 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow hover:scale-105 transition-transform truncate"
                        onClick={() => setShowCancelModal({ show: true, booking: b })}
                      >
                        Cancel Booking
                      </button>
                    ) : (
                      <span
                        className="flex-1 min-w-0 bg-gray-700 text-gray-400 px-4 py-2 rounded-full font-bold text-sm border border-gray-500/30 select-none cursor-not-allowed text-center truncate"
                        title="Cannot cancel within 2 hours of showtime"
                      >
                        Not Cancelable
                      </span>
                    )}
                  </div>
                </div>
                {/* Barcode Modal */}
                {showBarcode === i && !isCancelled && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/30 rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
                      <button
                        className="absolute top-4 right-4 text-pink-400 hover:text-pink-200 transition"
                        onClick={() => setShowBarcode(null)}
                        aria-label="Close"
                      >
                        <X className="w-6 h-6" />
                      </button>
                      <h4 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                        E-Ticket
                      </h4>
                      <div className="text-center text-pink-200 mb-2 font-semibold">
                        {movie?.title || (typeof b.movie === 'string' ? b.movie : '')}
                      </div>
                      <div className="text-center text-sm text-gray-400 mb-2">
                        {theater?.name || b.theater} &middot; {b.date} &middot; {b.time}
                      </div>
                      <div className="flex flex-col items-center my-6">
                        <Barcode
                          value={b._id?.slice(-8) || 'MOVIEBYTE'}
                          width={2}
                          height={60}
                          fontSize={16}
                          marginTop={8}
                          displayValue
                          background="#fff"
                          lineColor="#222"
                        />
                      </div>
                      <div className="text-center text-pink-300 font-bold mt-2">
                        Show this code at the entrance to scan your ticket!
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {b.seats.map((seat, idx) => (
                          <span key={idx} className="bg-pink-600/30 text-pink-100 px-2 py-1 rounded text-xs font-semibold border border-pink-400/30">
                            {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/30 rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn">
            <button
              className="absolute top-4 right-4 text-pink-400 hover:text-pink-200 transition"
              onClick={() => setShowCancelModal({ show: false, booking: null })}
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h4 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-red-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Cancel Booking
            </h4>
            <div className="text-center text-pink-200 mb-4 font-semibold">
              Are you sure you want to cancel your booking for <br />
              <span className="text-white">
                {typeof showCancelModal.booking?.movie === 'object'
                  ? showCancelModal.booking?.movie?.title
                  : showCancelModal.booking?.movie}
              </span>?
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <button
                className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-transform"
                onClick={() => setShowCancelModal({ show: false, booking: null })}
              >
                No, Go Back
              </button>
              <button
                className="bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-2 rounded-full font-bold shadow hover:scale-105 transition-transform"
                onClick={() => handleCancelBooking(showCancelModal.booking._id)}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/30 rounded-3xl shadow-2xl p-8 max-w-md w-full relative animate-fadeIn flex flex-col items-center">
            <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            <h4 className="text-2xl font-bold text-center mb-2 bg-gradient-to-r from-green-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Booking Cancelled!
            </h4>
            <div className="text-center text-pink-200 mb-4 font-semibold">
              Your booking has been successfully cancelled.
            </div>
            <button
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-2 rounded-full font-bold shadow hover:scale-105 transition-transform"
              onClick={() => setShowSuccessModal(false)}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

export default MyBookings