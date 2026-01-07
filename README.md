# Zomato Clone - Full Stack Application

A complete full-stack clone of Zomato built with React.js (frontend) and Node.js/Express (backend), featuring user authentication, restaurant browsing, ordering system, reviews, and user profiles.

## 🌟 Features

### ✅ Implemented Features
- **User Authentication**: Email/Password login, Phone OTP verification, JWT tokens
- **Restaurant Browsing**: Filter by type (delivery/dining/nightlife), cuisine, rating
- **Restaurant Details**: View menu, ratings, reviews, location
- **User Profile**: View orders, reviews, photos, followers, bookmarks
- **Order System**: Create orders, view order history, cancel orders (backend ready)
- **Review System**: Write reviews, upload photos, like reviews (backend ready)
- **Booking System**: Table reservations (backend ready)
- **Real-time Data**: All data fetched from MongoDB via REST API

### 🎯 Frontend Features
- Responsive design
- Interactive UI components
- Real-time data loading
- Error handling and loading states
- Token-based authentication
- Protected routes

### 🔧 Backend Features
- RESTful API (70+ endpoints)
- JWT authentication
- MongoDB database
- Input validation
- Error handling
- CORS enabled
- Security headers

## 📁 Project Structure

```
zomato_clone/
├── backend/                    # Backend API
│   ├── config/                 # Database & config
│   ├── controllers/            # Business logic
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth & validation
│   ├── utils/                  # Helper functions
│   ├── scripts/                # Database scripts
│   └── server.js               # Entry point
│
├── src/                        # Frontend React app
│   ├── components/             # Reusable components
│   ├── pages/                  # Page components
│   ├── context/                # React context (Auth)
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API service layer
│   └── utils/                  # Utility components
│
└── Documentation/
    ├── API_INTEGRATION_GUIDE.md
    ├── INTEGRATION_SUMMARY.md
    ├── QUICK_START.md
    └── TESTING_CHECKLIST.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account (free)
- npm or yarn

### Installation

1. **Clone the repository**:
```bash
git clone <repository-url>
cd zomato_clone
```

2. **Backend Setup**:
```bash
cd backend
npm install

# Create .env file
echo "MONGODB_URI=your_mongodb_connection_string" > .env
echo "JWT_SECRET=your-secret-key" >> .env
echo "PORT=5000" >> .env

# Seed database (optional)
node scripts/seedData.js

# Start server
npm start
```

3. **Frontend Setup**:
```bash
cd ..
npm install
npm run dev
```

4. **Access the application**:
- Frontend: `http://localhost:3001`
- Backend: `http://localhost:5000`

### Test Credentials
```
Email: john@example.com
Password: password123
Phone: 9876543210
```

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running quickly
- **[API Integration Guide](API_INTEGRATION_GUIDE.md)** - Complete API documentation
- **[Integration Summary](INTEGRATION_SUMMARY.md)** - What's been implemented
- **[Testing Checklist](TESTING_CHECKLIST.md)** - Verify your setup

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router v6** - Routing
- **Axios** - HTTP client
- **React Context** - State management
- **Vite** - Build tool
- **CSS Modules** - Styling

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Express Validator** - Input validation

## 📱 Pages Developed

1. **Home Page** - Landing page with hero section
2. **ShowCase Page** - Restaurant listings with filters
3. **Restaurant Page** - Detailed restaurant view
4. **User Profile Page** - User dashboard
5. **Add Restaurant Page** - For restaurant owners
6. **Order Page** - Order management
7. **Get The App Page** - Mobile app promotion

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/send-otp` - Send OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `GET /api/auth/me` - Get current user

### Restaurants
- `GET /api/restaurants` - List restaurants
- `GET /api/restaurants/:id` - Get restaurant details
- `GET /api/restaurants/nearby` - Nearby restaurants
- `POST /api/restaurants` - Create restaurant

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/my-orders` - User orders
- `PUT /api/orders/:id/cancel` - Cancel order

### Reviews
- `POST /api/reviews` - Write review
- `GET /api/reviews/restaurant/:id` - Restaurant reviews
- `PUT /api/reviews/:id/like` - Like review

### Users
- `GET /api/users/profile/:id` - Get profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/follow/:id` - Follow user
- `GET /api/users/bookmarks` - Get bookmarks

[See full API documentation](API_INTEGRATION_GUIDE.md)

## 🎨 Custom Hooks

- `useAuth()` - Authentication state
- `useRestaurants()` - Fetch restaurants
- `useRestaurant()` - Single restaurant
- `useOrders()` - Order management
- `useReviews()` - Review system
- `useUserProfile()` - User profile data
- `useBookmarks()` - Saved restaurants

## 🧪 Testing

Run the testing checklist:
```bash
# See TESTING_CHECKLIST.md for detailed tests
```

Key tests:
- ✅ Authentication (login, signup, OTP)
- ✅ Restaurant browsing and filtering
- ✅ API integration
- ✅ Error handling
- ✅ Loading states

## 📊 Database Models

- **User**: Authentication, profile, social features
- **Restaurant**: Details, menu, location, ratings
- **Order**: Items, status, payment, delivery
- **Review**: Rating, comments, photos, likes
- **Booking**: Table reservations, confirmations

## 🔐 Security Features

- JWT token authentication
- Password hashing (bcrypt)
- Input validation
- XSS protection (Helmet)
- Rate limiting
- CORS configuration
- Secure headers

## 🌐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

### Frontend
API URL configured in `src/services/api.js`:
```javascript
const API_URL = 'http://localhost:5000/api';
```

## ScreenShots

# Home Page:

<img src="Project Images/Home.png" />


# Add Restaurant Page:

<img src="Project Images/AddRestaurant.png" />


# Order Online Page:

<img src="Project Images/OrderOnlinePage.png" />


# User Profile Page:

<img src="Project Images/UserProfilePage.png" />


# Hotel Order Page:

<img src="Project Images/HotelOrderPage.png" />


### Project Started Date: june, 11, 2022

### Project Completed Date: july 19, 2022
