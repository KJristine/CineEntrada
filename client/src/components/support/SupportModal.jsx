import React from 'react'
import { X, Sparkles } from 'lucide-react'

const SupportModal = ({ isOpen, onClose, children, title, icon: Icon }) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl">
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-blue-400/30 rounded-full animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${Math.random() * 3 + 2}s`
              }}
            />
          ))}
        </div>
        
        {/* Aurora Effects */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30">
          <div className="absolute top-1/4 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-gradient-radial from-blue-500/40 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-60 h-60 sm:w-80 sm:h-80 bg-gradient-radial from-pink-500/40 via-purple-500/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
      </div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg sm:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Glass Container */}
        <div className="bg-gradient-to-br from-gray-900/90 via-gray-800/90 to-gray-900/90 backdrop-blur-2xl border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="relative p-4 sm:p-8 border-b border-white/10">
            {/* Header Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-pink-600/10 rounded-t-2xl sm:rounded-t-3xl"></div>
            
            <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-2xl border border-blue-500/30">
                  <Icon className="w-7 h-7 sm:w-8 sm:h-8 text-blue-400" />
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  <div className="flex items-center space-x-2 mt-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />
                    <span className="text-blue-300 text-xs sm:text-sm font-medium">Premium Support Experience</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 sm:p-3 hover:bg-white/10 rounded-2xl transition-all duration-300 transform hover:scale-110 group self-start sm:self-auto"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 sm:p-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {children}
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  )
}

export default SupportModal