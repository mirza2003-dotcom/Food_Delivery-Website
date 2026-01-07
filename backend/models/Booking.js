import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true,
    min: 1,
    max: 20
  },
  tablePreference: {
    type: String,
    enum: ['indoor', 'outdoor', 'window', 'any'],
    default: 'any'
  },
  occasion: {
    type: String,
    enum: ['birthday', 'anniversary', 'date', 'business', 'casual', 'other'],
    default: 'casual'
  },
  specialRequests: String,
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed', 'no_show'],
    default: 'pending'
  },
  confirmationCode: {
    type: String,
    unique: true
  },
  cancellationReason: String
}, {
  timestamps: true
});

// Generate confirmation code before saving
bookingSchema.pre('save', function(next) {
  if (!this.confirmationCode) {
    this.confirmationCode = 'BK' + Date.now() + Math.floor(Math.random() * 1000);
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);

export default Booking;
