import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  getRestaurantBookings
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);

// Restaurant owner routes
router.get('/restaurant/:restaurantId', protect, getRestaurantBookings);
router.put('/:id/status', protect, authorize('restaurant_owner', 'admin'), updateBookingStatus);

export default router;
