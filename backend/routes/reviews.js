import express from 'express';
import {
  createReview,
  getRestaurantReviews,
  getReview,
  updateReview,
  deleteReview,
  likeReview,
  replyToReview,
  uploadReviewPhotos,
  getRestaurantPhotos
} from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Review routes
router.post('/', protect, createReview);
router.get('/restaurant/:restaurantId', getRestaurantReviews);
router.get('/restaurant/:restaurantId/photos', getRestaurantPhotos);
router.get('/:id', getReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

// Interactions
router.post('/:id/like', protect, likeReview);
router.post('/:id/reply', protect, replyToReview);

// Photo upload
router.post('/:id/photos', protect, upload.array('photos', 5), uploadReviewPhotos);

export default router;
