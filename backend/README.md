# Zomato Clone - Backend API

Complete Node.js/Express backend for the Zomato Clone application with MongoDB database.

## Features

- 🔐 **Authentication & Authorization**
  - JWT-based authentication
  - Phone/Email OTP verification
  - Role-based access control (User, Restaurant Owner, Admin)
  - Password hashing with bcrypt

- 👤 **User Management**
  - User profiles with bio and profile pictures
  - Follow/Unfollow users
  - Address management
  - Bookmarks and recently viewed restaurants
  - Favorite orders

- 🍽️ **Restaurant Management**
  - CRUD operations for restaurants
  - Menu management (categories and items)
  - Restaurant search with filters
  - Geospatial queries (nearby restaurants)
  - Image uploads
  - Ratings and reviews
  - Collections (Trending, Best of City, etc.)

- 📦 **Order Management**
  - Place orders
  - Order tracking with status updates
  - Order history
  - Cancel orders
  - Payment method selection
  - Delivery address management

- ⭐ **Review System**
  - Write and edit reviews
  - Upload photos with reviews
  - Like reviews
  - Reply to reviews
  - Rating distribution

- 📅 **Table Booking**
  - Book tables at restaurants
  - Booking confirmation codes
  - Cancel bookings
  - Restaurant booking management

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Image Upload:** Cloudinary
- **Email:** Nodemailer
- **Security:** Helmet, CORS, Rate Limiting
- **Validation:** Express Validator

## Installation

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

3. **Configure environment variables in `.env`:**
   - MongoDB connection string
   - JWT secret
   - Email credentials (for OTP)
   - Cloudinary credentials (for image uploads)
   - Frontend URL (for CORS)

4. **Start MongoDB:**
   ```bash
   # Local MongoDB
   mongod

   # Or use MongoDB Atlas cloud database
   ```

5. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/send-otp` - Send OTP to phone/email
- `POST /api/auth/verify-otp` - Verify OTP and login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/profile/picture` - Upload profile picture
- `POST /api/users/:id/follow` - Follow user
- `DELETE /api/users/:id/follow` - Unfollow user
- `POST /api/users/addresses` - Add address
- `PUT /api/users/addresses/:addressId` - Update address
- `DELETE /api/users/addresses/:addressId` - Delete address
- `POST /api/users/bookmarks/:restaurantId` - Add bookmark
- `DELETE /api/users/bookmarks/:restaurantId` - Remove bookmark
- `GET /api/users/:id/reviews` - Get user reviews
- `GET /api/users/:id/photos` - Get user photos

### Restaurants
- `GET /api/restaurants` - Get all restaurants (with filters)
- `GET /api/restaurants/:id` - Get single restaurant
- `POST /api/restaurants` - Create restaurant (owner/admin)
- `PUT /api/restaurants/:id` - Update restaurant
- `DELETE /api/restaurants/:id` - Delete restaurant
- `GET /api/restaurants/:id/menu` - Get menu
- `POST /api/restaurants/:id/menu` - Add menu item
- `PUT /api/restaurants/:id/menu/:itemId` - Update menu item
- `DELETE /api/restaurants/:id/menu/:itemId` - Delete menu item
- `POST /api/restaurants/:id/images` - Upload image
- `GET /api/restaurants/nearby` - Get nearby restaurants
- `GET /api/restaurants/collections` - Get restaurant collections

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - Get user orders
- `GET /api/orders/:id` - Get order details
- `PUT /api/orders/:id/cancel` - Cancel order
- `PUT /api/orders/:id/status` - Update order status (owner/admin)
- `POST /api/orders/:id/favorite` - Add to favorite orders
- `GET /api/orders/restaurant/:restaurantId` - Get restaurant orders

### Reviews
- `POST /api/reviews` - Create review
- `GET /api/reviews/restaurant/:restaurantId` - Get restaurant reviews
- `GET /api/reviews/:id` - Get review
- `PUT /api/reviews/:id` - Update review
- `DELETE /api/reviews/:id` - Delete review
- `POST /api/reviews/:id/like` - Like/unlike review
- `POST /api/reviews/:id/reply` - Reply to review
- `POST /api/reviews/:id/photos` - Upload photos
- `GET /api/reviews/restaurant/:restaurantId/photos` - Get restaurant photos

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/my-bookings` - Get user bookings
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id/cancel` - Cancel booking
- `PUT /api/bookings/:id/status` - Update booking status (owner/admin)
- `GET /api/bookings/restaurant/:restaurantId` - Get restaurant bookings

## Database Models

### User
- Personal information (name, email, phone, profile picture)
- Authentication (password, OTP, verification status)
- Addresses
- Social (followers, following)
- Activity (bookmarks, recently viewed, favorite orders)

### Restaurant
- Basic information (name, description, cuisines, category)
- Location (address, geospatial coordinates)
- Contact details
- Timing and cost
- Menu (categories with items)
- Features and amenities
- Offers
- Ratings and statistics
- Images

### Order
- User and restaurant references
- Items with quantities and prices
- Pricing details (subtotal, tax, delivery charge, total)
- Delivery address
- Payment information
- Order status tracking
- Status history

### Review
- User and restaurant references
- Rating (1-5)
- Comment with optional title
- Photos
- Likes and replies
- Anonymous option

### Booking
- User and restaurant references
- Date, time, and guest count
- Table preference
- Occasion and special requests
- Status (pending, confirmed, cancelled, completed)
- Confirmation code

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- Helmet for security headers
- CORS configuration
- Input validation and sanitization
- Role-based access control

## Error Handling

- Custom error handler middleware
- Mongoose validation errors
- Duplicate key errors
- JWT errors
- 404 for undefined routes

## Development

```bash
# Run in development mode with auto-reload
npm run dev

# Seed database with sample data (optional)
npm run seed
```

## Environment Variables

Required environment variables (see `.env.example`):

- `NODE_ENV` - Environment (development/production)
- `PORT` - Server port
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT
- `JWT_EXPIRE` - JWT expiration time
- `EMAIL_HOST` - Email SMTP host
- `EMAIL_PORT` - Email SMTP port
- `EMAIL_USER` - Email username
- `EMAIL_PASSWORD` - Email password
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `FRONTEND_URL` - Frontend application URL

## License

ISC

## Author

Your Name
