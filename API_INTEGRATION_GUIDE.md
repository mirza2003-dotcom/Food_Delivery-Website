# Zomato Clone - API Integration Guide

## Overview
This document provides comprehensive information about the backend API and how to use it in the frontend.

## Backend Server
- **Base URL**: `http://localhost:5000/api`
- **MongoDB**: MongoDB Atlas (Cloud)
- **Authentication**: JWT tokens stored in localStorage

## Quick Start

### 1. Start Backend Server
```bash
cd backend
npm start
```
Server will run on port 5000

### 2. Start Frontend
```bash
npm run dev
```
Frontend will run on port 5173

## Authentication

### Test Credentials
- **Email**: john@example.com
- **Password**: password123
- **Phone**: 9876543210

### Auth Context
The app uses React Context for authentication state management:

```javascript
import { useAuth } from './context/AuthContext';

// In your component
const { user, isAuthenticated, login, register, logout } = useAuth();
```

### Available Auth Methods
- `login(email, password)` - Email/password login
- `register({ name, email, phone, password })` - New user registration
- `sendOTP(phone)` - Send OTP for phone login
- `verifyOTP(phone, otp)` - Verify OTP and login
- `logout()` - Clear session

## API Service Layer

All API calls are centralized in `src/services/api.js`:

```javascript
import { authAPI, restaurantAPI, orderAPI, reviewAPI, userAPI, bookingAPI } from './services/api';
```

## Custom Hooks

### Restaurant Hooks
Located in `src/hooks/useRestaurants.js`:

```javascript
import { useRestaurants, useRestaurant, useCollections, useNearbyRestaurants } from './hooks/useRestaurants';

// Fetch multiple restaurants with filters
const { restaurants, loading, error, pagination, refetch } = useRestaurants({
  type: 'delivery', // 'delivery', 'dine-in', 'nightlife'
  cuisine: 'Italian',
  minRating: 4,
  page: 1,
  limit: 10
});

// Fetch single restaurant
const { restaurant, loading, error, refetch } = useRestaurant(restaurantId);

// Fetch collections
const { collections, loading, error, refetch } = useCollections('Kolkata');

// Fetch nearby restaurants
const { restaurants, loading, error, refetch } = useNearbyRestaurants(lat, lng, radius);
```

### Order Hooks
Located in `src/hooks/useOrders.js`:

```javascript
import { useOrders } from './hooks/useOrders';

const { orders, loading, error, createOrder, cancelOrder, refetch } = useOrders();

// Create new order
const result = await createOrder({
  restaurant: restaurantId,
  items: [{ menuItem: itemId, quantity: 2 }],
  deliveryAddress: addressId,
  paymentMethod: 'online'
});

// Cancel order
await cancelOrder(orderId);
```

### Review Hooks
Located in `src/hooks/useReviews.js`:

```javascript
import { useReviews } from './hooks/useReviews';

const { reviews, loading, error, createReview, likeReview, replyToReview, refetch } = useReviews(restaurantId);

// Create review
await createReview({
  restaurant: restaurantId,
  rating: 5,
  comment: 'Excellent food!',
  foodRating: 5,
  serviceRating: 4
});

// Like review
await likeReview(reviewId);

// Reply to review (restaurant owner)
await replyToReview(reviewId, 'Thank you for your feedback!');
```

### User Profile Hooks
Located in `src/hooks/useUser.js`:

```javascript
import { 
  useUserProfile, 
  useUserReviews, 
  useUserPhotos, 
  useFollowers, 
  useBookmarks 
} from './hooks/useUser';

// User profile
const { profile, loading, error, updateProfile, refetch } = useUserProfile('me');
await updateProfile({ name: 'New Name', bio: 'My bio' });

// User reviews
const { reviews, loading, error, refetch } = useUserReviews('me');

// User photos
const { photos, loading, error, refetch } = useUserPhotos('me');

// Followers
const { followers, loading, error, followUser, unfollowUser, refetch } = useFollowers('me');
await followUser(userId);
await unfollowUser(userId);

// Bookmarks
const { bookmarks, loading, error, addBookmark, removeBookmark, refetch } = useBookmarks();
await addBookmark(restaurantId);
await removeBookmark(restaurantId);
```

## API Endpoints

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login` | Login with email/password |
| POST | `/auth/send-otp` | Send OTP to phone |
| POST | `/auth/verify-otp` | Verify OTP and login |
| GET | `/auth/me` | Get current user |
| POST | `/auth/logout` | Logout user |

### Restaurant Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/restaurants` | Get all restaurants (with filters) |
| GET | `/restaurants/:id` | Get single restaurant |
| GET | `/restaurants/nearby` | Get nearby restaurants |
| GET | `/restaurants/collections` | Get restaurant collections |
| POST | `/restaurants` | Create restaurant (owner) |
| PUT | `/restaurants/:id` | Update restaurant (owner) |
| DELETE | `/restaurants/:id` | Delete restaurant (owner) |

### Order Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/orders` | Create new order |
| GET | `/orders/my-orders` | Get user's orders |
| GET | `/orders/:id` | Get order details |
| PUT | `/orders/:id/cancel` | Cancel order |
| PUT | `/orders/:id/status` | Update order status (restaurant) |

