import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Film, Users, Ticket, DollarSign, ChevronRight } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const statCards = [
  {
    label: 'Total Bookings',
    icon: <Ticket className="w-6 h-6 text-pink-400 drop-shadow-glow" />,
    color: 'from-pink-500/60 via-pink-700/60 to-pink-900/60',
    valueKey: 'bookings',
    text: 'text-pink-200'
  },
  {
    label: 'Total Revenue',
    icon: <DollarSign className="w-6 h-6 text-green-400 drop-shadow-glow" />,
    color: 'from-green-500/60 via-green-700/60 to-green-900/60',
    valueKey: 'revenue',
    text: 'text-green-200'
  },
  {
    label: 'Active Movies',
    icon: <Film className="w-6 h-6 text-blue-400 drop-shadow-glow" />,
    color: 'from-blue-500/60 via-blue-700/60 to-blue-900/60',
    valueKey: 'movies',
    text: 'text-blue-200'
  },
  {
    label: 'Total Users',
    icon: <Users className="w-6 h-6 text-purple-400 drop-shadow-glow" />,
    color: 'from-purple-500/60 via-purple-700/60 to-purple-900/60',
    valueKey: 'users',
    text: 'text-purple-200'
  }
]

const Dashboard = () => {
  const [stats, setStats] = useState({
    bookings: 0,
    revenue: 0,
    movies: 0,
    users: 0
  })
  const [loading, setLoading] = useState(true)
  const [movies, setMovies] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const bookingsRes = await fetch(`${API_URL}/api/bookings`)
        const bookings = await bookingsRes.json()
        const moviesRes = await fetch(`${API_URL}/api/movies`)
        const moviesData = await moviesRes.json()
        // Only count as active if isActive && (no scheduledAt or scheduledAt <= now)
        const now = new Date()
        const trulyActiveMovies = moviesData.filter(
          m =>
            m.isActive &&
            (!m.scheduledAt || new Date(m.scheduledAt) <= now)
        )
        setMovies(trulyActiveMovies)
        let usersCount = 0
        try {
          const usersRes = await fetch(`${API_URL}/api/users/count`)
          const usersData = await usersRes.json()
          usersCount = usersData.count || 0
        } catch {
          usersCount = 0
        }
        const revenue = bookings.filter(b => b.status !== 'cancelled').reduce((sum, b) => sum + (b.seats.length * (b.price || 0)), 0)
        setStats({
          bookings: bookings.length,
          revenue,
          movies: trulyActiveMovies.length,
          users: usersCount
        })
      } catch {
        setStats({
          bookings: 0,
          revenue: 0,
          movies: 0,
          users: 0
        })
        setMovies([])
      }
      setLoading(false)
    }
    fetchStats()
  }, [])

  // Ethereal animated background effect
  useEffect(() => {
    const canvas = document.getElementById('ethereal-bg-admin')
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
      hue: Math.random() * 60 + 280
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
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [])

  // --- MAIN RETURN ---
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Ethereal animated background */}
      <canvas
        id="ethereal-bg-admin"
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'blur(1px)', zIndex: 0 }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />
      {/* Main Content */}
      <main
        className="flex-1 flex flex-col items-center px-2 sm:px-4 md:px-6 py-6 md:py-10 relative z-10 lg:ml-64 pt-20 sm:pt-24"
        style={{
          width: '100%',
          minHeight: '100vh'
        }}
      >
        <div className="flex flex-col items-center w-full h-full mt-2 md:mt-12">
          {/* Header */}
          <div className="w-full max-w-7xl mb-6 md:mb-8 flex justify-center">
            <div className="flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg px-4 md:px-8 py-5 md:py-7 w-full justify-center">
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-pink-200 w-full text-center lg:text-left" style={{ letterSpacing: '-1px' }}>
                CineEntrada Administrator Dashboard Panel
              </h1>
            </div>
          </div>
          {/* Stats Cards */}
          <section className="w-full max-w-7xl mb-6 md:mb-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5">
            {statCards.map(card => (
              <div
                key={card.label}
                className={`flex flex-row items-center gap-3 md:gap-4 ${card.color} rounded-xl shadow border border-white/10 px-4 md:px-6 py-6 md:py-8 min-w-0 hover:scale-[1.03] transition-all duration-200 bg-white/10 backdrop-blur-xl`}
                style={{
                  boxShadow: '0 2px 12px 0 rgba(72,0,139,0.10), 0 1.5px 0 0 #d946ef22',
                  minHeight: '90px',
                  height: 'auto'
                }}
              >
                <div className="flex items-center justify-center w-10 h-10 md:w-14 md:h-14 rounded-lg bg-white/20">
                  {card.icon}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className={`text-xl md:text-2xl font-bold ${card.text} truncate`}>
                    {card.valueKey === 'revenue'
                      ? `₱${stats[card.valueKey].toLocaleString()}`
                      : stats[card.valueKey]}
                  </span>
                  <span className="text-xs md:text-sm text-white/70 font-medium tracking-wide truncate mt-1">{card.label}</span>
                </div>
              </div>
            ))}
          </section>
          {/* Active Movies Table */}
          <section className="w-full max-w-7xl flex flex-col items-center">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-3 md:mb-4 w-full gap-2">
              <h2 className="text-lg md:text-xl font-bold text-pink-300 text-left w-full lg:w-auto">Active Movies</h2>
              <Link
                to="/admin/list-movies"
                className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm md:text-base shadow hover:scale-105 transition animate-glow self-start mb-4 lg:mb-0"
              >
                <Film className="w-5 h-5" />
                View All
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="bg-white/10 rounded-xl shadow overflow-x-auto w-full px-1 md:px-2">
              {/* Table for xl and up only */}
              <table className="hidden xl:table min-w-full divide-y divide-pink-400/20 text-xs md:text-sm">
                <thead>
                  <tr>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-pink-200 uppercase tracking-wider whitespace-normal break-words">Poster</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-pink-200 uppercase tracking-wider whitespace-normal break-words">Title</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-pink-200 uppercase tracking-wider whitespace-normal break-words">Genre</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-pink-200 uppercase tracking-wider whitespace-normal break-words">Year</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-pink-200 uppercase tracking-wider whitespace-normal break-words">Studio</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-pink-200 uppercase tracking-wider whitespace-normal break-words">Rating</th>
                    <th className="px-2 md:px-4 py-2 md:py-3 text-center font-bold text-pink-200 uppercase tracking-wider whitespace-normal break-words">Showtimes</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 md:py-10 text-pink-200 text-base md:text-lg animate-pulse">Loading movies...</td>
                    </tr>
                  ) : movies.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-8 md:py-10 text-pink-200 text-base md:text-lg">No movies found.</td>
                    </tr>
                  ) : (
                    movies.slice(0, 8).map(movie => (
                      <tr key={movie._id}>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-center align-middle">
                          <img src={movie.poster} alt={movie.title} className="w-8 h-12 md:w-10 md:h-14 object-cover rounded shadow mx-auto" />
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 font-semibold text-white whitespace-normal break-words text-center align-middle">
                          {movie.title}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-pink-200 text-xs md:text-sm whitespace-normal break-words text-center align-middle">{movie.genre}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-pink-200 text-xs md:text-sm whitespace-normal break-words text-center align-middle">{movie.year}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-pink-200 text-xs md:text-sm whitespace-normal break-words text-center align-middle">{movie.studio}</td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-yellow-400 font-bold whitespace-nowrap text-center align-middle">
                          {movie.rating ? `${movie.rating} / 10` : '8.5 / 10'}
                        </td>
                        <td className="px-2 md:px-4 py-2 md:py-3 text-left align-middle">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 ? (
                              movie.showtimes.map((show, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-100 px-2 md:px-4 py-1 text-xs rounded min-w-[70px] md:min-w-[90px] text-center"
                                >
                                  {show.time} <span className="ml-1 text-pink-200/70">₱{show.price}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-pink-200 text-xs">N/A</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
              {/* Responsive horizontal card for below xl (including iPad Pro) */}
              <div className="xl:hidden">
                {loading ? (
                  <div className="text-center py-8 text-pink-200 text-base animate-pulse">Loading movies...</div>
                ) : movies.length === 0 ? (
                  <div className="text-center py-8 text-pink-200 text-base">No movies found.</div>
                ) : (
                  movies.slice(0, 8).map(movie => (
                    <div
                      key={movie._id}
                      className="flex flex-row gap-4 border-b border-pink-400/20 py-4 px-2 mb-3 items-stretch"
                    >
                      {/* Poster on the left, full height of details */}
                      <div className="flex-shrink-0 flex items-stretch">
                        <img
                          src={movie.poster}
                          alt={movie.title}
                          className="h-full w-20 object-cover rounded shadow"
                          style={{ minHeight: '120px', maxHeight: '340px' }}
                        />
                      </div>
                      {/* Details on the right */}
                      <div className="flex flex-col flex-1 min-w-0">
                        <div className="font-bold text-white text-base mb-1">{movie.title}</div>
                        <div className="text-pink-200 text-xs whitespace-pre-line mb-2">{movie.genre}</div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs mb-2">
                          <div>
                            <span className="font-semibold text-pink-200">Year:</span>
                            <span className="text-white ml-1">{movie.year}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-pink-200">Studio:</span>
                            <span className="text-white ml-1">{movie.studio}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-pink-200">Rating:</span>
                            <span className="text-yellow-400 font-bold ml-1">{movie.rating ? `${movie.rating} / 10` : '8.5 / 10'}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="font-semibold text-pink-200">Showtimes:</span>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 ? (
                              movie.showtimes.map((show, idx) => (
                                <span
                                  key={idx}
                                  className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-100 px-3 py-1 text-xs rounded min-w-[70px] text-center"
                                >
                                  {show.time} <span className="ml-1 text-pink-200/70">₱{show.price}</span>
                                </span>
                              ))
                            ) : (
                              <span className="text-pink-200 text-xs">N/A</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Dashboard