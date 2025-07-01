import React, { useState, useEffect } from 'react';
import { Clock, Ticket, CheckCircle, Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { theatersData } from '../../data/theatersData';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './PaymentForm';

const API_URL = import.meta.env.VITE_API_URL;
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const seatLayout = [
  { row: 'A', seats: 7 },
  { row: 'B', seats: 9 },
  { row: 'C', seats: 10 },
  { row: 'D', seats: 7 },
  { row: 'E', seats: 8 },
];

function getRowSeats(row, seats) {
  return Array.from({ length: seats }, (_, i) => `${row}${i + 1}`);
}

const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

const CustomDatePicker = ({ value, onChange, min }) => {
  const [isOpen, setIsOpen] = useState(false);
  const today = new Date();
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [viewYear, setViewYear] = useState(today.getFullYear());

  const selected = value ? new Date(value) : today;

  const handleSelect = (date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    onChange(`${yyyy}-${mm}-${dd}`);
    setIsOpen(false);
  };

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();
  const minDate = min ? new Date(min) : today;

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(viewYear, viewMonth, d));

  return (
    <div className="relative w-full">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-black/60 via-pink-950/60 to-gray-900/60 border-2 border-pink-700/30 text-pink-100 font-semibold shadow-lg flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 hover:border-pink-400 hover:bg-pink-900/30 text-sm sm:text-base"
      >
        <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5 text-pink-300 mr-2 sm:mr-3" />
        <span className={`flex-1 text-left ${value ? 'text-white' : 'text-pink-300/50'}`}>
          {value ? new Date(value).toLocaleDateString(undefined, { dateStyle: 'medium' }) : 'Select a date'}
        </span>
        <ChevronDown className={`w-4 h-4 text-pink-300 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-[100]" onClick={() => setIsOpen(false)} />
          <div className="absolute left-0 right-0 mt-2 z-[101] bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-pink-300/20 shadow-2xl overflow-hidden animate-fadeIn max-w-full sm:max-w-md mx-auto">
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <button
                  onClick={() => {
                    if (viewMonth === 0) {
                      setViewMonth(11);
                      setViewYear(y => y - 1);
                    } else {
                      setViewMonth(m => m - 1);
                    }
                  }}
                  className="px-2 py-1 rounded hover:bg-pink-900/30 text-pink-200 text-sm sm:text-base"
                  aria-label="Previous month"
                >
                  ‹
                </button>
                <span className="font-bold text-pink-100 text-sm sm:text-lg flex items-center gap-2">
                  {new Date(viewYear, viewMonth).toLocaleString(undefined, { month: 'long', year: 'numeric' })}
                </span>
                <button
                  onClick={() => {
                    if (viewMonth === 11) {
                      setViewMonth(0);
                      setViewYear(y => y + 1);
                    } else {
                      setViewMonth(m => m + 1);
                    }
                  }}
                  className="px-2 py-1 rounded hover:bg-pink-900/30 text-pink-200 text-sm sm:text-base"
                  aria-label="Next month"
                >
                  ›
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <span key={d} className="text-xs text-pink-300 font-semibold">{d}</span>
                ))}
                {days.map((date, i) =>
                  date ? (
                    <button
                      key={i}
                      onClick={() => handleSelect(date)}
                      disabled={date < minDate}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm font-semibold transition-all
                        ${date.toDateString() === selected.toDateString() ? 'bg-pink-600/80 text-white shadow-lg' : ''}
                        ${date < minDate ? 'text-gray-500 cursor-not-allowed' : 'text-pink-100 hover:bg-pink-900/40'}
                      `}
                    >
                      {date.getDate()}
                    </button>
                  ) : (
                    <span key={i} />
                  )
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const SeatIcon = ({ status }) => {
  let color = '#d1d5db';
  if (status === 'reserved') color = '#ef4444';
  if (status === 'selected') color = '#22d3ee';
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" className="block sm:w-6 sm:h-6 lg:w-9 lg:h-9">
      <rect x="4" y="10" width="24" height="12" rx="4" fill={color} />
      <rect x="7" y="22" width="6" height="4" rx="2" fill={color} />
      <rect x="19" y="22" width="6" height="4" rx="2" fill={color} />
    </svg>
  );
};

