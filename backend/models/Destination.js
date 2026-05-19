import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

const Destination = mongoose.model('Destination', destinationSchema);

export default Destination;
