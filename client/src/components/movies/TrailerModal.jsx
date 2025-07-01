import React from 'react'
import { XIcon } from 'lucide-react'

const TrailerModal = ({ isOpen, onClose, movieTitle, trailerUrl }) => {
  
  const handleClose = () => {
    onClose()
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className='fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4'
      onClick={handleBackdropClick}
    >
      <div className='relative w-full max-w-6xl aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl'>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className='absolute top-4 right-4 z-10 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors group'
        >
          <XIcon className='w-6 h-6 text-white group-hover:text-red-400 transition-colors' />
        </button>

        {/* Movie Title */}
        <div className='absolute top-4 left-4 z-10'>
          <h3 className='text-white text-xl font-bold bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm'>
            {movieTitle} - Trailer
          </h3>
        </div>

        {/* Trailer Video */}
        {trailerUrl ? (
          <iframe
            src={trailerUrl}
            title={`${movieTitle} Trailer`}
            className='w-full h-full'
            allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
            allowFullScreen
          />
        ) : (
          <div className='flex items-center justify-center h-full bg-gray-900'>
            <div className='text-center text-white'>
              <div className='w-16 h-16 mx-auto mb-4 bg-red-600 rounded-full flex items-center justify-center'>
                <svg className='w-8 h-8' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M8 5v14l11-7z'/>
                </svg>
              </div>
              <h3 className='text-xl font-semibold mb-2'>Trailer Not Available</h3>
              <p className='text-gray-400'>The trailer for {movieTitle} is currently unavailable.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TrailerModal