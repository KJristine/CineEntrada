import React, { useState, useEffect, useRef } from 'react'
import { 
  Film, 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Twitter, 
  Facebook, 
  Youtube,
  ArrowUp,
  Users,
  HelpCircle,
  MessageCircle,
  FileText,
  Shield
} from 'lucide-react'

import SupportModal from './support/SupportModal'
import HelpCenter from './support/HelpCenter'
import ContactSupport from './support/ContactSupport'
import TermsOfService from './support/TermsOfService'
import PrivacyPolicy from './support/PrivacyPolicy'
import '../../../client/src/index.css'

const Footer = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [activeModal, setActiveModal] = useState(null)
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const showThreshold = 300
      setShowBackToTop(scrollTop > showThreshold)
    }

    let timeoutId = null
    const throttledHandleScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          handleScroll()
          timeoutId = null
        }, 10)
      }
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ 
      top: 0, 
      behavior: 'smooth' 
    })
  }

  const handleHelpCenter = () => setActiveModal('help')
  const handleContactSupport = () => setActiveModal('contact')
  const handleTermsOfService = () => setActiveModal('terms')
  const handlePrivacyPolicy = () => setActiveModal('privacy')

  const socialLinks = [
    { icon: Instagram, label: 'Instagram', href: 'https://instagram.com/', color: 'from-pink-500 to-purple-600' },
    { icon: Twitter, label: 'Twitter', href: 'https://twitter.com/', color: 'from-blue-400 to-blue-600' },
    { icon: Facebook, label: 'Facebook', href: 'https://facebook.com/', color: 'from-blue-600 to-blue-800' },
    { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/', color: 'from-red-500 to-red-700' }
  ]

  const quickLinks = [
    { label: 'Home', href: '#' },
    { label: 'Movies', href: '#movies' },
    { label: 'Theaters', href: '#theaters' },
    { label: 'My Bookings', href: '#bookings' }
  ]

  const supportLinks = [
    { 
      label: 'Help Center', 
      icon: HelpCircle,
      action: handleHelpCenter
    },
    { 
      label: 'Contact Support', 
      icon: MessageCircle,
      action: handleContactSupport
    },
    { 
      label: 'Terms of Service', 
      icon: FileText,
      action: handleTermsOfService
    },
    { 
      label: 'Privacy Policy', 
      icon: Shield,
      action: handlePrivacyPolicy
    }
  ]

  const handleSubscribe = (e) => {
    e.preventDefault()
    alert('Coming Soon!')
  }

  return (
    <>
      <footer 
        ref={footerRef}
        className='relative bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white overflow-hidden'
      >
        {/* Simple Background Effects */}
        <div className='absolute inset-0 opacity-10 pointer-events-none select-none'>
          <div className='absolute top-0 left-1/4 w-60 h-60 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-blue-500 rounded-full blur-3xl animate-pulse'></div>
          <div className='absolute bottom-0 right-1/4 w-52 h-52 sm:w-72 sm:h-72 md:w-80 md:h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000'></div>
        </div>

        {/* Main Footer Content */}
        <div className='relative z-10'>

          {/* Newsletter Section */}
          <div className={`border-b border-gray-800/50 py-12 sm:py-16 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16'>
              <div className='text-center space-y-8'>
                <div className='space-y-4'>
                  <h3 className='text-2xl sm:text-3xl md:text-4xl font-bold leading-tight'>
                    <span className='bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
                      Stay Updated
                    </span>
                  </h3>
                  <p className='text-gray-300 max-w-xl mx-auto text-base sm:text-lg'>
                    Get the latest movie releases and exclusive offers delivered to your inbox.
                  </p>
                </div>
                <div className='max-w-md mx-auto'>
                  <form
                    className='flex flex-col sm:flex-row items-stretch sm:items-center bg-gray-800/50 border border-gray-700/50 rounded-xl p-2 hover:border-blue-500/50 transition-all duration-300 gap-2'
                    onSubmit={handleSubscribe}
                  >
                    <div className="relative flex-1">
                      <Mail className='w-5 h-5 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none' />
                      <input
                        type='email'
                        placeholder='Enter your email'
                        className='w-full bg-transparent pl-12 pr-4 py-3 text-white placeholder-gray-400 outline-none rounded-lg'
                      />
                    </div>
                    <button
                      type="submit"
                      className='bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 whitespace-nowrap'
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          {/* Main Footer Links */}
          <div className={`py-12 sm:py-16 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12'>
                {/* Logo & Description */}
                <div className='lg:col-span-2 space-y-6'>
                  <div className='flex items-center space-x-3'>
                    <Film className='w-8 h-8 text-blue-400' />
                    <span className='text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent'>
                      CineEntrada
                    </span>
                  </div>
                  <p className='text-gray-300 leading-relaxed max-w-md text-base'>
                    Your ultimate destination for movie booking in the Philippines. 
                    Discover and enjoy the best cinematic experiences.
                  </p>
                  {/* Contact Info */}
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-3 text-gray-400 hover:text-blue-400 transition-colors cursor-pointer text-sm'>
                      <MapPin className='w-4 h-4' />
                      <span>City of General Trias, Cavite</span>
                    </div>
                    <a 
                      href='tel:+6328123456'
                      className='flex items-center space-x-3 text-gray-400 hover:text-green-400 transition-colors text-sm'
                    >
                      <Phone className='w-4 h-4' />
                      <span>+63 2 8123 4567</span>
                    </a>
                    <a 
                      href='mailto:hello@cine-entrada.ph'
                      className='flex items-center space-x-3 text-gray-400 hover:text-purple-400 transition-colors text-sm'
                    >
                      <Mail className='w-4 h-4' />
                      <span>hello@cine-entrada.ph</span>
                    </a>
                  </div>
                  {/* Social Media */}
                  <div className='flex space-x-4 pt-2'>
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        target='_blank'
                        rel='noopener noreferrer'
                        className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110`}
                        aria-label={social.label}
                      >
                        <social.icon className='w-5 h-5 text-white' />
                      </a>
                    ))}
                  </div>
                </div>
                {/* Quick Links */}
                <div className='space-y-6'>
                  <h4 className='text-white font-bold text-lg'>Quick Links</h4>
                  <ul className='space-y-3'>
                    {quickLinks.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform inline-block text-base'
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Support */}
                <div className='space-y-6'>
                  <h4 className='text-white font-bold text-lg flex items-center space-x-2'>
                    <Users className='w-5 h-5 text-green-400' />
                    <span>Support</span>
                  </h4>
                  <ul className='space-y-3'>
                    {supportLinks.map((link, index) => (
                      <li key={index}>
                        <button
                          onClick={link.action}
                          className='text-gray-400 hover:text-white transition-colors duration-300 hover:translate-x-1 transform flex items-center space-x-2 text-left w-full text-base'
                        >
                          <link.icon className='w-4 h-4 flex-shrink-0' />
                          <span>{link.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section */}
          <div className={`border-t border-gray-800/50 py-6 sm:py-8 transition-all duration-1000 delay-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16'>
              <div className='flex items-center justify-center relative'>
                <div className='text-center text-gray-400 text-sm sm:text-base'>
                  <span>© 2025 CineEntrada Philippines. All rights reserved.</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </footer>

      {/* Back To Top Button */}
      {showBackToTop && (
        <button
          onClick={scrollToTop}
          className='fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-50 group transform transition-all duration-700 ease-out'
          style={{
            animation: showBackToTop ? 'etherealRise 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'etherealFade 0.5s ease-in'
          }}
        >
          <div className='absolute inset-0 w-16 h-16 -m-2 pointer-events-none select-none'>
            <div className='absolute inset-0 rounded-full bg-gradient-conic from-blue-400 via-purple-500 via-pink-500 via-cyan-400 to-blue-400 opacity-30 animate-spin-slow'></div>
            <div className='absolute inset-1 rounded-full bg-gradient-conic from-pink-400 via-blue-500 via-purple-500 via-emerald-400 to-pink-400 opacity-40 animate-reverse-spin'></div>
            <div className='absolute inset-2 rounded-full bg-gradient-conic from-cyan-400 via-pink-500 via-blue-500 via-purple-400 to-cyan-400 opacity-30 animate-spin-slow delay-300'></div>
            <div className='absolute inset-0 rounded-full bg-gradient-radial from-blue-500/20 via-purple-500/30 to-transparent animate-pulse-slow'></div>
            <div className='absolute inset-0 rounded-full bg-gradient-radial from-pink-500/20 via-blue-500/30 to-transparent animate-pulse-slow delay-500'></div>
          </div>
          <div className='absolute inset-0 pointer-events-none'>
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className='absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-float'
                style={{
                  left: `${20 + Math.random() * 60}%`,
                  top: `${20 + Math.random() * 60}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
          <div className='relative w-12 h-12'>
            <div className='absolute inset-0 rounded-full bg-gradient-to-br from-gray-900/80 via-black/90 to-gray-800/80 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:shadow-cyan-500/25 transition-all duration-500'>
              <div className='absolute inset-0.5 rounded-full bg-gradient-to-br from-blue-500/30 via-purple-500/40 to-pink-500/30 group-hover:from-cyan-400/40 group-hover:via-blue-500/50 group-hover:to-purple-500/40 transition-all duration-700'></div>
              <div className='absolute inset-1 rounded-full bg-gradient-to-br from-white/10 via-transparent to-white/5 group-hover:from-cyan-300/20 group-hover:to-blue-300/10 transition-all duration-500'></div>
              <div className='absolute inset-0 rounded-full opacity-20 group-hover:opacity-40 transition-opacity duration-500'>
                <div className='w-full h-full rounded-full border border-dashed border-blue-400/30 animate-spin-very-slow'></div>
                <div className='absolute top-1/2 left-1/2 w-6 h-6 -mt-3 -ml-3 border border-dotted border-purple-400/30 rounded-full animate-reverse-spin-slow'></div>
              </div>
            </div>
            <div className='absolute inset-0 flex items-center justify-center'>
              <ArrowUp className='w-5 h-5 text-white drop-shadow-lg transform transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-0.5 group-hover:text-cyan-200 group-hover:drop-shadow-cyan-500/50' />
            </div>
            <div className='absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500 animate-twinkle'></div>
            <div className='absolute -bottom-2 -left-2 w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700 animate-twinkle delay-200'></div>
            <div className='absolute -top-1 -left-3 w-1.5 h-1.5 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-600 animate-twinkle delay-400'></div>
            <div className='absolute -bottom-1 -right-3 w-1 h-1 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-800 animate-twinkle delay-600'></div>
          </div>
        </button>
      )}

      {/* Support Modals */}
      <SupportModal 
        isOpen={activeModal === 'help'} 
        onClose={() => setActiveModal(null)}
        title="Help Center"
        icon={HelpCircle}
      >
        <HelpCenter />
      </SupportModal>
      <SupportModal 
        isOpen={activeModal === 'contact'} 
        onClose={() => setActiveModal(null)}
        title="Contact Support"
        icon={MessageCircle}
      >
        <ContactSupport />
      </SupportModal>
      <SupportModal 
        isOpen={activeModal === 'terms'} 
        onClose={() => setActiveModal(null)}
        title="Terms of Service"
        icon={FileText}
      >
        <TermsOfService />
      </SupportModal>
      <SupportModal 
        isOpen={activeModal === 'privacy'} 
        onClose={() => setActiveModal(null)}
        title="Privacy Policy"
        icon={Shield}
      >
        <PrivacyPolicy />
      </SupportModal>
    </>
  )
}

export default Footer