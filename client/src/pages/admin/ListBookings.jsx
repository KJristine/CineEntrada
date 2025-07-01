import React, { useEffect, useState } from 'react'
import { Calendar, Clock, User, MapPin, CreditCard } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const statusColors = {
  confirmed: 'bg-gradient-to-r from-green-500 to-green-700 text-white border-green-400 shadow-green-500/30',
  pending: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900 border-yellow-400 shadow-yellow-400/30',
  cancelled: 'bg-gradient-to-r from-red-500 to-pink-600 text-white border-red-400 shadow-red-500/30',
}

const ListBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(`${API_URL}/api/bookings`)
        const data = await res.json()
        setBookings(Array.isArray(data) ? data : [])
      } catch {
        setBookings([])
      } finally {
        setLoading(false)
      }
    }
    fetchBookings()
  }, [])

  // Ethereal animated background effect (same as Dashboard)
  useEffect(() => {
    const canvas = document.getElementById('ethereal-bg-admin-bookings')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationId

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: Math.random() * 0.5 + 0.2,
      hue: Math.random() * 60 + 280,
    }))

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(particle => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`
        ctx.shadowBlur = 20
        ctx.shadowColor = `hsla(${particle.hue}, 70%, 60%, 0.8)`
        ctx.fill()
      })
      animationId = requestAnimationFrame(animate)
    }
    animate()
    window.addEventListener('resize', resizeCanvas)
    return () => {
      animationId && cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // Helper to render status with custom styling
  const renderStatus = (status) => {
    const normalizedStatus = status || 'confirmed'
    const color = statusColors[normalizedStatus] || statusColors.confirmed
    let label = normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1)
    return (
      <span
        className={`w-full block font-bold text-xs px-4 py-1 rounded-full border ${color} uppercase tracking-wide shadow-lg drop-shadow-glow`}
        style={{ minWidth: 90, textAlign: 'center', letterSpacing: 1, boxShadow: '0 0 16px 2px rgba(236,72,153,0.18)' }}
      >
        {label}
      </span>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 relative overflow-hidden">
      {/* Ethereal animated background */}
      <canvas
        id="ethereal-bg-admin-bookings"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'blur(1.5px)', zIndex: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-pink-900/30 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
      
      <main
        className="flex-1 flex flex-col items-center px-2 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-10 relative z-10"
        style={{
          marginLeft: 0,
          width: '100vw',
          minHeight: '100vh'
        }}
      >
        {/* Spacer for navbar on mobile/tablet */}
        <div className="block lg:hidden h-14 sm:h-16 md:h-20" />
        <div className="xl:ml-64 xl:w-[calc(100vw-16rem)] w-full">
          <div className="flex flex-col items-center w-full h-full mt-1 sm:mt-2 md:mt-0 lg:mt-12">
            {/* Header */}
            <div className="w-full max-w-7xl mb-4 sm:mb-6 md:mb-8 flex justify-center">
              <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl px-4 sm:px-8 py-4 sm:py-7 w-full justify-center">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-pink-200 text-center xl:text-left w-full leading-tight animate-glow" style={{ letterSpacing: '-1px' }}>
                  CineEntrada Booking List
                </h1>
              </div>
            </div>
            
            <section className="w-full max-w-7xl flex flex-col items-center">
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-3 sm:mb-4 w-full">
                <h2 className="text-lg md:text-xl font-bold text-pink-300 text-left w-full sm:w-auto mb-2 sm:mb-0 drop-shadow-glow">
                  All Bookings
                </h2>
              </div>
              
              {/* Table for large screens */}
              <div className="hidden lg:block bg-white/10 rounded-xl shadow-2xl overflow-x-auto w-full">
                <table className="w-full divide-y divide-pink-400/20">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-center text-xs font-bold text-pink-200 uppercase tracking-wider">#</th>
                      {/* User column removed */}
                      <th className="px-4 py-3 text-center text-xs font-bold text-pink-200 uppercase tracking-wider">Movie</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-pink-200 uppercase tracking-wider">Showtime</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-pink-200 uppercase tracking-wider">Seats</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-pink-200 uppercase tracking-wider">Booking Date</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-pink-200 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-pink-200 uppercase tracking-wider">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-pink-200 text-lg animate-pulse">Loading bookings...</td>
                      </tr>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-10 text-pink-200 text-lg">No bookings found.</td>
                      </tr>
                    ) : (
                      bookings.map((booking, idx) => (
                        <tr
                          key={booking._id}
                          className={idx % 2 === 0 ? 'bg-white/5' : 'bg-pink-400/5'}
                        >
                          <td className="px-4 py-3 text-center align-middle text-pink-100 font-bold">{idx + 1}</td>
                          {/* User cell removed */}
                          <td className="px-4 py-3 text-center align-middle">
                            <span className="font-semibold text-white">{booking.movie?.title || booking.movieTitle || 'N/A'}</span>
                          </td>
                          <td className="px-4 py-3 text-center align-middle">
                            <div className="flex flex-col items-center gap-1">
                              <span className="flex items-center gap-1 text-pink-200 text-xs">
                                <Calendar className="w-4 h-4" />
                                {booking.date || 'N/A'}
                              </span>
                              <span className="flex items-center gap-1 text-pink-200 text-xs">
                                <Clock className="w-4 h-4" />
                                {booking.time || 'N/A'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center align-middle">
                            <div className="flex flex-wrap gap-1 justify-center">
                              {booking.seats?.map((seat, i) => (
                                <span key={i} className="bg-pink-600/30 text-pink-100 px-2 py-1 rounded text-xs font-semibold border border-pink-400/30">
                                  {seat}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center align-middle text-pink-200 text-xs">
                            {new Date(booking.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-center align-middle">
                            {renderStatus(booking.status)}
                          </td>
                          <td className="px-4 py-3 text-center align-middle font-bold text-green-400">
                            {typeof booking.total === 'number'
                              ? `₱${Number(booking.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : booking.price && booking.seats?.length
                              ? `₱${Number(booking.price * booking.seats.length).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : booking.price
                              ? `₱${Number(booking.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : '₱0.00'}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile/Tablet Card View (visible on small to medium screens) - Ultra enhanced */}
              <div className="lg:hidden w-full space-y-6">
                {loading ? (
                  <div className="text-center py-10 text-pink-200 text-lg animate-pulse bg-white/10 rounded-2xl shadow-xl">Loading bookings...</div>
                ) : bookings.length === 0 ? (
                  <div className="text-center py-10 text-pink-200 text-lg bg-white/10 rounded-2xl shadow-xl">No bookings found.</div>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-slate-900/90 rounded-3xl border border-pink-400/10 shadow-2xl p-5 flex flex-col gap-4 transition-all duration-200 hover:scale-[1.015] hover:shadow-pink-400/20 group"
                    >
                      {/* Movie Title */}
                      <div className="flex items-center gap-2 mb-1 mt-2">
                        <span className="font-extrabold text-white text-lg sm:text-xl leading-tight drop-shadow-glow">
                          {booking.movie?.title || booking.movieTitle || 'N/A'}
                        </span>
                      </div>
                      {/* Info Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        {/* Showtime */}
                        <div className="flex flex-col gap-1 bg-white/5 rounded-xl p-3 border border-white/10 shadow-inner">
                          <div className="flex items-center gap-1 text-pink-100 text-xs font-semibold mb-1">
                            <Calendar className="w-4 h-4" />
                            Showtime
                          </div>
                          <div className="text-white font-bold text-xs">{booking.date || 'N/A'}</div>
                          <div className="flex items-center gap-1 text-pink-200 text-xs">
                            <Clock className="w-4 h-4" />
                            {booking.time || 'N/A'}
                          </div>
                        </div>
                        {/* Seats */}
                        <div className="flex flex-col gap-1 bg-white/5 rounded-xl p-3 border border-white/10 shadow-inner">
                          <div className="flex items-center gap-1 text-pink-100 text-xs font-semibold mb-1">
                            <MapPin className="w-4 h-4" />
                            Seats
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {booking.seats?.map((seat, i) => (
                              <span key={i} className="bg-gradient-to-r from-pink-600/60 to-purple-600/60 text-white px-2 py-1 rounded-md text-xs font-bold border border-pink-400/40 shadow">
                                {seat}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* Booked Date */}
                        <div className="flex flex-col gap-1 bg-white/5 rounded-xl p-3 border border-white/10 shadow-inner">
                          <span className="text-pink-200 text-xs font-semibold">Booked</span>
                          <span className="text-pink-100 text-xs font-bold">{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>
                        {/* Booked Time */}
                        <div className="flex flex-col gap-1 bg-white/5 rounded-xl p-3 border border-white/10 shadow-inner">
                          <span className="text-pink-200 text-xs font-semibold">Time</span>
                          <span className="text-pink-100 text-xs font-bold">{new Date(booking.createdAt).toLocaleTimeString()}</span>
                        </div>
                        {/* Total */}
                        <div className="col-span-2 flex items-center justify-between bg-gradient-to-r from-green-900/60 to-green-700/40 rounded-xl p-3 border border-green-400/10 shadow-inner mt-1">
                          <span className="flex items-center gap-2 text-green-200 text-sm font-semibold">
                            <CreditCard className="w-5 h-5" />
                            Total
                          </span>
                          <span className="font-extrabold text-green-400 text-lg sm:text-xl drop-shadow-glow">
                            {typeof booking.total === 'number'
                              ? `₱${Number(booking.total).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : booking.price && booking.seats?.length
                              ? `₱${Number(booking.price * booking.seats.length).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : booking.price
                              ? `₱${Number(booking.price).toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                              : '₱0.00'}
                          </span>
                        </div>
                      </div>
                      {/* Status at the bottom, full width */}
                      <div className="w-full flex justify-center mt-3">
                        {renderStatus(booking.status)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        </div>
        
<style>{`
          .drop-shadow-glow {
            filter: drop-shadow(0 0 8px #d946ef88);
          }
          .animate-glow {
            animation: glowText 2.5s ease-in-out infinite alternate;
          }
          @keyframes glowText {
            0% { text-shadow: 0 0 12px #f472b6, 0 0 32px #a78bfa; }
            100% { text-shadow: 0 0 32px #f472b6, 0 0 64px #a78bfa; }
          }
          /* Enhanced mobile scrolling */
          @media (max-width: 1024px) {
            .space-y-3 > * + * {
              margin-top: 0.75rem;
            }
            .space-y-4 > * + * {
              margin-top: 1rem;
            }
          }
          /* Smooth transitions for interactive elements */
          .transform {
            transition: all 0.2s ease-in-out;
          }
          /* Better text rendering on mobile */
          @media (max-width: 640px) {
            * {
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
          }
          /* Responsive table fit for 1280x800 screens (Nest Hub Max, etc) */
          @media (min-width: 1200px) and (max-width: 1300px) {
            .max-w-7xl {
              max-width: 950px !important;
              margin-left: auto !important;
              margin-right: auto !important;
            }
            table.w-full th,
            table.w-full td {
              padding-left: 0.5rem !important;
              padding-right: 0.5rem !important;
              font-size: 0.97rem !important;
            }
            table.w-full th {
              font-size: 0.85rem !important;
            }
            .overflow-x-auto {
              overflow-x: auto !important;
            }
          }
        `}</style>
      </main>
    </div>
  )
}

export default ListBookings