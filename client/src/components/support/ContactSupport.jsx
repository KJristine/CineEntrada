import React from 'react'
import { MessageCircle, Mail, Phone, Headphones, Zap } from 'lucide-react'

const ContactSupport = () => {
  const supportOptions = [
    {
      icon: MessageCircle,
      title: "Live Chat",
      desc: "Get instant help from our support team",
      action: "Start Chat",
      gradient: "from-green-500 to-emerald-600",
      available: false,
      onClick: () => {}
    },
    {
      icon: Mail,
      title: "Email Support", 
      desc: "Send us a detailed message",
      action: "Send Email",
      gradient: "from-blue-500 to-cyan-600",
      available: false,
      onClick: () => {}
    },
    {
      icon: Phone,
      title: "Phone Support",
      desc: "Speak directly with our team",
      action: "Call Now",
      gradient: "from-purple-500 to-pink-600", 
      available: false,
      onClick: () => {}
    },
    {
      icon: Headphones,
      title: "Premium Support",
      desc: "Priority assistance for VIP members",
      action: "Upgrade",
      gradient: "from-yellow-500 to-orange-600",
      available: false,
      onClick: () => {}
    }
  ]

  return (
    <div className="space-y-8">
      {/* Support Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {supportOptions.map((option, index) => (
          <div key={index} className="group relative overflow-hidden">
            <div className={`p-6 bg-gradient-to-br from-gray-500/10 to-gray-600/5 border border-gray-500/20 rounded-2xl transition-all duration-500 cursor-not-allowed`}>
              {/* Background Glow Effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${option.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 rounded-2xl`}></div>
              <div className="relative">
                <div className={`inline-flex p-4 bg-gradient-to-r ${option.gradient} bg-opacity-20 rounded-2xl mb-4`}>
                  <option.icon className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-500">
                  {option.title}
                  <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded-full">Coming Soon</span>
                </h3>
                <p className="mb-6 text-gray-500">
                  {option.desc}
                </p>
                <button 
                  disabled
                  className="w-full py-3 px-6 rounded-xl font-semibold bg-gray-600 cursor-not-allowed text-gray-400"
                >
                  {option.action}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/10 rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <span>Quick Actions</span>
          <span className="ml-2 text-xs bg-gray-600 px-2 py-1 rounded-full text-gray-200">Coming Soon</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            "Report Bug",
            "Feature Request", 
            "Billing Issue",
            "Account Help"
          ].map((action, index) => (
            <button key={index} className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-blue-500/30 transition-all duration-300 text-gray-300 hover:text-white text-sm">
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ContactSupport