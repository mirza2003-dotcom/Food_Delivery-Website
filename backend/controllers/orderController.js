import Order from '../models/Order.js';
import Restaurant from '../models/Restaurant.js';
import User from '../models/User.js';
import { sendOrderConfirmationEmail } from '../utils/email.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const {
      restaurant,
      items,
      deliveryAddress,
      paymentMethod,
      specialInstructions
    } = req.body;

    // Verify restaurant exists
    const restaurantDoc = await Restaurant.findById(restaurant);
    if (!restaurantDoc) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Calculate subtotal
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Calculate tax and delivery charge
    const tax = subtotal * 0.05; // 5% tax
    const deliveryCharge = subtotal > 200 ? 0 : 40; // Free delivery over ₹200

    const total = subtotal + tax + deliveryCharge;

    // Set estimated delivery time (30-45 minutes)
    const estimatedDeliveryTime = new Date(Date.now() + (30 + Math.random() * 15) * 60000);

    const order = await Order.create({
      user: req.user.id,
      restaurant,
      items,
      subtotal,
      tax,
      deliveryCharge,
      total,
      deliveryAddress,
      paymentMethod,
      specialInstructions,
      estimatedDeliveryTime,
      statusHistory: [{
        status: 'placed',
        timestamp: new Date(),
        note: 'Order placed successfully'
      }]
    });

    // Populate order details
    await order.populate('restaurant', 'name coverImage contact');
    await order.populate('user', 'name email phone');

    // Send confirmation email
    await sendOrderConfirmationEmail(order.user.email, order);

    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private (admin)
export const getOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status, restaurant } = req.query;

    const query = {};

    if (status) {
      query.orderStatus = status;
    }

    if (restaurant) {
      query.restaurant = restaurant;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name address')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      pages: Math.ceil(count / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('restaurant', 'name coverImage address contact');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order or is admin
    if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (restaurant_owner, admin)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id).populate('restaurant');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check authorization
    if (
      order.restaurant.owner.toString() !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this order'
      });
    }

    // Update status
    order.orderStatus = status;
    order.statusHistory.push({
      status,
      timestamp: new Date(),
      note
    });

    // If delivered, set actual delivery time
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Can only cancel if not yet preparing
    if (['preparing', 'ready', 'out_for_delivery', 'delivered'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order at this stage'
      });
    }

    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.statusHistory.push({
      status: 'cancelled',
      timestamp: new Date(),
      note: reason
    });

    // If payment was completed, initiate refund
    if (order.paymentStatus === 'completed') {
      order.paymentStatus = 'refunded';
    }

    await order.save();

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = { user: req.user.id };

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('restaurant', 'name coverImage address')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      pages: Math.ceil(count / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get restaurant orders
// @route   GET /api/orders/restaurant/:restaurantId
// @access  Private (restaurant_owner, admin)
export const getRestaurantOrders = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.restaurantId);

    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: 'Restaurant not found'
      });
    }

    // Check authorization
    if (restaurant.owner.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these orders'
      });
    }

    const { page = 1, limit = 20, status } = req.query;

    const query = { restaurant: req.params.restaurantId };

    if (status) {
      query.orderStatus = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name phone')
      .sort('-createdAt')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      count: orders.length,
      total: count,
      pages: Math.ceil(count / limit),
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to favorite orders
// @route   POST /api/orders/:id/favorite
// @access  Private
export const addToFavorites = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    const user = await User.findById(req.user.id);

    // Add to favorite orders
    user.favoriteOrders.push({
      restaurant: order.restaurant,
      items: order.items,
      totalPrice: order.total
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Added to favorite orders'
    });
  } catch (error) {
    next(error);
  }
};
