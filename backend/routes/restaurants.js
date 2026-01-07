import express from 'express';
import {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getMenu,
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  uploadImage,
  getNearbyRestaurants,
  getCollections,
  searchRestaurants
} from '../controllers/restaurantController.js';
import { protect, authorize, optionalAuth } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Public routes
router.get('/', optionalAuth, getRestaurants);
router.get('/search/suggestions', searchRestaurants);
router.get('/nearby', getNearbyRestaurants);
router.get('/collections', getCollections);
router.get('/:id', optionalAuth, getRestaurant);
router.get('/:id/menu', getMenu);

// Protected routes
router.post('/', protect, authorize('restaurant_owner', 'admin'), createRestaurant);
router.put('/:id', protect, updateRestaurant);
router.delete('/:id', protect, deleteRestaurant);

// Menu management
router.post('/:id/menu', protect, addMenuItem);
router.put('/:id/menu/:itemId', protect, updateMenuItem);
router.delete('/:id/menu/:itemId', protect, deleteMenuItem);

// Image upload
router.post('/:id/images', protect, upload.single('image'), uploadImage);

export default router;
