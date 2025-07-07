import React, { useEffect } from 'react'

const LoadingOverlay = ({ message = "Loading movies..." }) => {
  useEffect(() => {
    // Prevent scrolling
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [])

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <svg className="animate-spin h-16 w-16 text-pink-400 mb-8" viewBox="0 0 50 50">
        <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none"/>
        <circle className="opacity-75" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="5" fill="none" strokeDasharray="90" strokeDashoffset="60"/>
      </svg>
      <span className="text-2xl text-white font-bold animate-pulse">{message}</span>
    </div>
  )
}

export default LoadingOverlay