const BookingModal = ({
  show,
  onClose,
  selectedMovie: selectedMovieProp,
  selectedTheater: selectedTheaterProp,
}) => {
  const [step, setStep] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth < 640);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  const [movies, setMovies] = useState([]);
  useEffect(() => {
    fetch(`${API_URL}/api/movies/active`)
      .then(res => res.json())
      .then(setMovies);
  }, []);

  const [selectedMovie, setSelectedMovie] = useState(selectedMovieProp || '');
  const [selectedTheater, setSelectedTheater] = useState(selectedTheaterProp || '');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedMovieProp) setSelectedMovie(selectedMovieProp);
  }, [selectedMovieProp]);
  useEffect(() => {
    if (selectedTheaterProp) setSelectedTheater(selectedTheaterProp);
  }, [selectedTheaterProp]);

  const movieObj = movies.find(m => m._id === selectedMovie);
  const moviesInTheater = selectedTheater
    ? movies.filter(movie =>
        theatersData.find(
          t => t.name === selectedTheater && t.movies && t.movies.includes(movie.title)
        )
      )
    : movies;

  const theatersShowingMovie = selectedMovie
    ? theatersData.filter(theater =>
        theater.movies && movieObj && theater.movies.includes(movieObj.title)
      )
    : theatersData;

  const selectedShowtimeObj = movieObj?.showtimes?.find(
    s => (typeof s === 'object' ? s.time === selectedTime : s === selectedTime)
  );
  let ticketPrice = 10;
  if (selectedShowtimeObj && typeof selectedShowtimeObj === 'object' && selectedShowtimeObj.price) {
    ticketPrice = typeof selectedShowtimeObj.price === 'string'
      ? Number(selectedShowtimeObj.price.replace(/[^\d.]/g, ''))
      : Number(selectedShowtimeObj.price);
  }

  useEffect(() => {
    const fetchOccupiedSeats = async () => {
      if (!selectedMovie || !selectedTheater || !selectedDate || !selectedTime) {
        setOccupiedSeats([]);
        return;
      }
      try {
        const res = await fetch('/api/bookings');
        const bookings = await res.json();
        const showBookings = bookings.filter(
          b =>
            (b.movie === selectedMovie || b.movie?._id === selectedMovie) &&
            b.theater === selectedTheater &&
            b.date === selectedDate &&
            b.time === selectedTime
        );
        const occ = showBookings.flatMap(b => b.seats);
        setOccupiedSeats(occ);
      } catch (err) {
        setOccupiedSeats([]);
      }
    };
    fetchOccupiedSeats();
  }, [selectedMovie, selectedTheater, selectedDate, selectedTime]);

  const toggleSeat = (seat) => {
    if (!selectedMovie || !selectedTheater || !selectedTime) {
      setWarning('Please select a movie, theater, and showtime first.');
      return;
    }
    setWarning('');
    setSelectedSeats(prev => {
      if (prev.includes(seat)) {
        return prev.filter(s => s !== seat);
      } else if (prev.length < 5) {
        return [...prev, seat];
      } else {
        setWarning('You can only book up to 5 tickets per transaction.');
        return prev;
      }
    });
  };

  useEffect(() => {
    if (
      (showPayment && !isSmallScreen && selectedSeats.length > 0 && ticketPrice) ||
      (isSmallScreen && step === 2 && selectedSeats.length > 0 && ticketPrice)
    ) {
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: selectedSeats.length * ticketPrice * 100 }),
      })
        .then(res => res.json())
        .then(data => setClientSecret(data.clientSecret));
    }
  }, [showPayment, isSmallScreen, step, selectedSeats, ticketPrice]);

  const handleSuccessClose = () => {
    setShowSuccess(false);
    if (onClose) onClose();
    navigate('/my-bookings');
  };

  let minPrice = null;
  if (selectedMovie && selectedTheater) {
    if (movieObj && Array.isArray(movieObj.showtimes)) {
      minPrice = Math.min(
        ...movieObj.showtimes
          .map(st =>
            typeof st.price === 'string'
              ? Number(st.price.replace(/[^\d.]/g, ''))
              : Number(st.price)
          )
          .filter(p => !isNaN(p) && p > 0)
      );
      if (!isFinite(minPrice)) minPrice = null;
    }
  }

  const canGoNext =
    step === 0
      ? selectedMovie && selectedTheater && selectedDate && selectedTime
      : step === 1
      ? selectedSeats.length > 0
      : true;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-2 sm:px-4">
      <div
        className={`relative bg-gradient-to-br from-gray-900 via-gray-950 to-black rounded-2xl sm:rounded-3xl shadow-2xl border border-pink-900/30 w-full max-w-[98vw] sm:max-w-5xl mx-auto overflow-hidden flex flex-col md:flex-row max-h-[90vh] animate-fadeIn`}
      >
        {/* Stepper for small screens */}
        {isSmallScreen && (
          <div className="w-full flex items-center justify-center gap-2 py-2 bg-black/30 border-b border-pink-900/20">
            <div className={`w-3 h-3 rounded-full ${step === 0 ? 'bg-pink-500' : 'bg-pink-900'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-pink-500' : 'bg-pink-900'}`} />
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-pink-500' : 'bg-pink-900'}`} />
          </div>
        )}

        {/* Responsive content */}
        <div className="flex-1 w-full overflow-y-auto max-h-[90vh]">
          {/* --- DESKTOP: Two columns side by side --- */}
          {!isSmallScreen && (
            <div className="flex flex-row h-full">
              {/* Left: Movie/Theater/Date/Showtime */}
              <div className="md:w-1/3 w-full p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-pink-900/30 to-transparent border-r border-pink-900/20 flex flex-col items-center">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-4 sm:mb-6 text-center w-full">Choose Movie & Theater</h3>
                <div className="w-full space-y-4">
                  <div>
                    <span className="text-xs sm:text-sm text-pink-200 font-semibold mb-2 block">Pick a Movie</span>
                    <select
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-gradient-to-r from-black/60 via-pink-950/60 to-gray-900/60 border-2 border-pink-700/30 text-pink-100 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 hover:border-pink-400 hover:bg-pink-900/30 appearance-none text-sm sm:text-base"
                      value={selectedMovie}
                      onChange={e => {
                        setSelectedMovie(e.target.value);
                        if (!selectedTheaterProp) {
                          setSelectedTheater('');
                        }
                        setSelectedTime('');
                      }}
                    >
                      <option value="">Select a movie...</option>
                      {moviesInTheater.map(movie => (
                        <option key={movie._id} value={movie._id}>{movie.title}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-pink-200 font-semibold mb-2 block">Pick a Theater</span>
                    <select
                      className="w-full pl-3 pr-8 py-2 rounded-xl bg-gradient-to-r from-black/60 via-pink-950/60 to-gray-900/60 border-2 border-pink-700/30 text-pink-100 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 hover:border-pink-400 hover:bg-pink-900/30 appearance-none text-sm sm:text-base"
                      value={selectedTheater}
                      onChange={e => {
                        setSelectedTheater(e.target.value);
                        setSelectedTime('');
                      }}
                      disabled={!!selectedTheaterProp}
                    >
                      <option value="">Select a theater...</option>
                      {theatersShowingMovie.map(theater => (
                        <option key={theater.id} value={theater.name}>{theater.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-pink-200 font-semibold mb-2 block">Pick a Date</span>
                    <CustomDatePicker
                      value={selectedDate}
                      onChange={setSelectedDate}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm text-pink-200 font-semibold mb-2 block">Pick a Showtime</span>
                    <div className="flex flex-col gap-2 w-full">
                      {movieObj?.showtimes?.map(st => (
                        <button
                          key={typeof st === 'object' ? st.time : st}
                          onClick={() => setSelectedTime(typeof st === 'object' ? st.time : st)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 text-left text-sm sm:text-base ${
                            selectedTime === (typeof st === 'object' ? st.time : st)
                              ? 'bg-pink-600/30 border-pink-400 text-pink-200 font-bold'
                              : 'bg-black/30 border-pink-900/30 text-gray-200 hover:bg-pink-900/20'
                          }`}
                        >
                          <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                          <span>
                            {typeof st === 'object' ? st.time : st}
                            {typeof st === 'object' && st.price ? (
                              <span className="ml-2 text-xs text-pink-300">₱{typeof st.price === 'string' ? Number(st.price.replace(/[^\d.]/g, '')) : st.price}</span>
                            ) : null}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/* Right: Seat Picker */}
              <div className="md:w-2/3 flex-1 w-full p-4 sm:p-6 lg:p-8 flex flex-col items-center relative">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 text-white text-center w-full">Select your seat</h3>
                {!selectedTime && (
                  <div className="mb-3 text-pink-200 font-semibold text-sm sm:text-base lg:text-lg">
                    {minPrice ? (
                      <>
                        <span className="font-bold text-white">Starts with ₱{minPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> per seat
                      </>
                    ) : (
                      <span className="font-bold text-white">Select a showtime to see ticket price</span>
                    )}
                  </div>
                )}
                {selectedTime && (
                  <div className="mb-3 text-pink-200 font-semibold text-sm sm:text-base lg:text-lg">
                    <span className="font-bold text-white">₱{ticketPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> per seat
                  </div>
                )}
                {warning && (
                  <div className="mb-3 text-pink-300 font-semibold bg-pink-900/30 px-3 py-2 rounded text-sm sm:text-base">
                    {warning}
                  </div>
                )}
                <div className="w-full flex flex-col items-center">
                  <svg width="100%" height="40" viewBox="0 0 300 40" className="mb-2 lg:mb-4" style={{ maxWidth: '800px' }}>
                    <path d="M10 38 Q150 0 290 38" stroke="#f43f5e" strokeWidth="3" fill="none" />
                  </svg>
                  <span className="text-xs text-gray-400 mb-2 tracking-widest">SCREEN</span>
                  <div className="flex flex-col gap-3 mb-2 lg:mb-4 w-full max-w-[98%] sm:max-w-3xl items-center">
                    {seatLayout.map(({ row, seats }, idx) => (
                      <div key={row} className="flex items-center justify-center gap-2 sm:gap-3 lg:gap-6">
                        {getRowSeats(row, seats).map(seat => {
                          const isOccupied = occupiedSeats.includes(seat);
                          const isSelected = selectedSeats.includes(seat);
                          let status = 'available';
                          if (isOccupied) status = 'reserved';
                          if (isSelected) status = 'selected';
                          return (
                            <button
                              key={seat}
                              onClick={() => !isOccupied && toggleSeat(seat)}
                              disabled={isOccupied}
                              className="focus:outline-none bg-transparent border-none p-0 m-0"
                              style={{ margin: '0 4px' }}
                              aria-label={`Seat ${seat} ${isOccupied ? 'reserved' : isSelected ? 'selected' : 'available'}`}
                            >
                              <SeatIcon status={status} />
                            </button>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-4 mb-2 text-xs sm:text-sm flex-wrap justify-center">
                    <div className="flex items-center gap-1">
                      <SeatIcon status="available" />
                      <span className="text-gray-300">Available</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SeatIcon status="reserved" />
                      <span className="text-red-400">Reserved</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <SeatIcon status="selected" />
                      <span className="text-cyan-400">Selected</span>
                    </div>
                  </div>
                  {selectedSeats.length > 0 && selectedMovie && selectedTheater && selectedTime && (
                    <div className="text-pink-300 font-bold text-sm sm:text-base lg:text-lg mb-2">
                      Total: <span className="text-white">₱{(selectedSeats.length * ticketPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                  )}
                  {!showPayment && (
                    <button
                      disabled={!selectedMovie || !selectedTheater || !selectedTime || selectedSeats.length === 0 || loading}
                      className={`mt-4 px-6 py-2 sm:px-8 sm:py-3 rounded-full bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-sm sm:text-base lg:text-lg shadow-xl flex items-center gap-2 transition-all
                        ${!selectedMovie || !selectedTheater || !selectedTime || selectedSeats.length === 0 || loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl'}
                      `}
                      onClick={() => setShowPayment(true)}
                    >
                      Proceed to Checkout <Ticket className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  )}
                  <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition text-xl sm:text-2xl"
                    onClick={onClose}
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* --- MOBILE: Stepper logic --- */}
          {isSmallScreen && (
            <>
              {/* Step 6: Movie/Theater/Date/Showtime */}
              {step === 0 && (
                <div className="w-full p-3 sm:p-4 flex flex-col items-center">
                  <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4 text-center w-full">Choose Movie & Theater</h3>
                  <div className="w-full space-y-3">
                    <div>
                      <span className="text-xs text-pink-200 font-semibold mb-2 block">Pick a Movie</span>
                      <select
                        className="w-full pl-3 pr-8 py-2 rounded-xl bg-gradient-to-r from-black/60 via-pink-950/60 to-gray-900/60 border-2 border-pink-700/30 text-pink-100 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 hover:border-pink-400 hover:bg-pink-900/30 appearance-none text-sm"
                        value={selectedMovie}
                        onChange={e => {
                          setSelectedMovie(e.target.value);
                          if (!selectedTheaterProp) {
                            setSelectedTheater('');
                          }
                          setSelectedTime('');
                        }}
                      >
                        <option value="">Select a movie...</option>
                        {moviesInTheater.map(movie => (
                          <option key={movie._id} value={movie._id}>{movie.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-xs text-pink-200 font-semibold mb-2 block">Pick a Theater</span>
                      <select
                        className="w-full pl-3 pr-8 py-2 rounded-xl bg-gradient-to-r from-black/60 via-pink-950/60 to-gray-900/60 border-2 border-pink-700/30 text-pink-100 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300 hover:border-pink-400 hover:bg-pink-900/30 appearance-none text-sm"
                        value={selectedTheater}
                        onChange={e => {
                          setSelectedTheater(e.target.value);
                          setSelectedTime('');
                        }}
                        disabled={!!selectedTheaterProp}
                      >
                        <option value="">Select a theater...</option>
                        {theatersShowingMovie.map(theater => (
                          <option key={theater.id} value={theater.name}>{theater.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <span className="text-xs text-pink-200 font-semibold mb-2 block">Pick a Date</span>
                      <CustomDatePicker
                        value={selectedDate}
                        onChange={setSelectedDate}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div>
                      <span className="text-xs text-pink-200 font-semibold mb-2 block">Pick a Showtime</span>
                      <div className="flex flex-col gap-2 w-full">
                        {movieObj?.showtimes?.map(st => (
                          <button
                            key={typeof st === 'object' ? st.time : st}
                            onClick={() => setSelectedTime(typeof st === 'object' ? st.time : st)}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg border transition-all duration-200 text-left text-sm ${
                              selectedTime === (typeof st === 'object' ? st.time : st)
                                ? 'bg-pink-600/30 border-pink-400 text-pink-200 font-bold'
                                : 'bg-black/30 border-pink-900/30 text-gray-200 hover:bg-pink-900/20'
                            }`}
                          >
                            <Clock className="w-4 h-4" />
                            <span>
                              {typeof st === 'object' ? st.time : st}
                              {typeof st === 'object' && st.price ? (
                                <span className="ml-2 text-xs text-pink-300">₱{typeof st.price === 'string' ? Number(st.price.replace(/[^\d.]/g, '')) : st.price}</span>
                              ) : null}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      className={`mt-3 w-full px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-sm sm:text-base shadow-xl transition-all ${!canGoNext ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl'}`}
                      disabled={!canGoNext}
                      onClick={() => setStep(1)}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
              {/* Step 7: Seat Picker */}
              {step === 1 && (
                <div className="w-full p-3 sm:p-4 flex flex-col items-center relative">
                  <h3 className="text-base sm:text-lg font-bold mb-2 text-white text-center w-full">Select your seat</h3>
                  {!selectedTime && (
                    <div className="mb-3 text-pink-200 font-semibold text-sm">
                      {minPrice ? (
                        <>
                          <span className="font-bold text-white">Starts with ₱{minPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> per seat
                        </>
                      ) : (
                        <span className="font-bold text-white">Select a showtime to see ticket price</span>
                      )}
                    </div>
                  )}
                  {selectedTime && (
                    <div className="mb-3 text-pink-200 font-semibold text-sm">
                      <span className="font-bold text-white">₱{ticketPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span> per seat
                    </div>
                  )}
                  {warning && (
                    <div className="mb-3 text-pink-300 font-semibold bg-pink-900/30 px-3 py-2 rounded text-sm">
                      {warning}
                    </div>
                  )}
                  <div className="w-full flex flex-col items-center">
                    <svg width="80%" height="24" viewBox="0 0 300 24" className="mb-1">
                      <path d="M10 22 Q150 0 290 22" stroke="#f43f5e" strokeWidth="3" fill="none" />
                    </svg>
                    <span className="text-xs text-gray-400 mb-2 tracking-widest">SCREEN</span>
                    <div className="flex flex-col gap-2 mb-4 w-full max-w-[90%] items-center">
                      {seatLayout.map(({ row, seats }, idx) => (
                        <div key={row} className="flex items-center justify-center gap-1 sm:gap-2">
                          {getRowSeats(row, seats).map(seat => {
                            const isOccupied = occupiedSeats.includes(seat);
                            const isSelected = selectedSeats.includes(seat);
                            let status = 'available';
                            if (isOccupied) status = 'reserved';
                            if (isSelected) status = 'selected';
                            return (
                              <button
                                key={seat}
                                onClick={() => !isOccupied && toggleSeat(seat)}
                                disabled={isOccupied}
                                className="focus:outline-none bg-transparent border-none p-0 m-0"
                                style={{ margin: '0 2px' }}
                                aria-label={`Seat ${seat} ${isOccupied ? 'reserved' : isSelected ? 'selected' : 'available'}`}
                              >
                                <SeatIcon status={status} />
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-4 mb-2 text-xs flex-wrap justify-center">
                      <div className="flex items-center gap-1">
                        <SeatIcon status="available" />
                        <span className="text-gray-300">Available</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SeatIcon status="reserved" />
                        <span className="text-red-400">Reserved</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <SeatIcon status="selected" />
                        <span className="text-cyan-400">Selected</span>
                      </div>
                    </div>
                    {selectedSeats.length > 0 && selectedMovie && selectedTheater && selectedTime && (
                      <div className="text-pink-300 font-bold text-sm mb-2">
                        Total: <span className="text-white">₱{(selectedSeats.length * ticketPrice).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex w-full gap-2 mt-2">
                      <button
                        className="w-1/2 px-3 py-2 rounded-xl bg-gradient-to-r from-gray-700 to-gray-900 text-white font-bold text-sm shadow transition-all hover:scale-105"
                        onClick={() => setStep(0)}
                      >
                        Back
                      </button>
                      <button
                        className={`w-1/2 px-3 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-pink-600 text-white font-bold text-sm shadow-xl transition-all ${selectedSeats.length === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-2xl'}`}
                        disabled={selectedSeats.length === 0}
                        onClick={() => setStep(2)}
                      >
                        Next
                      </button>
                    </div>
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-white transition text-xl"
                      onClick={onClose}
                      aria-label="Close"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}
              {/* Step 8: Payment */}
              {step === 2 && (
                <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm px-2">
                  <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/30 rounded-2xl shadow-2xl p-4 sm:p-6 max-w-[98vw] sm:max-w-md w-full relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                    <button
                      className="absolute top-3 left-3 text-gray-400 hover:text-white transition text-xl"
                      onClick={() => setStep(1)}
                      aria-label="Back"
                    >
                      ←
                    </button>
                    <button
                      className="absolute top-3 right-3 text-pink-400 hover:text-pink-200 transition text-xl"
                      onClick={() => {
                        setShowPayment(false);
                        setStep(1);
                      }}
                      aria-label="Close"
                    >
                      ×
                    </button>
                    <h4 className="text-lg sm:text-xl font-bold text-center mb-3 bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                      Payment
                    </h4>
                    {clientSecret ? (
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <PaymentForm
                          bookingData={{
                            movie: selectedMovie,
                            theater: selectedTheater,
                            date: selectedDate,
                            time: selectedTime,
                            seats: selectedSeats,
                            price: ticketPrice,
                            total: ticketPrice * selectedSeats.length,
                            createdAt: new Date().toISOString(),
                          }}
                          onSuccess={async () => {
                            setLoading(true);
                            const booking = {
                              movie: selectedMovie,
                              theater: selectedTheater,
                              date: selectedDate,
                              time: selectedTime,
                              seats: selectedSeats,
                              price: ticketPrice,
                              total: ticketPrice * selectedSeats.length,
                              createdAt: new Date().toISOString(),
                            };
                            try {
                              const res = await fetch('/api/bookings', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(booking),
                              });
                              if (res.ok) {
                                setLoading(false);
                                setShowSuccess(true);
                                setShowPayment(false);
                                setStep(3);
                              } else {
                                setLoading(false);
                                alert('Booking failed. Please try again.');
                              }
                            } catch (err) {
                              setLoading(false);
                              alert('Booking failed. Please try again.');
                            }
                          }}
                        />
                      </Elements>
                    ) : (
                      <div className="flex items-center justify-center min-h-[80px] text-pink-200 text-sm sm:text-base">
                        Loading payment form...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Payment Modal for desktop */}
          {!isSmallScreen && showPayment && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 backdrop-blur-sm px-2">
              <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 max-w-[98vw] sm:max-w-md w-full relative animate-fadeIn max-h-[90vh] overflow-y-auto">
                <button
                  className="absolute top-4 right-4 text-pink-400 hover:text-pink-200 transition text-xl sm:text-2xl"
                  onClick={() => setShowPayment(false)}
                  aria-label="Close"
                >
                  ×
                </button>
                <h4 className="mb-6 text-lg sm:text-xl lg:text-2xl font-bold text-center bg-gradient-to-r from-pink-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                  Payment
                </h4>
                {clientSecret ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm
                      bookingData={{
                        movie: selectedMovie,
                        theater: selectedTheater,
                        date: selectedDate,
                        time: selectedTime,
                        seats: selectedSeats,
                        price: ticketPrice,
                        total: ticketPrice * selectedSeats.length,
                        createdAt: new Date().toISOString(),
                      }}
                      onSuccess={async () => {
                        setLoading(true);
                        const booking = {
                          movie: selectedMovie,
                          theater: selectedTheater,
                          date: selectedDate,
                          time: selectedTime,
                          seats: selectedSeats,
                          price: ticketPrice,
                          total: ticketPrice * selectedSeats.length,
                          createdAt: new Date().toISOString(),
                        };
                        try {
                          const res = await fetch('/api/bookings', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify(booking),
                          });
                          if (res.ok) {
                            setLoading(false);
                            setShowSuccess(true);
                            setShowPayment(false);
                          } else {
                            setLoading(false);
                            alert('Booking failed. Please try again.');
                          }
                        } catch (err) {
                          setLoading(false);
                          alert('Booking failed. Please try again.');
                        }
                      }}
                    />
                  </Elements>
                ) : (
                  <div className="flex items-center justify-center min-h-[80px] text-pink-200 text-sm sm:text-base">
                    Loading payment form...
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Success Modal */}
          {showSuccess && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 px-2">
              <div className="bg-gradient-to-br from-gray-900 via-gray-950 to-black border border-pink-500/30 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 max-w-[98vw] sm:max-w-sm w-full flex flex-col items-center animate-fadeIn">
                <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400 mb-3 sm:mb-4" />
                <div className="text-lg sm:text-xl font-bold text-green-300 mb-2 text-center">Booking Successful!</div>
                <div className="text-gray-300 mb-4 sm:mb-6 text-sm sm:text-base text-center">Your tickets have been booked. You can view your e-ticket in My Bookings.</div>
                <button
                  className="mt-2 px-4 py-2 sm:px-6 sm:py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold text-sm sm:text-base shadow-xl hover:scale-105 transition-all"
                  onClick={handleSuccessClose}
                >
                  Go to My Bookings
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;