import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Destination from './models/Destination.js';
import authRoutes from './routes/auth.js';
import bookingRoutes from './routes/bookings.js';

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '🚀 Roamnexa Backend Running!', timestamp: new Date() });
});

// Popular Destinations
app.get('/api/destinations', async (req, res) => {
  try {
    const dbDests = await Destination.find({});
    if (dbDests.length > 0) return res.json(dbDests);

    // Fallback data for demo/presentation
    res.json([
      { _id: '1', name: 'Bali, Indonesia', image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', rating: 4.8, description: 'Island of Gods', category: 'Beach', price: 45000 },
      { _id: '2', name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e90768da6c3?w=800&q=80', rating: 4.9, description: 'City of Love & Lights', category: 'City', price: 89000 },
      { _id: '3', name: 'Tokyo, Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=800&q=80', rating: 4.7, description: 'Land of the Rising Sun', category: 'City', price: 75000 },
      { _id: '4', name: 'Santorini, Greece', image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', rating: 4.9, description: 'Aegean Blue Dream', category: 'Beach', price: 95000 },
      { _id: '5', name: 'Maldives', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', rating: 4.8, description: 'Paradise on Earth', category: 'Beach', price: 120000 },
      { _id: '6', name: 'Dubai, UAE', image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', rating: 4.6, description: 'City of the Future', category: 'Luxury', price: 55000 },
      { _id: '7', name: 'Goa, India', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80', rating: 4.5, description: 'India\'s Beach Capital', category: 'Beach', price: 15000 },
      { _id: '8', name: 'New York, USA', image: 'https://images.unsplash.com/photo-1500916434205-0c77489c6cf7?w=800&q=80', rating: 4.7, description: 'The City That Never Sleeps', category: 'City', price: 110000 },
    ]);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Offers
app.get('/api/offers', (req, res) => {
  res.json([
    { id: 1, title: 'Flat 20% OFF on Flights', code: 'FLY20', desc: 'Use on domestic flights. Min booking ₹3000', expires: '2026-06-30', color: '#3B82F6' },
    { id: 2, title: 'Hotel Deals up to 40% OFF', code: 'STAY40', desc: 'On partner hotels worldwide', expires: '2026-05-31', color: '#8B5CF6' },
    { id: 3, title: 'First AI Plan FREE', code: 'AIFREE', desc: 'Try our AI Itinerary Planner free once', expires: '2026-07-15', color: '#EC4899' },
  ]);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Roamnexa server running at http://localhost:${PORT}`);
  console.log(`📌 Health: http://localhost:${PORT}/api/health`);
  console.log(`📌 Auth:   http://localhost:${PORT}/api/auth`);
  console.log(`📌 Bookings: http://localhost:${PORT}/api/bookings\n`);
});
