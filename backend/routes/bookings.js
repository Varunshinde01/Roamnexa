import express from 'express';
import jwt from 'jsonwebtoken';
import Booking from '../models/Booking.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'roamnexa_secret_2024';

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Please login to continue' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    res.status(401).json({ message: 'Session expired, please login again' });
  }
};

// Create a booking
router.post('/', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    let userId = null;
    if (token) {
      try { userId = jwt.verify(token, JWT_SECRET).id; } catch {}
    }
    const booking = await Booking.create({ ...req.body, userId });
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get my bookings
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort('-createdAt');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all bookings (for admin/demo)
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find({}).sort('-createdAt').limit(20);
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mock flight search
router.get('/search/flights', (req, res) => {
  const { from = 'DEL', to = 'BOM', date } = req.query;
  const airlines = [
    { airline: 'IndiGo', code: '6E-2145', logo: '✈️', departure: '06:00', arrival: '08:15', duration: '2h 15m', price: 3499, class: 'Economy', stops: 'Non-stop', baggage: '15kg' },
    { airline: 'Air India', code: 'AI-805', logo: '✈️', departure: '09:30', arrival: '12:00', duration: '2h 30m', price: 4800, class: 'Economy', stops: 'Non-stop', baggage: '25kg' },
    { airline: 'SpiceJet', code: 'SG-322', logo: '✈️', departure: '13:15', arrival: '15:30', duration: '2h 15m', price: 2899, class: 'Economy', stops: 'Non-stop', baggage: '15kg' },
    { airline: 'Vistara', code: 'UK-945', logo: '✈️', departure: '17:45', arrival: '20:00', duration: '2h 15m', price: 6200, class: 'Business', stops: 'Non-stop', baggage: '25kg' },
    { airline: 'GoFirst', code: 'G8-215', logo: '✈️', departure: '21:00', arrival: '23:30', duration: '2h 30m', price: 2499, class: 'Economy', stops: 'Non-stop', baggage: '15kg' },
  ];
  res.json({ flights: airlines.map((f, i) => ({ id: i + 1, ...f, from, to, date })), from, to, date });
});

// Mock hotel search
router.get('/search/hotels', (req, res) => {
  const { city = 'Mumbai', checkin, checkout } = req.query;
  const hotels = [
    { id: 1, name: 'The Oberoi Grand', stars: 5, rating: 4.8, reviews: 1243, price: 12500, perNight: true, amenities: ['Pool', 'Spa', 'Gym', 'Restaurant'], image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400' },
    { id: 2, name: 'Taj Palace Hotel', stars: 5, rating: 4.9, reviews: 2156, price: 15800, perNight: true, amenities: ['Pool', 'Spa', 'Bar', 'Fine Dining'], image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400' },
    { id: 3, name: 'Hyatt Regency', stars: 4, rating: 4.5, reviews: 876, price: 7200, perNight: true, amenities: ['Pool', 'Gym', 'Restaurant'], image: 'https://images.unsplash.com/photo-1551882547-ff40c4a49461?w=400' },
    { id: 4, name: 'Lemon Tree Premier', stars: 4, rating: 4.3, reviews: 543, price: 4500, perNight: true, amenities: ['Gym', 'Restaurant', 'WiFi'], image: 'https://images.unsplash.com/photo-1596436889106-be35e843f974?w=400' },
  ];
  res.json({ hotels: hotels.map(h => ({ ...h, city, checkin, checkout })), city, checkin, checkout });
});

// Mock train search
router.get('/search/trains', (req, res) => {
  const { from = 'New Delhi', to = 'Mumbai', date } = req.query;
  const trains = [
    { id: 1, name: 'Rajdhani Express', number: '12951', departure: '16:55', arrival: '08:35', duration: '15h 40m', classes: ['1A','2A','3A'], price: { '1A': 4530, '2A': 2590, '3A': 1790 }, availability: { '1A': 12, '2A': 34, '3A': 67 } },
    { id: 2, name: 'Duronto Express', number: '12263', departure: '23:00', arrival: '16:45', duration: '17h 45m', classes: ['1A','2A','3A'], price: { '1A': 4210, '2A': 2380, '3A': 1670 }, availability: { '1A': 5, '2A': 18, '3A': 43 } },
    { id: 3, name: 'Shatabdi Express', number: '12009', departure: '06:00', arrival: '21:00', duration: '15h 00m', classes: ['CC','EC'], price: { 'CC': 1565, 'EC': 2935 }, availability: { 'CC': 89, 'EC': 23 } },
  ];
  res.json({ trains: trains.map(t => ({ ...t, from, to, date })), from, to, date });
});

export default router;
