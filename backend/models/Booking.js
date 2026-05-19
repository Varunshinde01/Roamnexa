import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  userName: { type: String },
  type: {
    type: String,
    enum: ['flight', 'hotel', 'homestay', 'train', 'bus', 'cab', 'holiday', 'forex'],
    required: true,
  },
  from: { type: String },
  to: { type: String },
  date: { type: Date },
  returnDate: { type: Date },
  passengers: { type: Number, default: 1 },
  price: { type: Number, default: 0 },
  status: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled'],
    default: 'confirmed',
  },
  details: { type: Object, default: {} },
  bookingRef: { type: String, unique: true },
}, { timestamps: true });

// Auto-generate booking reference
bookingSchema.pre('save', function () {
  if (!this.bookingRef) {
    this.bookingRef = 'RNX' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
  }
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
