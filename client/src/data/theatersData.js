export const theatersData = [
  {
    id: 1,
    name: "SM Cinema IMAX",
    address: "SM Mall of Asia, Pasay City, Metro Manila",
    distance: "2.5 km",
    rating: 4.8,
    totalSeats: 520,
    amenities: ["IMAX", "Dolby Atmos", "Laser Projection", "Premium Seats"],
    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh7zpayFM6ouXW0Irvneqh1sETK_OcWN8BtMPlOqtz14GFrzS5-TG6emMGUPyQHwtC45tCQgnbEjpDytfAtD06pIz5WhhBTSS3SMvpTJHbFwQpyMp9L8qYDDegNWi2i12d0MChzLiSL-c-X/s1600/IMAX.jpg",
    phone: "+63 2 8556 0680",
    showtimes: [
      { time: "10:00 AM", price: 450 },
      { time: "1:30 PM", price: 450 },
      { time: "5:00 PM", price: 500 },
      { time: "8:30 PM", price: 500 },
      { time: "11:00 PM", price: 400 }
    ]
  },
  {
    id: 2,
    name: "Ayala Malls Cinema",
    address: "Greenbelt 3, Makati City, Metro Manila",
    distance: "4.2 km",
    rating: 4.7,
    totalSeats: 380,
    amenities: ["4DX", "Premium Loungers", "Concession Stand", "VIP Experience"],
    image: "https://images.summitmedia-digital.com/sap/images/2023/06/23/20230623-ayala-spot-mainimage2-1-1687514875.jpg",
    phone: "",
    showtimes: [
      { time: "11:00 AM", price: 380 },
      { time: "2:00 PM", price: 400 },
      { time: "6:00 PM", price: 420 },
      { time: "9:30 PM", price: 380 }
    ]
  },
  {
    id: 3,
    name: "Cinema '76 Film Society",
    address: "Anonas Street, Quezon City, Metro Manila",
    distance: "6.8 km",
    rating: 4.6,
    totalSeats: 180,
    amenities: ["Indie Films", "Art House", "Cafe & Bar", "Director Talks"],
    image: "https://www.tba.ph/wp-content/uploads/2023/03/IMG-c0b75ed9709758b02a295e51e16a5f86-V.jpg",
    phone: "+63 2 8374 6776",
    showtimes: [
      { time: "1:00 PM", price: 250 },
      { time: "4:00 PM", price: 250 },
      { time: "7:00 PM", price: 300 },
      { time: "9:45 PM", price: 300 }
    ]
  },
  {
    id: 4,
    name: "Newport Cinemas",
    address: "Resorts World Manila, Pasay City",
    distance: "3.1 km",
    rating: 4.9,
    totalSeats: 450,
    amenities: ["IMAX", "Reclining Seats", "Gourmet Dining", "Valet Parking"],
    image: "https://www.newportworldresorts.com/sites/default/files/styles/large/public/2024-11/image4_0.jpg.webp",
    phone: "+63 2 8908 8833",
    showtimes: [
      { time: "9:30 AM", price: 520 },
      { time: "1:00 PM", price: 520 },
      { time: "4:30 PM", price: 600 },
      { time: "8:00 PM", price: 600 },
      { time: "11:30 PM", price: 480 }
    ]
  },
  {
    id: 5,
    name: "Power Plant Cinema",
    address: "Power Plant Mall, Rockwell, Makati City",
    distance: "5.5 km",
    rating: 4.5,
    totalSeats: 280,
    amenities: ["Digital Projection", "Surround Sound", "Premium Snacks", "Reserved Seating"],
    image: "https://images.summitmedia-digital.com/spotph/images/2019/05/30/power-plant-cinemas-1559153520.jpg",
    phone: "+63 2 8898 7700",
    showtimes: [
      { time: "12:00 PM", price: 350 },
      { time: "3:30 PM", price: 350 },
      { time: "7:00 PM", price: 400 },
      { time: "10:15 PM", price: 400 }
    ]
  },
  {
    id: 6,
    name: "Robinson's Movieworld",
    address: "Robinson's Place Manila, Ermita, Manila",
    distance: "3.8 km",
    rating: 4.4,
    totalSeats: 320,
    amenities: ["Stadium Seating", "Digital Sound", "Snack Bar", "Family Friendly"],
    image: "https://www.robinsonsmovieworld.com/bookingcms/Images/cinema%20ad_635155511180417732.jpg",
    phone: "+63 2 8524 4361",
    showtimes: [
      { time: "10:30 AM", price: 280 },
      { time: "2:15 PM", price: 280 },
      { time: "6:00 PM", price: 320 },
      { time: "9:00 PM", price: 320 }
    ]
  }
]

// Helper functions for theater data
export const getTheaterById = (id) => {
  return theatersData.find(theater => theater.id === id)
}

export const getTheatersByAmenity = (amenity) => {
  return theatersData.filter(theater => 
    theater.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase()))
  )
}

export const getTheatersByDistance = (maxDistance) => {
  return theatersData.filter(theater => {
    const distance = parseFloat(theater.distance.replace(' km', ''))
    return distance <= maxDistance
  })
}

export const getTheatersByRating = (minRating) => {
  return theatersData.filter(theater => theater.rating >= minRating)
}

export const getTheatersByPriceRange = (minPrice, maxPrice) => {
  return theatersData.filter(theater => {
    // Use the minimum price among showtimes for filtering
    const minShowtimePrice = Math.min(...theater.showtimes.map(s => s.price))
    return minShowtimePrice >= minPrice && minShowtimePrice <= maxPrice
  })
}

export const getTheaterStats = () => {
  return {
    totalTheaters: theatersData.length,
    avgRating: (theatersData.reduce((sum, theater) => sum + theater.rating, 0) / theatersData.length).toFixed(1),
    totalSeats: theatersData.reduce((sum, theater) => sum + theater.totalSeats, 0),
    imaxTheaters: theatersData.filter(theater => 
      theater.amenities.some(amenity => amenity.toLowerCase().includes('imax'))
    ).length
  }
}