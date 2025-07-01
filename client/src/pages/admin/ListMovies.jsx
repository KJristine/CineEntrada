import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Film, Star, Calendar, Clock, Trash2, Edit, PlusCircle, ChevronRight, Clock as ClockIcon } from 'lucide-react'

const ListMovies = () => {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  // Ethereal animated background effect (copied from AddMovies)
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

  useEffect(() => {
    fetchMovies()
    // eslint-disable-next-line
  }, [])

  const fetchMovies = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/movies')
      const data = await res.json()
      setMovies(data)
    } catch {
      setError('Failed to fetch movies.')
    }
    setLoading(false)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this movie?')) return
    setDeletingId(id)
    setError('')
    setSuccess('')
    try {
      const res = await fetch(`/api/movies/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSuccess('Movie deleted!')
        setMovies(movies.filter(m => m._id !== id))
      } else {
        setError('Failed to delete movie.')
      }
    } catch {
      setError('Failed to delete movie.')
    }
    setDeletingId(null)
  }

  // Helper to get status tag
  const getStatusTag = (movie) => {
    if (!movie.isActive && movie.scheduledAt) {
      const scheduledDate = new Date(movie.scheduledAt)
      if (scheduledDate > new Date()) {
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-yellow-200 text-yellow-800 text-xs font-bold ml-2">
            <ClockIcon className="w-3 h-3" />
            Scheduled
          </span>
        )
      }
    }
    if (movie.isActive) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-green-200 text-green-800 text-xs font-bold ml-2">
          Active
        </span>
      )
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded bg-gray-200 text-gray-800 text-xs font-bold ml-2">
        Inactive
      </span>
    )
  }

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
      <main className="flex-1 p-8 md:p-16 relative overflow-x-auto ml-0 md:ml-0 xl:ml-[260px] z-10">
        {/* Add top space for mobile/tablet so Add Movie button is not obstructed by navbar */}
        <div className="block md:hidden" style={{ height: '64px' }} />
        {/* Extra top space for md+ but not xl+ */}
        <div className="hidden md:block xl:hidden" style={{ height: '48px' }} />
        {/* Cosmic Glow */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-2/3 h-32 bg-gradient-to-r from-pink-400/20 via-purple-400/20 to-blue-400/20 blur-3xl rounded-full opacity-80" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-3xl rounded-full opacity-60" />
        </div>
        {/* Add Movie Button Top Left */}
        <div className="relative z-10 flex justify-start mb-12">
          <Link
            to="/admin/add-movie"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:scale-105 transition-all duration-300 animate-glow"
          >
            <PlusCircle className="w-6 h-6" />
            Add Movie
          </Link>
        </div>
        {/* Movie Grid */}
        <div className="relative z-10 flex justify-center">
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-2
              xl:grid-cols-4
              2xl:grid-cols-5
              gap-6
              w-full
              max-w-[2000px]
            "
          >
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-white/10 rounded-2xl p-8 animate-pulse h-96" />
              ))
            ) : movies.length === 0 ? (
              <div className="col-span-full text-center text-pink-200 text-2xl py-24">
                No movies found.
              </div>
            ) : (
              movies.map(movie => (
                <div
                  key={movie._id}
                  className={`
                    group relative bg-gradient-to-br from-white/10 via-pink-400/5 to-purple-400/10
                    rounded-3xl shadow-2xl border border-pink-400/10 hover:border-pink-400/40
                    transition-all duration-300 overflow-hidden hover:scale-[1.03]
                    min-h-[420px] flex flex-col w-full mx-auto
                    max-w-[340px]
                    md:max-w-[600px] md:min-h-[560px] md:p-0
                    xl:max-w-[340px] xl:min-h-[420px] xl:p-0
                  `}
                  style={{
                    boxShadow: '0 8px 32px 0 rgba(236,72,153,0.18)',
                  }}
                >
                  {/* Card Glow */}
                  <div className="absolute inset-0 pointer-events-none z-0">
                    <div className="absolute -inset-4 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-blue-500/20 blur-2xl rounded-3xl opacity-40 group-hover:opacity-70 transition" />
                  </div>
                  {/* Poster */}
                  <div className="relative aspect-[3/4] overflow-hidden rounded-t-3xl">
                    <img
                      src={movie.poster || movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {/* Studio Badge */}
                    {movie.studio && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-pink-600 text-white px-3 py-1 text-xs font-bold uppercase rounded shadow">
                          {movie.studio}
                        </span>
                      </div>
                    )}
                    {/* Rating */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/70 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
                      <span className="text-white text-xs font-bold">{movie.rating || '8.5'}</span>
                    </div>
                    {/* New Badge */}
                    {parseInt(movie.year) >= 2024 && (
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-gradient-to-r from-green-400 to-blue-400 text-white px-2 py-1 text-xs font-bold uppercase rounded animate-pulse">
                          NEW
                        </span>
                      </div>
                    )}
                    {/* Scheduled Tag */}
                    <div className="absolute bottom-3 right-3">
                      {getStatusTag(movie)}
                    </div>
                  </div>
                  {/* Info */}
                  <div className="p-5 flex-1 flex flex-col space-y-2 md:p-8 xl:p-5">
                    <h2 className="text-lg font-extrabold leading-tight bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent group-hover:text-pink-400 transition-colors line-clamp-2">
                      {movie.title}
                    </h2>
                    <div className="flex items-center gap-3 text-pink-200/80 text-xs">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" /> {movie.year}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" /> {movie.duration}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {movie.genre &&
                        movie.genre.split(' | ').slice(0, 2).map((g, i) => (
                          <span
                            key={i}
                            className="bg-pink-700/30 text-pink-100 px-2 py-1 text-xs rounded"
                          >
                            {g}
                          </span>
                        ))}
                    </div>
                    <p className="text-pink-100/80 text-xs leading-relaxed line-clamp-2">
                      {movie.description}
                    </p>
                    {/* Showtimes */}
                    <div className="flex flex-wrap gap-2 mt-2">
                      {Array.isArray(movie.showtimes) && movie.showtimes.length > 0 && (
                        movie.showtimes.slice(0, 2).map((show, i) => (
                          <span
                            key={i}
                            className="bg-gradient-to-r from-pink-500/30 to-purple-500/30 text-pink-100 px-2 py-1 text-xs rounded"
                          >
                            {show.time} <span className="ml-1 text-pink-200/70">{show.price}</span>
                          </span>
                        ))
                      )}
                    </div>
                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-pink-400/10 mt-4">
                      <div className="flex gap-2 flex-nowrap">
                        <Link
                          to={`/movie/${movie._id}`}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold shadow hover:scale-105 transition-all duration-200"
                          title="View Details"
                        >
                          <Film className="w-4 h-4" />
                          View
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                        <Link
                          to={`/admin/add-movie/${movie._id}`}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-white/10 text-pink-200 text-xs font-bold hover:bg-pink-700/30 hover:text-white transition-all duration-200"
                          title="Edit Movie"
                        >
                          <Edit className="w-4 h-4" />
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(movie._id)}
                          disabled={deletingId === movie._id}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-lg bg-gradient-to-r from-red-600 to-pink-700 text-white text-xs font-bold shadow hover:scale-110 transition-all duration-200"
                          title="Delete Movie"
                        >
                          <Trash2 className="w-4 h-4" />
                          {deletingId === movie._id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
        {/* Cosmic Glow Animation */}
        <style>{`
          .drop-shadow-glow {
            filter: drop-shadow(0 0 12px #f472b6) drop-shadow(0 0 32px #a78bfa;
          }
          .animate-glow {
            animation: glowText 2.5s ease-in-out infinite alternate;
          }
          @keyframes glowText {
            0% { text-shadow: 0 0 12px #f472b6, 0 0 32px #a78bfa; }
            100% { text-shadow: 0 0 32px #f472b6, 0 0 64px #a78bfa; }
          }
          .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
        `}</style>
      </main>
    </div>
  )
}

export default ListMovies