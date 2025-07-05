import React from 'react'
import { BookOpen, CheckCircle, Users, ArrowUp } from 'lucide-react'

const tocItems = [
  "1. Acceptance of Terms",
  "2. User Accounts", 
  "3. Booking Policy",
  "4. Payment Terms",
  "5. Cancellation Policy",
  "6. User Conduct",
  "7. Privacy Policy",
  "8. Limitation of Liability"
]

const mid = Math.ceil(tocItems.length / 2)
const col1 = tocItems.slice(0, mid)
const col2 = tocItems.slice(mid)

const TermsOfService = () => {
  return (
    <div className="space-y-6">
      {/* Table of Contents */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Table of Contents</span>
        </h3>
        <div className="flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full">
            <div className="flex flex-col">
              {col1.map((item, index) => (
                <button
                  key={index}
                  className="text-left text-blue-300 hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/5 w-full"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex flex-col">
              {col2.map((item, index) => (
                <button
                  key={index + mid}
                  className="text-left text-blue-300 hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/5 w-full"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Terms Content */}
      <div className="space-y-8 text-gray-300 leading-relaxed">
        <section>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6 text-green-400" />
            <span>1. Acceptance of Terms</span>
          </h3>
          <p className="mb-4">
            By accessing and using CineEntrada, you accept and agree to be bound by the terms and provision of this agreement.
          </p>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <Users className="w-6 h-6 text-blue-400" />
            <span>2. Booking Policy</span>
          </h3>
          <ul className="space-y-2 list-disc list-inside">
            <li>All bookings are subject to availability</li>
            <li>Payment must be completed within 15 minutes of reservation</li>
            <li>Tickets are non-transferable unless specified otherwise</li>
            <li>Age restrictions apply to certain movies</li>
          </ul>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <ArrowUp className="w-6 h-6 text-purple-400 transform rotate-180" />
            <span>3. Cancellation Policy</span>
          </h3>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
            <ul className="space-y-2 list-disc list-inside">
              <li>Cancellations allowed up to 2 hours before showtime</li>
              <li>Refunds processed within 3-5 business days</li>
              <li>No-show bookings are non-refundable</li>
              <li>Service fees may apply for cancellations</li>
            </ul>
          </div>
        </section>
      </div>

      <div className="text-center pt-6 border-t border-white/10">
        <p className="text-gray-400 text-sm">Last updated: June 2025</p>
      </div>
    </div>
  )
}

export default TermsOfService