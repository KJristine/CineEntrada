import React from 'react'
import { Shield, Search, Lock } from 'lucide-react'

const PrivacyPolicy = () => {
  return (
    <div className="space-y-6">
      {/* Privacy Overview */}
      <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-white/10 rounded-2xl p-6">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-green-500/20 rounded-xl">
            <Shield className="w-8 h-8 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Your Privacy Matters</h3>
            <p className="text-gray-300 text-sm">
              We are committed to protecting your personal information and being transparent about how we use it.
            </p>
          </div>
        </div>
      </div>

      {/* Privacy Sections */}
      <div className="space-y-6 text-gray-300 leading-relaxed">
        <section>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <Search className="w-6 h-6 text-blue-400" />
            <span>Information We Collect</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: "Personal Data", items: ["Name", "Email", "Phone", "Date of Birth"] },
              { title: "Payment Info", items: ["Credit Card", "Billing Address", "Transaction History"] },
              { title: "Usage Data", items: ["Browsing History", "Preferences", "Device Info"] }
            ].map((category, index) => (
              <div key={index} className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <h4 className="text-white font-medium mb-3">{category.title}</h4>
                <ul className="space-y-1 text-sm">
                  {category.items.map((item, idx) => (
                    <li key={idx} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-bold text-white mb-4 flex items-center space-x-2">
            <Lock className="w-6 h-6 text-green-400" />
            <span>How We Protect Your Data</span>
          </h3>
          <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-white font-medium mb-3">Security Measures</h4>
                <ul className="space-y-2 text-sm">
                  <li>• End-to-end encryption</li>
                  <li>• Secure data centers</li>
                  <li>• Regular security audits</li>
                  <li>• Two-factor authentication</li>
                </ul>
              </div>
              <div>
                <h4 className="text-white font-medium mb-3">Your Rights</h4>
                <ul className="space-y-2 text-sm">
                  <li>• Access your data</li>
                  <li>• Correct inaccuracies</li>
                  <li>• Delete your account</li>
                  <li>• Data portability</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="text-center pt-6 border-t border-white/10">
        <p className="text-gray-400 text-sm">
          Questions about privacy? Contact us at <span className="text-blue-400">privacy@cine-entrada.ph</span>
        </p>
      </div>
    </div>
  )
}

export default PrivacyPolicy