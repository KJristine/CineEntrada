const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
  theater: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  seats: [{ type: String, required: true }],
  price: { type: Number, required: true }, // per-seat price
  total: { type: Number, required: true }, // total price (price * seats.length)
  status: {
    type: String,
    enum: ['confirmed', 'cancelled', 'pending'],
    default: 'confirmed'
  },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Booking", bookingSchema)