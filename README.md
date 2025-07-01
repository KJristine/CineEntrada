# CineEntrada 🎬

A modern cinema ticket booking application built with React, Node.js, and MongoDB.

## Features

- 🎥 Browse movies and showtimes
- 🎫 Book tickets with seat selection
- 💳 Secure payment processing with Stripe
- 👤 User authentication with Clerk
- 📱 Responsive design
- 🔐 Admin dashboard for movie management

## Tech Stack

### Frontend

- React 19 with Vite
- Tailwind CSS for styling
- Material-UI components
- Framer Motion for animations
- React Router for navigation
- Clerk for authentication
- Stripe for payments

### Backend

- Node.js with Express
- MongoDB with Mongoose
- Stripe for payment processing
- Clerk for user management
- CORS enabled

## Prerequisites

Before running this application, make sure you have:

- Node.js (v18 or higher)
- npm or yarn
- MongoDB (local installation or MongoDB Atlas account)
- Stripe account (for payment processing)
- Clerk account (for authentication)

## Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/cineentrada.git
cd cineentrada
```

### 2. Install dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

### 3. Environment Variables Setup

#### Server Environment Variables

1. Copy the server environment template:

```bash
cd server
cp .env.example .env
```

2. Edit `server/.env` and add your actual values:

```env
MONGODB_URI=your_mongodb_connection_string
STRIPE_SECRET_KEY=your_stripe_secret_key
CLERK_SECRET_KEY=your_clerk_secret_key
PORT=5000
```

#### Client Environment Variables

1. Copy the client environment template:

```bash
cd client
cp .env.example .env
```

2. Edit `client/.env` and add your actual values:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
VITE_API_URL=http://localhost:5000
```

### 4. Database Setup

If using MongoDB locally:

```bash
mongod
```

If using MongoDB Atlas, make sure your connection string is correctly set in the server `.env` file.

### 5. Running the Application

#### Development Mode

```bash
# Start the server (from server directory)
cd server
npm start

# Start the client (from client directory - new terminal)
cd client
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Security Features

- ✅ Environment variables for sensitive data
- ✅ CORS configuration
- ✅ Input validation
- ✅ Secure payment processing
- ✅ Authentication middleware
- ✅ Rate limiting (recommended to add)

## API Endpoints

### Movies

- `GET /api/movies` - Get all movies
- `POST /api/movies` - Add new movie (admin)
- `PUT /api/movies/:id` - Update movie (admin)
- `DELETE /api/movies/:id` - Delete movie (admin)

### Bookings

- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/user/:userId` - Get user bookings

### Payments

- `POST /api/create-payment-intent` - Create Stripe payment intent

## Deployment

### Environment Variables for Production

Make sure to set these environment variables in your production environment:

**Server:**

- `MONGODB_URI`
- `STRIPE_SECRET_KEY`
- `CLERK_SECRET_KEY`
- `NODE_ENV=production`

**Client:**

- `VITE_CLERK_PUBLISHABLE_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `VITE_API_URL` (your production API URL)

### Recommended Hosting Platforms

- **Frontend:** Vercel, Netlify, or GitHub Pages
- **Backend:** Railway, Render, or Heroku
- **Database:** MongoDB Atlas

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/yourusername/cineentrada/issues) on GitHub.

---

⚠️ **Security Notice**: Never commit `.env` files or expose API keys in your code. Always use environment variables for sensitive data.
