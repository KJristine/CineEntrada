import React from 'react'
import { BookOpen, CheckCircle, Users, ArrowUp, CreditCard, UserCheck, Lock, Shield, AlertTriangle } from 'lucide-react'

const sections = [
  {
    icon: <CheckCircle className="w-6 h-6 text-green-400" />,
    title: "1. Acceptance of Terms",
    id: "acceptance",
    content: (
      <p>
        By accessing and using CineEntrada, you accept and agree to be bound by the terms and provision of this agreement.
      </p>
    )
  },
  {
    icon: <UserCheck className="w-6 h-6 text-blue-400" />,
    title: "2. User Accounts",
    id: "accounts",
    content: (
      <ul className="space-y-1 list-disc list-inside">
        <li>Users must provide accurate and complete information during registration.</li>
        <li>Account security is the responsibility of the user.</li>
        <li>Multiple accounts per user are not permitted.</li>
      </ul>
    )
  },
  {
    icon: <Users className="w-6 h-6 text-blue-400" />,
    title: "3. Booking Policy",
    id: "booking",
    content: (
      <ul className="space-y-1 list-disc list-inside">
        <li>All bookings are subject to availability.</li>
        <li>Payment must be completed within 15 minutes of reservation.</li>
        <li>Tickets are non-transferable unless specified otherwise.</li>
        <li>Age restrictions apply to certain movies.</li>
      </ul>
    )
  },
  {
    icon: <CreditCard className="w-6 h-6 text-purple-400" />,
    title: "4. Payment Terms",
    id: "payment",
    content: (
      <ul className="space-y-1 list-disc list-inside">
        <li>All payments are processed securely.</li>
        <li>Accepted payment methods are listed at checkout.</li>
        <li>Payment issues should be reported to support immediately.</li>
      </ul>
    )
  },
  {
    icon: <ArrowUp className="w-6 h-6 text-purple-400 transform rotate-180" />,
    title: "5. Cancellation Policy",
    id: "cancellation",
    content: (
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
        <ul className="space-y-1 list-disc list-inside">
          <li>Cancellations allowed up to 2 hours before showtime.</li>
          <li>Refunds processed within 3-5 business days.</li>
          <li>No-show bookings are non-refundable.</li>
          <li>Service fees may apply for cancellations.</li>
        </ul>
      </div>
    )
  },
  {
    icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
    title: "6. User Conduct",
    id: "conduct",
    content: (
      <ul className="space-y-1 list-disc list-inside">
        <li>Users must not engage in abusive or disruptive behavior.</li>
        <li>Illegal activities are strictly prohibited.</li>
        <li>Violation may result in account suspension.</li>
      </ul>
    )
  },
  {
    icon: <Lock className="w-6 h-6 text-blue-400" />,
    title: "7. Privacy Policy",
    id: "privacy",
    content: (
      <ul className="space-y-1 list-disc list-inside">
        <li>User data is handled in accordance with our Privacy Policy.</li>
        <li>Personal information is never sold to third parties.</li>
        <li>See our Privacy Policy page for full details.</li>
      </ul>
    )
  },
  {
    icon: <Shield className="w-6 h-6 text-purple-400" />,
    title: "8. Limitation of Liability",
    id: "liability",
    content: (
      <ul className="space-y-1 list-disc list-inside">
        <li>CineEntrada is not liable for indirect or consequential damages.</li>
        <li>Service is provided "as is" without warranties of any kind.</li>
        <li>See full terms for more information.</li>
      </ul>
    )
  }
]

const TermsOfService = () => {
  // Smooth scroll to section
  const scrollToSection = id => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="space-y-6 px-2 sm:px-0">
      {/* Table of Contents */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl p-4 sm:p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2 text-base sm:text-lg">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <span>Table of Contents</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-4">
          {sections.map((section, idx) => (
            <button
              key={section.id}
              onClick={() => scrollToSection(section.id)}
              className="text-left text-blue-300 hover:text-blue-200 transition-colors p-2 rounded-lg hover:bg-white/5 w-full text-sm sm:text-base"
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Terms Content */}
      <div className="space-y-10 text-gray-300 leading-relaxed">
        {sections.map((section, idx) => (
          <section key={section.id} id={section.id} className="scroll-mt-24">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-2 flex items-center space-x-2">
              {section.icon}
              <span>{section.title}</span>
            </h3>
            <div className="pl-1 sm:pl-3 text-sm sm:text-base">
              {section.content}
            </div>
          </section>
        ))}
      </div>

      <div className="text-center pt-6 border-t border-white/10">
        <p className="text-gray-400 text-xs sm:text-sm">Last updated: June 2025</p>
      </div>
    </div>
  )
}

export default TermsOfService