import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { restaurant, rating, title, comment, photos, isAnonymous } = req.body;

    // Check if restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check if user already reviewed this restaurant
    const existingReview = await Review.findOne({
      user: req.user.id,
      restaurant
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this restaurant'
      });
    }

    const review = await Review.create({
      user: req.user.id,
      restaurant,
      rating,
      title,
      comment,
      photos,
      isAnonymous
    });

    // Update restaurant ratings
    await updateRestaurantRating(restaurant);

    await review.populate('user', 'name profilePicture');

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/reviews/restaurant/:restaurantId
// @access  Public
export const getRestaurantReviews = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, sort = '-createdAt', rating } = req.query;

    const query = { restaurant: req.params.restaurantId };

    if (rating) {
      query.rating = parseInt(rating);
    }

    const reviews = await Review.find(query)
      .populate('user', 'name profilePicture')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Review.countDocuments(query);

    res.status(200).json({
      success: true,
      count: reviews.length,
      total: count,
      pages: Math.ceil(count / limit),
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate('user', 'name profilePicture')
      .populate('restaurant', 'name coverImage address');

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const oldRating = review.rating;

    review = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name profilePicture');

    // Update restaurant ratings if rating changed
    if (oldRating !== review.rating) {
      await updateRestaurantRating(review.restaurant);
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership or admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const restaurantId = review.restaurant;
    await review.deleteOne();

    // Update restaurant ratings
    await updateRestaurantRating(restaurantId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like review
// @route   POST /api/reviews/:id/like
// @access  Private
export const likeReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if already liked
    if (review.likes.includes(req.user.id)) {
      // Unlike
      review.likes = review.likes.filter(
        id => id.toString() !== req.user.id
      );
    } else {
      // Like
      review.likes.push(req.user.id);
    }

    await review.save();

    res.status(200).json({
      success: true,
      data: {
        likes: review.likes.length,
        isLiked: review.likes.includes(req.user.id)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add reply to review
// @route   POST /api/reviews/:id/reply
// @access  Private
export const replyToReview = async (req, res, next) => {
  try {
    const { text } = req.body;

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    review.replies.push({
      user: req.user.id,
      text
    });

    await review.save();
    await review.populate('replies.user', 'name profilePicture');

    res.status(201).json({
      success: true,
      data: review.replies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload review photos
// @route   POST /api/reviews/:id/photos
// @access  Private
export const uploadReviewPhotos = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please upload at least one photo'
      });
    }

    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check ownership
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    // Add photos
    const photos = req.files.map(file => ({
      url: file.path,
      caption: req.body.caption || ''
    }));

    review.photos.push(...photos);
    await review.save();

    res.status(200).json({
      success: true,
      data: review.photos
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to update restaurant rating
async function updateRestaurantRating(restaurantId) {
  const reviews = await Review.find({ restaurant: restaurantId });

  if (reviews.length === 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      'ratings.average': 0,
      'ratings.count': 0,
      'ratings.distribution': { five: 0, four: 0, three: 0, two: 0, one: 0 }
    });
    return;
  }

  const distribution = { five: 0, four: 0, three: 0, two: 0, one: 0 };
  let totalRating = 0;

  reviews.forEach(review => {
    totalRating += review.rating;
    const key = ['one', 'two', 'three', 'four', 'five'][review.rating - 1];
    distribution[key]++;
  });

  const average = totalRating / reviews.length;

  await Restaurant.findByIdAndUpdate(restaurantId, {
    'ratings.average': average,
    'ratings.count': reviews.length,
    'ratings.distribution': distribution
  });
}

// @desc    Get photos from restaurant
// @route   GET /api/reviews/restaurant/:restaurantId/photos
// @access  Public
export const getRestaurantPhotos = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const reviews = await Review.find({
      restaurant: req.params.restaurantId,
      photos: { $exists: true, $ne: [] }
    })
      .populate('user', 'name profilePicture')
      .select('photos user createdAt')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    // Flatten photos
    const photos = reviews.flatMap(review =>
      review.photos.map(photo => ({
        ...photo.toObject(),
        user: review.user,
        uploadedAt: review.createdAt
      }))
    );

    res.status(200).json({
      success: true,
      count: photos.length,
      data: photos
    });
  } catch (error) {
    next(error);
  }
};
