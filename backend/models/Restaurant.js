import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide restaurant name'],
    trim: true,
    maxlength: [100, 'Restaurant name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  cuisines: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    enum: ['order-online', 'dinning-out', 'pro-and-pro-plus', 'night-life'],
    required: true
  },
  images: [{
    url: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  coverImage: {
    type: String,
    required: true
  },
  address: {
    street: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    landmark: String
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
  contact: {
    phone: {
      type: String,
      required: true
    },
    email: String,
    website: String
  },
  timing: {
    monday: { open: String, close: String, isOpen: Boolean },
    tuesday: { open: String, close: String, isOpen: Boolean },
    wednesday: { open: String, close: String, isOpen: Boolean },
    thursday: { open: String, close: String, isOpen: Boolean },
    friday: { open: String, close: String, isOpen: Boolean },
    saturday: { open: String, close: String, isOpen: Boolean },
    sunday: { open: String, close: String, isOpen: Boolean }
  },
  costForTwo: {
    type: Number,
    required: true
  },
  menu: [{
    category: String,
    items: [{
      name: { type: String, required: true },
      description: String,
      price: { type: Number, required: true },
      image: String,
      isVeg: { type: Boolean, default: true },
      isAvailable: { type: Boolean, default: true },
      tags: [String]
    }]
  }],
  features: {
    hasParking: { type: Boolean, default: false },
    hasWifi: { type: Boolean, default: false },
    hasAC: { type: Boolean, default: false },
    hasOutdoorSeating: { type: Boolean, default: false },
    acceptsCards: { type: Boolean, default: true },
    hasHomeDelivery: { type: Boolean, default: false },
    hasTakeaway: { type: Boolean, default: false }
  },
  offers: [{
    title: String,
    description: String,
    discountPercentage: Number,
    validTill: Date,
    terms: String
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    },
    distribution: {
      five: { type: Number, default: 0 },
      four: { type: Number, default: 0 },
      three: { type: Number, default: 0 },
      two: { type: Number, default: 0 },
      one: { type: Number, default: 0 }
    }
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  popularDishes: [String]
}, {
  timestamps: true
});

// Index for geospatial queries
restaurantSchema.index({ location: '2dsphere' });

// Index for text search
restaurantSchema.index({ name: 'text', description: 'text', cuisines: 'text' });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
