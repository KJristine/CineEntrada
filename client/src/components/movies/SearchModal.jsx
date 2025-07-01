import React, { useState, useEffect } from 'react'
import { SearchIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const SearchModal = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [movies, setMovies] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    // Only fetch movies that are active or scheduled and now live
    fetch('/api/movies/active')
      .then(res => res.json())
      .then(data => setMovies(data))
  }, [])

  const handleSearch = (query) => {
    setSearchQuery(query)
    if (query.trim() === '') {
      setSearchResults([])
      return
    }
    const filtered = movies.filter(movie =>
      movie.title.toLowerCase().includes(query.toLowerCase()) ||
      (movie.genre && movie.genre.toLowerCase().includes(query.toLowerCase())) ||
      (movie.studio && movie.studio.toLowerCase().includes(query.toLowerCase())) ||
      (movie.year && movie.year.includes(query))
    )
    setSearchResults(filtered)
  }

  const handleClose = () => {
    setSearchQuery('')
    setSearchResults([])
    onClose()
  }

  const handleMovieClick = (movie) => {
    handleClose()
    navigate(`/movie/${movie._id}`)
  }

  if (!isOpen) return null

  return (
    <div className='fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm'>
      <div className='flex items-start justify-center min-h-screen pt-20 px-4'>
        <div className='bg-gray-900 rounded-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden shadow-2xl border border-gray-700'>
          
          {/* Search Header */}
          <div className='p-6 border-b border-gray-700'>
            <div className='flex items-center gap-4'>
              <div className='relative flex-1'>
                <SearchIcon className='absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400' />
                <input
                  type='text'
                  placeholder='Search movies, genres, studios...'
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className='w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500'
                  autoFocus
                />
              </div>
              <button
                onClick={handleClose}
                className='p-3 hover:bg-gray-800 rounded-xl transition-colors'
              >
                <XIcon className='w-5 h-5 text-gray-400' />
              </button>
            </div>
          </div>

          {/* Search Results */}
          <div className='max-h-96 overflow-y-auto'>
            {searchQuery.trim() === '' ? (
              <div className='p-8 text-center text-gray-400'>
                <SearchIcon className='w-12 h-12 mx-auto mb-4 opacity-50' />
                <p>Start typing to search movies...</p>
              </div>
            ) : searchResults.length === 0 ? (
              <div className='p-8 text-center text-gray-400'>
                <p>No movies found for "{searchQuery}"</p>
              </div>
            ) : (
              <div className='p-4 space-y-3'>
                {searchResults.map((movie) => (
                  <div
                    key={movie._id}
                    className='flex items-center gap-4 p-4 hover:bg-gray-800 rounded-xl cursor-pointer transition-colors group'
                    onClick={() => handleMovieClick(movie)}
                  >
                    <img
                      src={movie.poster || movie.image}
                      alt={movie.title}
                      className='w-16 h-20 object-cover rounded-lg'
                    />
                    <div className='flex-1'>
                      <h3 className='text-white font-semibold group-hover:text-red-400 transition-colors'>
                        {movie.title}
                      </h3>
                      <p className='text-gray-400 text-sm mt-1'>
                        {movie.genre} • {movie.year}
                      </p>
                      <p className='text-gray-500 text-xs mt-1'>
                        {movie.studio} • {movie.duration}
                      </p>
                    </div>
                    <div className='flex items-center space-x-1 text-yellow-400'>
                      <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                      <span className='text-sm font-medium'>{movie.rating || '8.5'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          {searchQuery.trim() === '' && (
            <div className='p-6 border-t border-gray-700'>
              <p className='text-gray-400 text-sm mb-3'>Popular searches:</p>
              <div className='flex flex-wrap gap-2'>
                {['Marvel', 'Action', 'Spider-Man', '2023', 'Sci-Fi'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleSearch(tag)}
                    className='px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm rounded-full transition-colors'
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SearchModal