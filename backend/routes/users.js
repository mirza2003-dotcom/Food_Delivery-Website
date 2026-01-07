import express from 'express';
import {
  getUserProfile,
  updateProfile,
  uploadProfilePicture,
  followUser,
  unfollowUser,
  addAddress,
  updateAddress,
  deleteAddress,
  addBookmark,
  removeBookmark,
  getUserReviews,
  getUserPhotos,
  getOrderHistory,
  addRecentlyViewed
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../utils/cloudinary.js';

const router = express.Router();

// Profile routes - 'me' must come before '/:id' to avoid route conflicts
router.get('/me', protect, (req, res, next) => {
  req.params.id = 'me';
  getUserProfile(req, res, next);
});
router.get('/:id', getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/profile/picture', protect, upload.single('image'), uploadProfilePicture);

// Follow/Unfollow
router.post('/:id/follow', protect, followUser);
router.delete('/:id/follow', protect, unfollowUser);

// Address management
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);

// Bookmarks
router.post('/bookmarks/:restaurantId', protect, addBookmark);
router.delete('/bookmarks/:restaurantId', protect, removeBookmark);

// Activity
router.get('/:id/reviews', getUserReviews);
router.get('/:id/photos', getUserPhotos);
router.get('/orders', protect, getOrderHistory);
router.post('/recently-viewed/:restaurantId', protect, addRecentlyViewed);

export default router;
