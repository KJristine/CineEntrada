import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, List, Ticket, LogOut, Menu } from 'lucide-react'

const navLinks = [
  { to: '/admin', label: 'Dashboard', icon: <Home className="w-5 h-5 mr-2" /> },
  { to: '/admin/list-movies', label: 'Movie List', icon: <List className="w-5 h-5 mr-2" /> },
  { to: '/admin/list-bookings', label: 'Booking List', icon: <Ticket className="w-5 h-5 mr-2" /> },
]

const Navbar = () => {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar - now only on xl and up */}
      <nav className="hidden xl:fixed xl:top-0 xl:left-0 xl:h-screen xl:w-64 xl:bg-gradient-to-br xl:from-[#1a093e] xl:via-[#3a185a] xl:to-[#0f051d] xl:shadow-2xl xl:border-r-4 xl:border-pink-500/30 xl:z-50 xl:flex xl:flex-col xl:justify-between xl:py-8 xl:px-4 md:backdrop-blur-md xl:backdrop-blur-none">
        {/* Navigation Links */}
        <ul className="flex-1 flex flex-col gap-1 mt-5">
          {navLinks.map(link => (
            <li key={link.to}>
              <Link
                to={link.to}
                className={`flex items-center px-4 py-3 rounded-lg font-bold text-base transition-all duration-200
                  ${
                    location.pathname === link.to
                      ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white shadow-lg scale-105'
                      : 'text-pink-200 hover:bg-gradient-to-r hover:from-pink-900/40 hover:via-purple-900/40 hover:to-blue-900/40 hover:text-white'
                  }
                `}
              >
                {link.icon}
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
        {/* Logout */}
        <div className="flex flex-col items-center mt-6 mb-2">
          <button
            className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[#18122B] text-pink-200 font-bold shadow hover:bg-pink-700/80 hover:text-white transition-all duration-200"
            style={{ border: 'none', background: 'none' }}
          >
            <LogOut className="w-5 h-5 mr-2 opacity-80 group-hover:opacity-100" />
            Logout
          </button>
        </div>
        {/* Cosmic Glow Animation */}
        <style>{`
          .animate-glow {
            animation: glowText 2.5s ease-in-out infinite alternate;
          }
          .drop-shadow-glow {
            filter: drop-shadow(0 0 12px #f472b6) drop-shadow(0 0 32px #a78bfa);
          }
          @keyframes glowText {
            0% { text-shadow: 0 0 12px #f472b6, 0 0 32px #a78bfa; }
            100% { text-shadow: 0 0 32px #f472b6, 0 0 64px #a78bfa; }
          }
        `}</style>
      </nav>

      {/* Mobile/Tablet Navbar - now on screens below xl */}
      <nav className="xl:hidden fixed top-0 left-0 w-full bg-gradient-to-br from-[#1a093e] via-[#3a185a] to-[#0f051d] shadow-2xl border-b-4 border-pink-500/30 z-50 flex items-center justify-between px-4 py-3">
        {/* Logo or Title */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-extrabold text-pink-200 tracking-wide">Admin</span>
        </div>
        {/* Hamburger */}
        <button
          className="text-pink-200 focus:outline-none"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open navigation menu"
        >
          <Menu className="w-7 h-7" />
        </button>
        {/* Mobile Menu Overlay */}
        <div
          className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-200 ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMobileOpen(false)}
        />
        {/* Mobile Slide-in Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-gradient-to-br from-[#1a093e] via-[#3a185a] to-[#0f051d] shadow-2xl border-l-4 border-pink-500/30 z-50 transform transition-transform duration-300 ${
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          } flex flex-col justify-between py-8 px-4`}
        >
          <ul className="flex-1 flex flex-col gap-1 mt-5">
            {navLinks.map(link => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className={`flex items-center px-4 py-3 rounded-lg font-bold text-base transition-all duration-200
                    ${
                      location.pathname === link.to
                        ? 'bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 text-white shadow-lg scale-105'
                        : 'text-pink-200 hover:bg-gradient-to-r hover:from-pink-900/40 hover:via-purple-900/40 hover:to-blue-900/40 hover:text-white'
                    }
                  `}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.icon}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-center mt-6 mb-2">
            <button
              className="flex items-center justify-center w-full px-4 py-3 rounded-lg bg-[#18122B] text-pink-200 font-bold shadow hover:bg-pink-700/80 hover:text-white transition-all duration-200"
              style={{ border: 'none', background: 'none' }}
            >
              <LogOut className="w-5 h-5 mr-2 opacity-80 group-hover:opacity-100" />
              Logout
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}

export default Navbar