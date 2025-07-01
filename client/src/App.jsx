import React from 'react'
import Navbar from './components/Navbar'
import AdminNavbar from './components/admin/Navbar'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import MovieDetails from './components/movies/MovieDetails'
import Footer from './components/Footer'
import TheatersSection from './pages/TheatersSection'
import MyBookings from './pages/MyBookings'
import AddMovies from './pages/admin/AddMovies'
import Dashboard from './pages/admin/Dashboard'
import ListMovies from './pages/admin/ListMovies'
import ListBookings from './pages/admin/ListBookings'

const App = () => {
  const isAdminRoute = useLocation().pathname.startsWith('/admin')

  return (
    <>
      <Toaster />
      {isAdminRoute ? <AdminNavbar /> : <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/movie/:id' element={<MovieDetails />} />
        <Route path='/theaters' element={<TheatersSection />} />
        <Route path='/my-bookings' element={<MyBookings />} />

        {/* Admin routes */}
        <Route path='/admin' element={<Dashboard />} />
        <Route path="/admin/add-movie" element={<AddMovies />} />
        <Route path="/admin/add-movie/:id" element={<AddMovies />} />
        <Route path='/admin/list-movies' element={<ListMovies />} />
        <Route path='/admin/list-bookings' element={<ListBookings />} />
      </Routes>
      {!isAdminRoute && <Footer />}
    </>
  )
}

export default App