import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { PlusCircle, Loader2, Film, Calendar, Clock, Award, Star, Youtube, Image, X, Plus, ChevronDown, CheckCircle, Image as ImageIcon } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

const initialState = {
  title: '',
  description: '',
  poster: '',
  backdrop: '',
  year: '',
  duration: '',
  genre: '',
  studio: '',
  rating: '',
  trailer: '',
  showtimes: [{ time: '', totalSeats: 50, price: '' }]
}

const getYearOptions = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let y = currentYear + 1; y >= 1980; y--) {
    years.push(y)
  }
  return years
}

// Custom Time Picker Component
const CustomTimePicker = ({ value, onChange, placeholder = "Select time" }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedHour, setSelectedHour] = useState('')
  const [selectedMinute, setSelectedMinute] = useState('')
  const [selectedPeriod, setSelectedPeriod] = useState('AM')

  useEffect(() => {
    if (value) {
      const match = value.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (match) {
        setSelectedHour(match[1])
        setSelectedMinute(match[2])
        setSelectedPeriod(match[3].toUpperCase())
      }
    }
  }, [value])

  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'))
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'))

  const handleTimeSelect = (hour, minute, period) => {
    const timeString = `${hour}:${minute} ${period}`
    onChange(timeString)
    setIsOpen(false)
  }

  const displayValue = value || placeholder

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 text-lg flex items-center justify-between"
      >
        <span className={value ? 'text-white' : 'text-purple-300/50'}>
          {displayValue}
        </span>
        <ChevronDown className={`w-4 h-4 text-purple-300 transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`} />
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-[100]" 
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full left-0 right-0 mb-2 z-[101] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-purple-300/20 shadow-2xl overflow-hidden">
            <div className="p-6">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div>
                  <h4 className="text-purple-300 text-sm font-semibold mb-3 text-center">Hour</h4>
                  <div className="max-h-32 overflow-y-auto custom-scrollbar">
                    {hours.map(hour => (
                      <button
                        key={hour}
                        type="button"
                        onClick={() => setSelectedHour(hour)}
                        className={`w-full px-3 py-2 rounded-lg text-center transition-all duration-200 ${
                          selectedHour === hour
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-purple-200 hover:bg-purple-500/20'
                        }`}
                      >
                        {hour}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-purple-300 text-sm font-semibold mb-3 text-center">Minute</h4>
                  <div className="max-h-32 overflow-y-auto custom-scrollbar">
                    {minutes.map(minute => (
                      <button
                        key={minute}
                        type="button"
                        onClick={() => setSelectedMinute(minute)}
                        className={`w-full px-3 py-2 rounded-lg text-center transition-all duration-200 ${
                          selectedMinute === minute
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-purple-200 hover:bg-purple-500/20'
                        }`}
                      >
                        {minute}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-purple-300 text-sm font-semibold mb-3 text-center">Period</h4>
                  <div className="space-y-2">
                    {['AM', 'PM'].map(period => (
                      <button
                        key={period}
                        type="button"
                        onClick={() => setSelectedPeriod(period)}
                        className={`w-full px-3 py-2 rounded-lg text-center transition-all duration-200 ${
                          selectedPeriod === period
                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                            : 'text-purple-200 hover:bg-purple-500/20'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => {
                    if (selectedHour && selectedMinute) {
                      handleTimeSelect(selectedHour, selectedMinute, selectedPeriod)
                    }
                  }}
                  disabled={!selectedHour || !selectedMinute}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

const AddMovies = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [posterLoaded, setPosterLoaded] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Modal state for status/schedule
  const [showStatusModal, setShowStatusModal] = useState(false)
  const [pendingMovieId, setPendingMovieId] = useState(null)
  const [statusChoice, setStatusChoice] = useState('active')
  const [scheduleDate, setScheduleDate] = useState('')

  // Fetch movie if editing
  useEffect(() => {
    if (id) {
      setLoading(true)
      fetch(`${API_URL}/api/movies/${id}`)
        .then(res => res.json())
        .then(data => setForm(data))
        .catch(() => setError('Failed to load movie.'))
        .finally(() => setLoading(false))
    }
  }, [id])

  useEffect(() => {
    const canvas = document.getElementById('ethereal-bg')
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (e.target.name === 'poster') setPosterLoaded(false)
  }

  const handleShowtimeChange = (idx, field, value) => {
    const updated = [...form.showtimes]
    updated[idx][field] = value
    setForm({ ...form, showtimes: updated })
  }

  const addShowtime = () => {
    setForm({ ...form, showtimes: [...form.showtimes, { time: '', totalSeats: 50, price: '' }] })
  }

  const removeShowtime = (idx) => {
    if (form.showtimes.length === 1) return
    setForm({ ...form, showtimes: form.showtimes.filter((_, i) => i !== idx) })
  }

  // Ensure showtime price is a number before submit
  const prepareShowtimes = (showtimes) =>
    showtimes.map(st => ({
      ...st,
      price: typeof st.price === "string"
        ? Number(st.price.replace(/[^\d.]/g, ""))
        : Number(st.price)
    }))

  // 1st step: Add movie, then show status modal
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')
    try {
      const payload = {
        ...form,
        showtimes: prepareShowtimes(form.showtimes)
      }
      const res = await fetch(id ? `${API_URL}/api/movies/${id}` : `${API_URL}/api/movies`, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (!res.ok) throw new Error()
      const movie = await res.json()
      setPendingMovieId(movie._id || movie.id || movie._id)
      setShowStatusModal(true)
    } catch {
      setError('Failed to save movie.')
    }
    setLoading(false)
  }

  // 2nd step: Set status/schedule
  const handleStatusConfirm = async () => {
    setLoading(true)
    try {
      await fetch(`${API_URL}/api/movies/${pendingMovieId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isActive: statusChoice === 'active',
          scheduledAt: statusChoice === 'scheduled' ? scheduleDate : null
        })
      })
      setShowStatusModal(false)
      setShowSuccessModal(true)
    } catch {
      setError('Failed to update movie status.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <canvas 
        id="ethereal-bg" 
        className="absolute inset-0 pointer-events-none"
        style={{ filter: 'blur(1px)' }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.3)_100%)] pointer-events-none" />
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6 responsive-admin-outer">
        <div
          className="w-full flex justify-center responsive-admin-inner"
          style={{ paddingLeft: '16rem' }}
        >
          <div className="w-full max-w-4xl responsive-admin-form">
            <div className="responsive-admin-header-spacer" />
            <div className="text-center mb-8 responsive-admin-header">
              <h1 className="relative mt-4 text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-300 via-pink-300 via-blue-300 to-purple-300 bg-clip-text text-transparent tracking-tight leading-tight">
                {id ? 'Edit Movie' : 'Add New Movie'}
              </h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-8">
              {success && !showSuccessModal && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-green-500/20 backdrop-blur-sm border border-emerald-300/30 text-emerald-300 text-center font-medium">
                  {success}
                </div>
              )}
              {error && (
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500/20 to-rose-500/20 backdrop-blur-sm border border-red-300/30 text-red-300 text-center font-medium">
                  {error}
                </div>
              )}
              <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* ...all your form fields as before... */}
                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <Film className="w-5 h-5 text-purple-400" />
                      Movie Title
                    </label>
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="Enter movie title..."
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <Award className="w-5 h-5 text-purple-400" />
                      Studio
                    </label>
                    <input
                      name="studio"
                      value={form.studio}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="Studio name..."
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <Calendar className="w-5 h-5 text-purple-400" />
                      Year
                    </label>
                    <div className="relative">
                      <select
                        name="year"
                        value={form.year}
                        onChange={handleChange}
                        className="w-full px-4 py-3 pr-10 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 appearance-none"
                        required
                      >
                        <option value="" className="text-purple-300/50">Select year...</option>
                        {getYearOptions().map((year) => (
                          <option key={year} value={year} className="text-slate-900">{year}</option>
                        ))}
                      </select>
                      <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-purple-300">
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                          <path d="M7 10l5 5 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <Clock className="w-5 h-5 text-purple-400" />
                      Duration
                    </label>
                    <input
                      name="duration"
                      value={form.duration}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="2h 30m"
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <Star className="w-5 h-5 text-purple-400" />
                      Rating
                    </label>
                    <input
                      name="rating"
                      value={form.rating}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="8.5"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      Genre
                    </label>
                    <input
                      name="genre"
                      value={form.genre}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="Action • Adventure • Sci-Fi"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 resize-none"
                      placeholder="Enter movie description..."
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <Image className="w-5 h-5 text-purple-400" />
                      Poster URL
                    </label>
                    <input
                      name="poster"
                      value={form.poster}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="https://image.tmdb.org/..."
                    />
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <ImageIcon className="w-5 h-5 text-purple-400" />
                      Backdrop URL
                    </label>
                    <input
                      name="backdrop"
                      value={form.backdrop}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="https://image.tmdb.org/..."
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="flex items-center gap-2 text-purple-200 font-semibold mb-3">
                      <Youtube className="w-5 h-5 text-purple-400" />
                      Trailer URL
                    </label>
                    <input
                      name="trailer"
                      value={form.trailer}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300"
                      placeholder="https://youtube.com/embed/..."
                    />
                  </div>
                </div>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-purple-200 mb-4">Showtimes</h3>
                  <div className="space-y-4">
                    {form.showtimes.map((show, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row md:items-end gap-3 p-4 rounded-xl bg-black/20 backdrop-blur-sm border border-purple-300/10"
                      >
                        <div className="flex-1 min-w-[180px] md:min-w-[220px]">
                          <label className="block text-purple-300 text-sm font-semibold mb-1">Time</label>
                          <CustomTimePicker
                            value={show.time}
                            onChange={(time) => handleShowtimeChange(idx, 'time', time)}
                            placeholder="Select time"
                          />
                        </div>
                        <div className="w-full md:w-40">
                          <label className="block text-purple-300 text-sm font-semibold mb-1">Seats</label>
                          <div className="relative flex items-center">
                            <button
                              type="button"
                              onClick={() =>
                                handleShowtimeChange(
                                  idx,
                                  'totalSeats',
                                  Math.max(1, Number(show.totalSeats) - 1)
                                )
                              }
                              className="absolute left-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-purple-700/40 text-purple-200 hover:bg-purple-500/80 hover:text-white transition-all duration-200"
                              tabIndex={-1}
                              aria-label="Decrease seats"
                            >
                              <span className="text-xl font-bold">−</span>
                            </button>
                            <input
                              type="number"
                              value={show.totalSeats}
                              onChange={e => handleShowtimeChange(idx, 'totalSeats', e.target.value)}
                              placeholder="50"
                              min={1}
                              required
                              className="w-full px-10 py-2 text-lg rounded-lg bg-black/30 border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 text-center"
                              style={{ MozAppearance: 'textfield' }}
                            />
                            <button
                              type="button"
                              onClick={() =>
                                handleShowtimeChange(
                                  idx,
                                  'totalSeats',
                                  Number(show.totalSeats) + 1
                                )
                              }
                              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-full bg-pink-700/40 text-pink-200 hover:bg-pink-500/80 hover:text-white transition-all duration-200"
                              tabIndex={-1}
                              aria-label="Increase seats"
                            >
                              <span className="text-xl font-bold">+</span>
                            </button>
                          </div>
                        </div>
                        <div className="w-full md:w-32">
                          <label className="block text-purple-300 text-sm font-semibold mb-1">Price</label>
                          <input
                            type="text"
                            value={show.price}
                            onChange={e => handleShowtimeChange(idx, 'price', e.target.value)}
                            placeholder="₱350"
                            className="w-full px-4 py-2 rounded-lg bg-black/30 border border-purple-300/20 text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400/50 focus:border-purple-400/50 transition-all duration-300 text-lg"
                            required
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeShowtime(idx)}
                          className="w-full md:w-12 h-[44px] flex items-center justify-center rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed border border-red-400/20 shadow-md mt-2 md:mt-0"
                          disabled={form.showtimes.length === 1}
                          title="Remove showtime"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addShowtime}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-purple-300/20 text-purple-300 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-300"
                    >
                      <Plus className="w-4 h-4" />
                      Add Showtime
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-2xl hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {id ? 'Saving...' : 'Adding Movie...'}
                      </>
                    ) : (
                      <>
                        <PlusCircle className="w-5 h-5" />
                        {id ? 'Save Changes' : 'Add Movie'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* Status Modal */}
      {showStatusModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="relative bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 border border-purple-400/20 rounded-3xl shadow-2xl p-8 max-w-md w-full animate-fadeIn">
          {/* Close Button */}
          <button
            className="absolute top-4 right-4 text-purple-300 hover:text-white transition"
            onClick={() => setShowStatusModal(false)}
            aria-label="Close"
          >
            <svg width="24" height="24" fill="none" className="w-6 h-6">
              <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
          <h2 className="text-2xl font-bold mb-4 text-white flex items-center gap-2">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24">
              <path d="M12 8v4l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Set Movie Status
          </h2>
          <div className="mb-6">
            <label className="flex items-center mb-3 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="active"
                checked={statusChoice === 'active'}
                onChange={() => setStatusChoice('active')}
                className="mr-3 accent-purple-500"
              />
              <span className="text-white font-medium">Active now</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="status"
                value="scheduled"
                checked={statusChoice === 'scheduled'}
                onChange={() => setStatusChoice('scheduled')}
                className="mr-3 accent-purple-500"
              />
              <span className="text-white font-medium">Schedule activation</span>
            </label>
            {statusChoice === 'scheduled' && (
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={e => setScheduleDate(e.target.value)}
                className="mt-4 w-full border border-purple-400/30 rounded-lg px-3 py-2 bg-black/30 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
                required
              />
            )}
          </div>
          <div className="flex justify-end gap-2">
            <button
              className="px-5 py-2 rounded-lg bg-gray-700 text-gray-200 hover:bg-gray-600 transition"
              onClick={() => setShowStatusModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold shadow hover:from-purple-600 hover:to-pink-600 transition"
              onClick={handleStatusConfirm}
              disabled={statusChoice === 'scheduled' && !scheduleDate}
            >
              Confirm
            </button>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.97);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s cubic-bezier(.4,0,.2,1);
          }
        `}</style>
      </div>
    )}
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70">
          <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/30 rounded-3xl shadow-2xl p-10 max-w-sm w-full flex flex-col items-center animate-fadeIn">
            <CheckCircle className="w-16 h-16 text-green-400 mb-4" />
            <div className="text-2xl font-bold text-green-300 mb-2 text-center">
              {success}
            </div>
            <div className="text-gray-300 mb-6 text-center">
              {id
                ? "The movie details have been updated. You can view it in the movie list."
                : "The new movie has been added. You can view it in the movie list."}
            </div>
            <button
              className="mt-2 px-8 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-lg shadow-xl hover:scale-105 transition-all"
              onClick={() => {
                setShowSuccessModal(false)
                navigate('/admin/list-movies')
              }}
            >
              Go to Movie List
            </button>
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: scale(0.97);}
              to { opacity: 1; transform: scale(1);}
            }
            .animate-fadeIn {
              animation: fadeIn 0.3s cubic-bezier(.4,0,.2,1);
            }
          `}</style>
        </div>
      )}
      {/* Custom Styles */}
      <style>{`
        select:focus {
          outline: none;
          box-shadow: 0 0 0 2px #a78bfa55;
        }
        select {
          background-image: none !important;
        }
        select,
        select option,
        select:invalid {
          color: #c4b5fd !important;
        }
        select option:not(:first-child) {
          color: #1e293b !important;
        }
        /* Hide number input arrows for Chrome, Safari, Edge, Opera */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          appearance: none;
          margin: 0;
        }
        /* Hide number input arrows for Firefox */
        input[type="number"] {
          -moz-appearance: textfield;
          appearance: textfield;
        }
        /* Custom scrollbar for time picker */
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(30, 41, 59, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #a78bfa, #f472b6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #8b5cf6, #ec4899);
        }
        /* Responsive centering for <=1024px */
        @media (max-width: 1024px) {
          .responsive-admin-header-spacer {
            height: 64px;
            width: 100%;
            display: block;
          }
          .responsive-admin-outer {
            align-items: center !important;
            justify-content: center !important;
            display: flex !important;
            min-height: 100vh !important;
            padding: 0 !important;
          }
          .responsive-admin-inner {
            padding-left: 0 !important;
            justify-content: center !important;
            width: 100% !important;
            display: flex !important;
            align-items: center !important;
          }
          .responsive-admin-form {
            max-width: 98vw !important;
            min-width: 0 !important;
            width: 100% !important;
            margin-left: auto !important;
            margin-right: auto !important;
            padding-left: 0 !important;
            padding-right: 0 !important;
            box-sizing: border-box !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
          }
          .responsive-admin-header {
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
          }
          .responsive-admin-form .grid {
            grid-template-columns: 1fr !important;
            gap: 1.25rem !important;
          }
        }
        @media (max-width: 640px) {
          .responsive-admin-form {
            padding: 0.5rem !important;
          }
          .responsive-admin-header-spacer {
            height: 48px;
          }
        }
      `}</style>
    </div>
  )
}

export default AddMovies