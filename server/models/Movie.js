const mongoose = require('mongoose')

const MovieSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  description:  { type: String, required: true },
  poster:       { type: String, required: true },
  backdrop:     { type: String, required: true },
  year:         { type: String, required: true },
  duration:     { type: String, required: true },
  genre:        { type: String, required: true },
  studio:       { type: String, required: true },
  rating:       { type: String, required: true },
  trailer:      { type: String, required: true },
  showtimes: [
    {
      time:       { type: String, required: true },
      totalSeats: { type: Number, default: 50 }, // Not required, has default
      price:      { type: Number, required: true }
    }
  ],
  isActive:    { type: Boolean, default: true }, // Not required, has default
  scheduledAt: { type: Date, default: null }     // Not required, can be null
}, { timestamps: true })

module.exports = mongoose.model('Movie', MovieSchema)