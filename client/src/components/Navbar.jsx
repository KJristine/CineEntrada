import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { MenuIcon, SearchIcon, TicketPlus, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import SearchModal from './movies/SearchModal'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user } = useUser()
  const { openSignIn } = useClerk()
  const navigate = useNavigate()
  const location = useLocation()

  const openSearchModal = () => setIsSearchOpen(true)
  const closeSearchModal = () => setIsSearchOpen(false)

  const handleLogin = () => {
    try {
      if (openSignIn) openSignIn()
    } catch (error) {
      console.error('Error opening sign in:', error)
    }
  }

  const handleMoviesClick = () => {
    if (location.pathname === '/') {
      const moviesSection = document.getElementById('movies')
      if (moviesSection) {
        moviesSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
      setIsOpen(false)
    } else {
      navigate('/')
      setTimeout(() => {
        const moviesSection = document.getElementById('movies')
        if (moviesSection) {
          moviesSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 300)
      setIsOpen(false)
    }
  }

  const handleTheatersClick = () => {
    if (location.pathname === '/') {
      const theatersSection = document.getElementById('theaters')
      if (theatersSection) {
        theatersSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
      setIsOpen(false)
    } else {
      navigate('/')
      setTimeout(() => {
        const theatersSection = document.getElementById('theaters')
        if (theatersSection) {
          theatersSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }
      }, 300)
      setIsOpen(false)
    }
  }

  const smoothScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  return (
    <>
      {/* Always-on blur overlay behind navbar for md and below */}
      <div className="fixed top-0 left-0 w-full h-[60px] sm:h-[80px] z-40 bg-white/60 dark:bg-black/60 backdrop-blur-md xl:hidden pointer-events-none"></div>

      {/* Main Navbar Container */}
      <div className="fixed top-0 left-0 z-50 w-full py-8 sm:py-10">
        <div className="relative flex items-center justify-center w-full px-4 sm:px-8 md:px-16 xl:px-36">
          {/* Logo (left) */}
          <div className="absolute left-4 sm:left-8 md:left-16 xl:left-36 flex items-center">
            <Link
              to='/'
              className='max-xl:flex-1'
              onClick={smoothScrollToTop}
              tabIndex={0}
            >
              <img
                src="/CineEntradaLogo.svg"
                alt="Logo"
                className="w-36 sm:w-48 md:w-56 lg:w-60 h-auto"
                style={{ maxWidth: '240px' }}
              />
            </Link>
          </div>

          {/* Navigation Menu (centered, responsive) */}
          {/* Desktop */}
          <div className="hidden xl:flex flex-row items-center gap-8 min-xl:px-8 py-3 min-xl:rounded-full bg-white/10 border border-gray-300/20 backdrop-blur">
            <Link
              onClick={smoothScrollToTop}
              to='/'
              className='hover:text-red-400 transition-colors'
            >
              Home
            </Link>
            <button
              onClick={handleMoviesClick}
              className='hover:text-red-400 transition-colors'
            >
              Movies
            </button>
            <button
              onClick={handleTheatersClick}
              className='hover:text-red-400 transition-colors'
            >
              Theaters
            </button>
          </div>

          {/* Right Side Actions (right) */}
          <div className="absolute right-4 sm:right-8 md:right-16 xl:right-36 flex items-center gap-4 sm:gap-8">
            {/* Search Icon */}
            <SearchIcon
              className='hidden xl:block w-6 h-6 cursor-pointer hover:text-red-400 transition-colors'
              onClick={openSearchModal}
            />

            {/* User Authentication */}
            {!user ? (
              <button
                onClick={handleLogin}
                className='bg-red-600 hover:bg-red-700 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base'
              >
                Login
              </button>
            ) : (
              <UserButton>
                <UserButton.MenuItems>
                  <UserButton.Action
                    label='My Bookings'
                    labelIcon={<TicketPlus width={15} />}
                    onClick={() => {
                      navigate('/my-bookings')
                      smoothScrollToTop()
                    }}
                  />
                </UserButton.MenuItems>
              </UserButton>
            )}

            {/* Mobile Menu Toggle */}
            <MenuIcon
              className='xl:hidden w-8 h-8 cursor-pointer'
              onClick={() => setIsOpen(true)}
            />
          </div>
        </div>
        {/* Search Modal Component */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearchModal}
        />
      </div>

      {/* Mobile/Tablet Fullscreen Menu - OUTSIDE the fixed navbar */}
      {isOpen && (
        <>
          {/* Blurring overlay for mobile menu */}
          <div className="fixed inset-0 z-[998] bg-white/60 dark:bg-black/60 backdrop-blur-md xl:hidden"></div>
          <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center gap-8 bg-transparent xl:hidden transition-all">
            <XIcon
              className='absolute top-8 right-8 w-7 h-7 cursor-pointer'
              onClick={() => setIsOpen(false)}
            />
            <Link
              onClick={() => {
                smoothScrollToTop()
                setIsOpen(false)
              }}
              to='/'
              className='hover:text-red-400 transition-colors text-lg font-medium'
            >
              Home
            </Link>
            <button
              onClick={() => {
                handleMoviesClick()
                setIsOpen(false)
              }}
              className='hover:text-red-400 transition-colors text-lg font-medium'
            >
              Movies
            </button>
            <button
              onClick={() => {
                handleTheatersClick()
                setIsOpen(false)
              }}
              className='hover:text-red-400 transition-colors text-lg font-medium'
            >
              Theaters
            </button>
          </div>
        </>
      )}
    </>
  )
}

export default Navbar