### Review Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/reviews` | Create review |
| GET | `/reviews/restaurant/:id` | Get restaurant reviews |
| PUT | `/reviews/:id/like` | Like review |
| POST | `/reviews/:id/reply` | Reply to review (owner) |
| POST | `/reviews/:id/photos` | Upload review photos |

### User Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/profile/:id` | Get user profile |
| PUT | `/users/profile` | Update own profile |
| GET | `/users/reviews/:id` | Get user reviews |
| GET | `/users/photos/:id` | Get user photos |
| POST | `/users/follow/:id` | Follow user |
| DELETE | `/users/unfollow/:id` | Unfollow user |
| GET | `/users/followers/:id` | Get user followers |
| POST | `/users/addresses` | Add address |
| GET | `/users/bookmarks` | Get bookmarks |
| POST | `/users/bookmarks/:id` | Add bookmark |
| DELETE | `/users/bookmarks/:id` | Remove bookmark |

### Booking Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/bookings` | Create table booking |
| GET | `/bookings/my-bookings` | Get user bookings |
| PUT | `/bookings/:id/cancel` | Cancel booking |

## Request Examples

### Filter Restaurants
```javascript
const { restaurants } = useRestaurants({
  type: 'delivery',
  cuisine: 'Italian',
  minRating: 4,
  priceRange: 'medium',
  search: 'Pizza',
  sort: '-rating',
  page: 1,
  limit: 20
});
```

### Create Order
```javascript
const { createOrder } = useOrders();

const orderData = {
  restaurant: '60d5ec49f1b2c72b8c8e4f1a',
  items: [
    { menuItem: '60d5ec49f1b2c72b8c8e4f1b', quantity: 2, specialInstructions: 'Extra cheese' },
    { menuItem: '60d5ec49f1b2c72b8c8e4f1c', quantity: 1 }
  ],
  deliveryAddress: '60d5ec49f1b2c72b8c8e4f1d',
  paymentMethod: 'online',
  specialInstructions: 'Ring the doorbell twice'
};

const result = await createOrder(orderData);
if (result.success) {
  console.log('Order created:', result.data);
}
```

### Write Review
```javascript
const { createReview } = useReviews(restaurantId);

const reviewData = {
  restaurant: restaurantId,
  rating: 5,
  comment: 'Excellent food and service!',
  foodRating: 5,
  serviceRating: 5,
  ambienceRating: 4,
  tags: ['great-food', 'family-friendly']
};

await createReview(reviewData);
```

## Error Handling

All API calls return consistent error responses:

```javascript
try {
  await createOrder(orderData);
} catch (error) {
  console.error(error.response?.data?.message || 'An error occurred');
}
```

## Components Updated

### Authentication Components
- ✅ `Login.jsx` - Email/password + phone OTP login
- ✅ `Signup.jsx` - User registration
- ✅ `EnterOTP.jsx` - OTP verification

### Page Components
- ✅ `ShowCase.jsx` - Restaurant listing with API data
- ✅ `RestaurantPage.jsx` - Single restaurant view
- ✅ `User.jsx` - User profile with orders, reviews, photos

## Database Schema

### User Model
- name, email, phone, password
- profilePicture, bio, dateOfBirth
- addresses (array)
- followers, following (arrays)
- bookmarkedRestaurants (array)

### Restaurant Model
- name, description, cuisine
- location (address, coordinates)
- contact (phone, email)
- menu (array of items)
- images, rating, priceRange
- deliveryTime, featured

### Order Model
- user, restaurant
- items (array with menuItem, quantity)
- totalAmount, deliveryAddress
- status (pending, confirmed, preparing, out-for-delivery, delivered, cancelled)
- paymentMethod, paymentStatus

### Review Model
- user, restaurant
- rating, comment
- foodRating, serviceRating, ambienceRating
- photos, likes, reply

### Booking Model
- user, restaurant
- date, time, guests
- status (pending, confirmed, cancelled)
- specialRequests

## Next Steps

1. **Test authentication flow**: Register → Login → OTP verification
2. **Browse restaurants**: Filter by type, cuisine, rating
3. **View restaurant details**: Menu, reviews, ratings
4. **Place orders**: Add items, checkout, track status
5. **Write reviews**: Rate restaurants, upload photos
6. **Manage profile**: Update info, view history, bookmarks

## Troubleshooting

### Backend not starting
- Check if MongoDB Atlas connection string is correct in `.env`
- Ensure port 5000 is not in use
- Run `npm install` in backend directory

### Frontend not connecting to backend
- Check if backend is running on port 5000
- Verify CORS is enabled in backend
- Check browser console for errors

### Authentication not working
- Clear localStorage: `localStorage.clear()`
- Check if JWT_SECRET is set in backend `.env`
- Verify token is being sent in request headers

## Sample Data

The database is seeded with:
- 4 users (john@example.com, jane@example.com, etc.)
- 3 restaurants (Paradise Biryani, Pizza Hut, Cafe Coffee Day)
- 3 reviews
- Sample menu items and addresses

Use these credentials to test the app!
