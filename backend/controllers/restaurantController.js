import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';

// @desc    Get all restaurants
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      cuisines,
      minRating,
      maxCost,
      sort = '-createdAt',
      search,
      lat,
      lng,
      radius = 5000 // in meters
    } = req.query;

    // Build query
    const query = { isActive: true };

    if (category) {
      query.category = category;
    }

    if (cuisines) {
      query.cuisines = { $in: cuisines.split(',') };
    }

    if (minRating) {
      query['ratings.average'] = { $gte: parseFloat(minRating) };
    }

    if (maxCost) {
      query.costForTwo = { $lte: parseInt(maxCost) };
    }

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Geospatial search
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      };
    }

    const restaurants = await Restaurant.find(query)
      .populate('owner', 'name email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await Restaurant.countDocuments(query);

    res.status(200).json({
      success: true,
      count: restaurants.length,
      total: count,
      pages: Math.ceil(count / limit),
      currentPage: page,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id)
      .populate('owner', 'name email phone');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Get recent reviews
    const reviews = await Review.find({ restaurant: restaurant._id })
      .populate('user', 'name profilePicture')
      .sort('-createdAt')
      .limit(10);

    res.status(200).json({
      success: true,
      data: {
        ...restaurant.toObject(),
        recentReviews: reviews
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Private (restaurant_owner, admin)
export const createRestaurant = async (req, res, next) => {
  try {
    // Add user as owner
    req.body.owner = req.user.id;

    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (owner, admin)
export const updateRestaurant = async (req, res, next) => {
  try {
    let restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }

    restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: restaurant
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (owner, admin)
export const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this restaurant'
      });
    }

    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Restaurant deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant menu
// @route   GET /api/restaurants/:id/menu
// @access  Public
export const getMenu = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).select('menu name');

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    res.status(200).json({
      success: true,
      data: restaurant.menu
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add menu item
// @route   POST /api/restaurants/:id/menu
// @access  Private (owner, admin)
export const addMenuItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }

    const { category, item } = req.body;

    // Find or create category
    let menuCategory = restaurant.menu.find(cat => cat.category === category);
    
    if (menuCategory) {
      menuCategory.items.push(item);
    } else {
      restaurant.menu.push({
        category,
        items: [item]
      });
    }

    await restaurant.save();

    res.status(201).json({
      success: true,
      data: restaurant.menu
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update menu item
// @route   PUT /api/restaurants/:id/menu/:itemId
// @access  Private (owner, admin)
export const updateMenuItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }

    // Find and update item
    let itemFound = false;
    restaurant.menu.forEach(category => {
      const item = category.items.id(req.params.itemId);
      if (item) {
        Object.assign(item, req.body);
        itemFound = true;
      }
    });

    if (!itemFound) {
      return res.status(404).json({
        success: false,
        message: 'Menu item not found'
      });
    }

    await restaurant.save();

    res.status(200).json({
      success: true,
      data: restaurant.menu
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete menu item
// @route   DELETE /api/restaurants/:id/menu/:itemId
// @access  Private (owner, admin)
export const deleteMenuItem = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check ownership
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this restaurant'
      });
    }

    // Find and remove item
    restaurant.menu.forEach(category => {
      category.items = category.items.filter(
        item => item._id.toString() !== req.params.itemId
      );
    });

    // Remove empty categories
    restaurant.menu = restaurant.menu.filter(cat => cat.items.length > 0);

    await restaurant.save();

    res.status(200).json({
      success: true,
      data: restaurant.menu
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload restaurant image
// @route   POST /api/restaurants/:id/images
// @access  Private
export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    restaurant.images.push({
      url: req.file.path,
      uploadedBy: req.user.id
    });

    await restaurant.save();

    res.status(200).json({
      success: true,
      data: restaurant.images
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get nearby restaurants
// @route   GET /api/restaurants/nearby
// @access  Public
export const getNearbyRestaurants = async (req, res, next) => {
  try {
    const { lat, lng, radius = 5000, limit = 20 } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Please provide latitude and longitude'
      });
    }

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(radius)
        }
      },
      isActive: true
    }).limit(parseInt(limit));

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant collections
// @route   GET /api/restaurants/collections
// @access  Public
export const getCollections = async (req, res, next) => {
  try {
    const { city = 'Kolkata' } = req.query;

    // Define collections (can be moved to database)
    const collections = [
      {
        name: 'Trending This Week',
        query: { isActive: true, 'address.city': city },
        sort: '-ratings.average',
        limit: 12
      },
      {
        name: 'Best of ' + city,
        query: { isActive: true, 'address.city': city, 'ratings.average': { $gte: 4.5 } },
        sort: '-ratings.count',
        limit: 12
      },
      {
        name: 'Newly Opened',
        query: { isActive: true, 'address.city': city },
        sort: '-createdAt',
        limit: 12
      },
      {
        name: 'Budget Friendly',
        query: { isActive: true, 'address.city': city, costForTwo: { $lte: 500 } },
        sort: 'costForTwo',
        limit: 12
      }
    ];

    const results = await Promise.all(
      collections.map(async (collection) => {
        const restaurants = await Restaurant.find(collection.query)
          .sort(collection.sort)
          .limit(collection.limit);
        
        return {
          name: collection.name,
          count: restaurants.length,
          restaurants
        };
      })
    );

    res.status(200).json({
      success: true,
      data: results
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search restaurants with suggestions
// @route   GET /api/restaurants/search/suggestions
// @access  Public
export const searchRestaurants = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Search query must be at least 2 characters'
      });
    }

    // Create a more flexible search pattern
    // Split query into characters for better partial matching
    const searchTerm = q.trim();
    const searchRegex = new RegExp(searchTerm, 'i');
    
    // Also create a pattern that allows for missing characters (fuzzy search)
    const fuzzyPattern = searchTerm.split('').join('.*');
    const fuzzyRegex = new RegExp(fuzzyPattern, 'i');
    
    const restaurants = await Restaurant.find({
      isActive: true,
      $or: [
        { name: searchRegex },
        { cuisines: searchRegex },
        { popularDishes: searchRegex },
        { description: searchRegex },
        // Fuzzy search as fallback
        { name: fuzzyRegex },
        { cuisines: fuzzyRegex },
        { popularDishes: fuzzyRegex }
      ]
    })
    .select('name cuisines popularDishes coverImage ratings costForTwo address')
    .limit(parseInt(limit))
    .sort('-ratings.average');

    res.status(200).json({
      success: true,
      count: restaurants.length,
      data: restaurants
    });
  } catch (error) {
    next(error);
  }
};
