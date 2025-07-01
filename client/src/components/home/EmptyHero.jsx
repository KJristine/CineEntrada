import React from 'react'
import { Sparkles, Film, Ticket, ChevronRight } from 'lucide-react'

const EmptyHero = () => {
  return (
    // Use the same background as MoviesSection for seamless transition
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 overflow-hidden">
      {/* Ethereal animated background blobs (match MoviesSection) */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[700px] h-[700px] bg-gradient-radial from-red-600/30 via-transparent to-transparent rounded-full blur-2xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        {/* Floating sparkles */}
        {[...Array(18)].map((_, i) => (
          <Sparkles
            key={i}
            className="absolute text-pink-300/30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: 18 + Math.random() * 18,
              height: 18 + Math.random() * 18,
              opacity: 0.15 + Math.random() * 0.15,
              animation: `floatY ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 flex flex-col items-center text-center">
        {/* Cinematic Curtain Illustration */}
        <div className="mb-8 w-full flex justify-center">
          <div className="relative w-full max-w-lg">
            {/* Subtle overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 rounded-3xl"></div>
            {/* Floating film icon */}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight mb-6 bg-gradient-to-r from-white via-pink-200 to-purple-200 bg-clip-text text-transparent drop-shadow-2xl">
          Welcome to <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent">CineEntrada</span>
        </h1>
        <h1 className="text-4xl text-pink-300 font-semibold mb-6">No movies are available right now.</h1>

        {/* Call to Action */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-2">
          <a
            href="/theaters"
            className="group inline-flex items-center space-x-3 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-pink-500/25 transform hover:scale-105"
          >
            <Ticket className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
            <span>Find Theaters</span>
            <ChevronRight className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </a>
          <a
            href="#"
            className="inline-flex items-center space-x-3 border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/60 px-8 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
            onClick={e => { e.preventDefault(); window.location.reload(); }}
          >
            <Film className="w-6 h-6" />
            <span>Refresh</span>
          </a>
        </div>
      </div>

      {/* Custom styles for animation */}
      <style jsx>{`
        .drop-shadow-glow {
          filter: drop-shadow(0 0 16px #f472b6) drop-shadow(0 0 32px #a78bfa);
        }
        @keyframes floatY {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
        .animate-float {
          animation: floatY 3.5s ease-in-out infinite;
        }
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </section>
  )
}

export default EmptyHero