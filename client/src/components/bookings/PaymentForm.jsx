import React, { useState } from 'react'
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'

const PaymentForm = ({ onSuccess, bookingData }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setError(null)
    if (!stripe || !elements) {
      setProcessing(false)
      setError("Stripe is not loaded.")
      return
    }

    // Save booking data to localStorage before redirect (for off-site payments)
    if (bookingData) {
      localStorage.setItem('pendingBooking', JSON.stringify(bookingData))
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin + '/my-bookings',
      },
      redirect: 'if_required'
    })
    if (error) {
      setError(error.message)
      setProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Remove pendingBooking if payment succeeded on-site
      localStorage.removeItem('pendingBooking')
      onSuccess()
      setProcessing(false)
    } else {
      setProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md mx-auto">
      <div className="mb-4">
        <span className="block text-lg font-bold text-gray-700 mb-2">Payment Details</span>
        <div className="flex gap-2 mb-2">
          <img src="https://img.icons8.com/color/32/000000/visa.png" alt="Visa" className="h-6" />
          <img src="https://img.icons8.com/color/32/000000/mastercard-logo.png" alt="Mastercard" className="h-6" />
        </div>
      </div>
      {/* Stripe PaymentElement with only card */}
      <PaymentElement
        options={{
          layout: "tabs",
          paymentMethodOrder: ['card'] // Only card payment enabled
        }}
      />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-bold mt-4 transition"
      >
        {processing ? "Processing..." : "Pay Now"}
      </button>
    </form>
  )
}

export default PaymentForm