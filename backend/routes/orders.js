import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  cancelOrder,
  getMyOrders,
  getRestaurantOrders,
  addToFavorites
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// User routes
router.post('/', protect, createOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);
router.post('/:id/favorite', protect, addToFavorites);

// Restaurant owner routes
router.get('/restaurant/:restaurantId', protect, getRestaurantOrders);
router.put('/:id/status', protect, authorize('restaurant_owner', 'admin'), updateOrderStatus);

// Admin routes
router.get('/', protect, authorize('admin'), getOrders);

export default router;
