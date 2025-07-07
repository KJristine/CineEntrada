import React, { useState } from 'react'
import { Mail, User, MessageCircle, Loader2, CheckCircle2, X } from 'lucide-react'

const ContactSupport = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in all fields.')
      return
    }
    setLoading(true)
    setError('')
    // Simulate sending
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 1200)
  }

  const handleCloseSuccess = () => {
    setSent(false)
    setForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Contact Support
        </h3>
        <p className="text-gray-300 max-w-xl mx-auto text-base sm:text-lg">
          Need help? Our team is here for you. Fill out the form and we’ll get back to you as soon as possible.
        </p>
      </div>

      {/* Form */}
      <form 
        className={`space-y-6 max-w-lg mx-auto transition-opacity duration-300 ${sent ? 'opacity-30 pointer-events-none select-none' : 'opacity-100'}`}
        onSubmit={handleSubmit}
        style={{ filter: sent ? 'blur(2px)' : 'none' }}
      >
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-blue-500/20 focus:border-blue-500/60 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 outline-none transition-all"
            value={form.name}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 w-5 h-5" />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-purple-500/20 focus:border-purple-500/60 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-400 outline-none transition-all"
            value={form.email}
            onChange={handleChange}
            autoComplete="off"
          />
        </div>
        <div className="relative">
          <MessageCircle className="absolute left-4 top-4 text-pink-400 w-5 h-5" />
          <textarea
            name="message"
            placeholder="How can we help you?"
            rows={4}
            className="w-full bg-gradient-to-r from-gray-900/80 to-gray-800/80 border border-pink-500/20 focus:border-pink-500/60 rounded-lg pl-12 pr-4 pt-4 pb-3 text-white placeholder-gray-400 outline-none transition-all resize-none"
            value={form.message}
            onChange={handleChange}
          />
        </div>
        {error && (
          <div className="text-red-400 text-sm font-medium">{error}</div>
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Sending...
            </>
          ) : (
            <>
              <Mail className="w-5 h-5" />
              Send Message
            </>
          )}
        </button>
      </form>

      {/* Success Modal Overlay */}
      {sent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="relative bg-gradient-to-b from-gray-900 via-gray-900/90 to-gray-800 rounded-2xl shadow-2xl px-8 py-10 max-w-sm w-full flex flex-col items-center space-y-6 border border-purple-700/30">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
              onClick={handleCloseSuccess}
              aria-label="Close"
              type="button"
            >
              <X className="w-6 h-6" />
            </button>
            <CheckCircle2 className="w-16 h-16 text-green-400 drop-shadow-glow animate-bounce mb-2" />
            <div className="text-2xl font-bold bg-gradient-to-r from-green-300 via-blue-200 to-purple-200 bg-clip-text text-transparent text-center">
              Message Sent!
            </div>
            <div className="text-gray-300 text-center max-w-xs">
              Thank you for reaching out.<br />
              Our support team will contact you soon.
            </div>
            <button
              className="mt-2 px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition-all"
              onClick={handleCloseSuccess}
            >
              Send Another Message
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContactSupport