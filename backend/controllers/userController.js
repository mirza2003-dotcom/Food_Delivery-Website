import User from '../models/User.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    // Handle 'me' as current authenticated user
    let userId = req.params.id;
    if (userId === 'me') {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Not authenticated'
        });
      }
      userId = req.user.id;
    }
    
    const user = await User.findById(userId)
      .select('-password -otp')
      .populate('followers', 'name profilePicture')
      .populate('following', 'name profilePicture')
      .populate('bookmarks');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's reviews count
    const reviewsCount = await Review.countDocuments({ user: user._id });
    
    // Get user's photos count
    const photosCount = await Review.aggregate([
      { $match: { user: user._id } },
      { $project: { photoCount: { $size: '$photos' } } },
      { $group: { _id: null, total: { $sum: '$photoCount' } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...user.toObject(),
        reviewsCount,
        photosCount: photosCount[0]?.total || 0
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      bio: req.body.bio,
      profilePicture: req.body.profilePicture
    };

    // Remove undefined fields
    Object.keys(fieldsToUpdate).forEach(key => 
      fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload profile picture
// @route   POST /api/users/profile/picture
// @access  Private
export const uploadProfilePicture = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: req.file.path },
      { new: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Follow user
// @route   POST /api/users/:id/follow
// @access  Private
export const followUser = async (req, res, next) => {
  try {
    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToFollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({
        success: false,
        message: 'Already following this user'
      });
    }

    // Add to following and followers
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({
      success: true,
      message: 'User followed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Unfollow user
// @route   DELETE /api/users/:id/follow
// @access  Private
export const unfollowUser = async (req, res, next) => {
  try {
    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user.id);

    if (!userToUnfollow) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );
    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.status(200).json({
      success: true,
      message: 'User unfollowed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add address
// @route   POST /api/users/addresses
// @access  Private
export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    // If this is default, remove default from others
    if (req.body.isDefault) {
      user.address.forEach(addr => addr.isDefault = false);
    }

    user.address.push(req.body);
    await user.save();

    res.status(201).json({
      success: true,
      data: user.address
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
export const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const address = user.address.id(req.params.addressId);

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found'
      });
    }

    // If making this default, remove default from others
    if (req.body.isDefault) {
      user.address.forEach(addr => addr.isDefault = false);
    }

    Object.assign(address, req.body);
    await user.save();

    res.status(200).json({
      success: true,
      data: user.address
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
export const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.address = user.address.filter(
      addr => addr._id.toString() !== req.params.addressId
    );
    await user.save();

    res.status(200).json({
      success: true,
      data: user.address
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to bookmarks
// @route   POST /api/users/bookmarks/:restaurantId
// @access  Private
export const addBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    if (!user.bookmarks.includes(restaurant._id)) {
      user.bookmarks.push(restaurant._id);
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Restaurant bookmarked'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from bookmarks
// @route   DELETE /api/users/bookmarks/:restaurantId
// @access  Private
export const removeBookmark = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    user.bookmarks = user.bookmarks.filter(
      id => id.toString() !== req.params.restaurantId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Bookmark removed'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's reviews
// @route   GET /api/users/:id/reviews
// @access  Public
export const getUserReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ user: req.params.id })
      .populate('restaurant', 'name coverImage address')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's photos
// @route   GET /api/users/:id/photos
// @access  Public
export const getUserPhotos = async (req, res, next) => {
  try {
    const reviews = await Review.find({ 
      user: req.params.id,
      photos: { $exists: true, $ne: [] }
    })
      .populate('restaurant', 'name coverImage')
      .select('photos restaurant createdAt')
      .sort('-createdAt');

    // Flatten all photos
    const photos = reviews.flatMap(review => 
      review.photos.map(photo => ({
        ...photo,
        restaurant: review.restaurant,
        reviewId: review._id,
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

// @desc    Get user's order history
// @route   GET /api/users/orders
// @access  Private
export const getOrderHistory = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate('restaurant', 'name coverImage address')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add recently viewed restaurant
// @route   POST /api/users/recently-viewed/:restaurantId
// @access  Private
export const addRecentlyViewed = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    // Remove if already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      item => item.restaurant.toString() !== req.params.restaurantId
    );

    // Add to beginning
    user.recentlyViewed.unshift({
      restaurant: req.params.restaurantId,
      viewedAt: new Date()
    });

    // Keep only last 20
    user.recentlyViewed = user.recentlyViewed.slice(0, 20);

    await user.save();

    res.status(200).json({
      success: true,
      data: user.recentlyViewed
    });
  } catch (error) {
    next(error);
  }
};
