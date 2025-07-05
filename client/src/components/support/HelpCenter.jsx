import React, { useState } from 'react'
import { Search, BookOpen, Headphones, Lock, Star, Sparkles, ArrowUp, MessageCircle, Mail, Phone } from 'lucide-react'

const faqData = [
  {
    question: "How do I book movie tickets?",
    answer: "To book movie tickets, browse the available movies, select your preferred showtime and seats, then proceed to checkout and payment."
  },
  {
    question: "Can I cancel or modify my booking?",
    answer: "Yes, you can cancel or modify your booking up to 2 hours before showtime via your account dashboard."
  },
  {
    question: "What payment methods are accepted?",
    answer: "We accept major credit/debit cards, GCash, Maya, and other popular payment methods in the Philippines."
  },
  {
    question: "How do I get my tickets?",
    answer: "After payment, your e-tickets will be sent to your email and will also be available in your account for download."
  },
  {
    question: "What if I arrive late to the movie?",
    answer: "If you arrive late, you may still enter the theater, but you will miss the portion of the movie that has already played. Refunds are not available for late arrivals."
  }
]

const HelpCenter = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const handleToggle = (idx) => {
    setOpenIndex(openIndex === idx ? null : idx)
  }

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <div className="relative">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center bg-white/5 border border-white/10 rounded-2xl p-4 hover:border-blue-500/50 transition-all duration-300 gap-3 sm:gap-0">
          <div className="flex items-center">
            <Search className="w-5 h-5 text-gray-400 mr-4" />
          </div>
          <input
            type="text"
            placeholder="Search for help..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none mb-2 sm:mb-0"
            disabled
          />
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-xl font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-300" disabled>
            Search
          </button>
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { icon: BookOpen, title: "Getting Started", desc: "New to MovieByte? Start here!" },
          { icon: Headphones, title: "Booking Help", desc: "Issues with reservations?" },
          { icon: Lock, title: "Account & Security", desc: "Manage your account safely" },
          { icon: Star, title: "Premium Features", desc: "Unlock exclusive benefits" }
        ].map((category, index) => (
          <div key={index} className="group p-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-2xl hover:border-blue-500/30 transition-all duration-300 cursor-not-allowed opacity-60">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 rounded-xl group-hover:from-blue-500/30 group-hover:to-purple-600/30 transition-all duration-300">
                <category.icon className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-300 transition-colors">
                  {category.title}
                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                </h3>
                <p className="text-gray-400 text-sm">{category.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Questions */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span>Popular Questions</span>
        </h3>
        {faqData.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 bg-gradient-to-r from-white/5 to-white/10 border border-white/10 rounded-xl transition-all duration-300 ${
              openIndex === idx ? 'cursor-pointer' : 'cursor-pointer'
            }`}
            onClick={() => handleToggle(idx)}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-300">{item.question}</span>
              <ArrowUp
                className={`w-4 h-4 text-gray-400 transform transition-transform duration-200 ${
                  openIndex === idx ? 'rotate-180' : 'rotate-90'
                }`}
              />
            </div>
            {openIndex === idx && (
              <div className="mt-3 text-gray-400 text-sm border-t border-white/10 pt-3">
                {item.answer}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8">
        <button
          className="relative p-4 bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-500/30 rounded-xl opacity-60 cursor-not-allowed w-full"
          disabled
        >
          <MessageCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <span className="text-white font-medium">Live Chat</span>
          <span className="absolute top-2 right-2 text-xs bg-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
        </button>
        <button
          className="relative p-4 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border border-blue-500/30 rounded-xl opacity-60 cursor-not-allowed w-full"
          disabled
        >
          <Mail className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <span className="text-white font-medium">Email Support</span>
          <span className="absolute top-2 right-2 text-xs bg-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
        </button>
        <button
          className="relative p-4 bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-500/30 rounded-xl opacity-60 cursor-not-allowed w-full"
          disabled
        >
          <Phone className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <span className="text-white font-medium">Call Us</span>
          <span className="absolute top-2 right-2 text-xs bg-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
        </button>
      </div>
    </div>
  )
}

export default HelpCenter