const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const Booking = require("./models/Booking")
const Movie = require('./models/Movie')
const Stripe = require("stripe")
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err))

// Create booking with seat occupation check and price/total calculation
app.post("/api/bookings", async (req, res) => {
  try {
    const { movie, theater, date, time, seats, price } = req.body

    // Check if any of the requested seats are already booked for this show
    const conflict = await Booking.findOne({
      movie,
      theater,
      date,
      time,
      seats: { $in: seats }
    })

    if (conflict) {
      return res.status(409).json({ success: false, error: "One or more seats are already occupied." })
    }

    // --- FIX: If price is missing or 0, fetch from movie showtime ---
    let numericPrice = price
    if (!numericPrice || isNaN(Number(numericPrice))) {
      // Fetch movie and showtime price
      const movieDoc = await Movie.findById(movie)
      if (movieDoc && Array.isArray(movieDoc.showtimes)) {
        const showtimeObj = movieDoc.showtimes.find(st => st.time === time)
        if (showtimeObj && showtimeObj.price) {
          numericPrice = Number(showtimeObj.price)
        }
      }
    } else if (typeof numericPrice === "string") {
      numericPrice = Number(numericPrice.replace(/[^\d.]/g, ""))
    }
    if (isNaN(numericPrice)) numericPrice = 0

    // Calculate total price on the backend for safety
    const total = numericPrice * (seats?.length || 0)

    // If still no price, reject booking
    if (!numericPrice || !total) {
      return res.status(400).json({ success: false, error: "Invalid price or total. Please try again." })
    }

    const booking = new Booking({
      ...req.body,
      price: numericPrice, // per-seat price as number
      total  // total price
    })
    await booking.save()
    res.status(201).json({ success: true, booking })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Get all bookings (with movie populated)
app.get("/api/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate('movie') // Only populate movie, not theater
    res.json(bookings)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Cancel (mark as cancelled) a booking by ID
app.patch('/api/bookings/:id/cancel', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    )
    if (!booking) {
      return res.status(404).json({ success: false, error: 'Booking not found' })
    }
    res.json({ success: true, booking })
  } catch (err) {
    res.status(500).json({ success: false, error: err.message })
  }
})

// Stripe payment intent
app.post("/api/create-payment-intent", async (req, res) => {
  const { amount } = req.body
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount, // in cents
      currency: "usd",
      payment_method_types: ["card"]
    })
    res.send({ clientSecret: paymentIntent.client_secret })
  } catch (err) {
    res.status(500).send({ error: err.message })
  }
})

// Add a new movie
app.post('/api/movies', async (req, res) => {
  try {
    const { title, description, poster, backdrop, year, duration, genre, studio, rating, trailer, showtimes } = req.body
    // All fields required except showtimes
    if (!title || !description || !poster || !backdrop || !year || !duration || !genre || !studio || !rating || !trailer) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }

    const randomPrice = () => Math.floor(Math.random() * 251) + 250

    const defaultShowtimes = [
      { time: '2:00 PM', totalSeats: 45, price: randomPrice() },
      { time: '5:30 PM', totalSeats: 23, price: randomPrice() },
      { time: '8:00 PM', totalSeats: 12, price: randomPrice() },
      { time: '10:45 PM', totalSeats: 67, price: randomPrice() }
    ]

    const showtimesToSave = (showtimes && showtimes.length > 0 ? showtimes : defaultShowtimes).map(st => ({
      ...st,
      price: typeof st.price === "string" ? Number(st.price.replace(/[^\d.]/g, "")) : st.price
    }))

    const movie = new Movie({
      title,
      description,
      poster,
      backdrop,
      year,
      duration,
      genre,
      studio,
      rating,
      trailer,
      showtimes: showtimesToSave
    })
    await movie.save()
    res.status(201).json(movie)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get all movies (admin: show all, including scheduled/inactive)
app.get('/api/movies', async (req, res) => {
  try {
    // Return all movies for admin, including scheduled/inactive
    const movies = await Movie.find().sort({ createdAt: -1 })
    res.json(movies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Public endpoint: only show movies that are active or scheduled and now live
app.get('/api/movies/active', async (req, res) => {
  try {
    const now = new Date()
    const movies = await Movie.find({
      $or: [
        { isActive: true },
        { isActive: false, scheduledAt: { $lte: now } }
      ]
    }).sort({ createdAt: -1 })
    res.json(movies)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Get a single movie by ID, including real available seats for each showtime
app.get('/api/movies/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid movie ID' })
    }

    const movie = await Movie.findById(req.params.id).lean()
    if (!movie) return res.status(404).json({ error: 'Movie not found' })

    const bookings = await Booking.find({ movie: movie._id })
    movie.showtimes = Array.isArray(movie.showtimes)
      ? movie.showtimes.map(show => {
          const bookedSeats = bookings
            .filter(b => b.time === show.time)
            .reduce((acc, b) => acc + (b.seats ? b.seats.length : 0), 0)
          return {
            ...show,
            available: Math.max(0, (show.totalSeats || 0) - bookedSeats)
          }
        })
      : []

    res.json(movie)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Update a movie
app.put('/api/movies/:id', async (req, res) => {
  try {
    const { title, description, poster, backdrop, year, duration, genre, studio, rating, trailer } = req.body
    // All fields required except showtimes
    if (!title || !description || !poster || !backdrop || !year || !duration || !genre || !studio || !rating || !trailer) {
      return res.status(400).json({ error: 'Missing required fields.' })
    }
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!movie) return res.status(404).json({ error: 'Movie not found' })
    res.json(movie)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Delete a movie
app.delete('/api/movies/:id', async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id)
    if (!movie) return res.status(404).json({ error: 'Movie not found' })
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Set movie status or schedule activation
app.put('/api/movies/:id/status', async (req, res) => {
  try {
    const { isActive, scheduledAt } = req.body
    const update = { isActive }
    if (scheduledAt) update.scheduledAt = scheduledAt
    else update.scheduledAt = null
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    )
    res.json(movie)
  } catch (err) {
    res.status(500).json({ error: 'Failed to update movie status.' })
  }
})

// Get total user count from Clerk (fixed for correct count)
app.get('/api/users/count', async (req, res) => {
  try {
    const response = await fetch('https://api.clerk.com/v1/users?limit=1', {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    res.json({ count: data.total_count || (Array.isArray(data) ? data.length : 0) })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))