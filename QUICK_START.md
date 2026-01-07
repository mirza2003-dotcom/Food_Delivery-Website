# 🚀 Quick Start Guide - Zomato Clone

## Prerequisites
- Node.js (v14 or higher)
- MongoDB Atlas account (free tier)
- npm or yarn

## Setup Instructions

### Step 1: Backend Setup

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Configure environment variables**:
Create `.env` file in backend directory:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your-secret-key-here
JWT_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

4. **Seed database** (optional but recommended):
```bash
node scripts/seedData.js
```

5. **Start backend server**:
```bash
npm start
```

Backend should now be running on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Navigate to project root** (if in backend folder):
```bash
cd ..
```

2. **Install dependencies** (if not already done):
```bash
npm install
```

3. **Start development server**:
```bash
npm run dev
```

Frontend should now be running on `http://localhost:5173`

## Test the Application

### Option 1: Login with Seeded Data
1. Go to `http://localhost:5173`
2. Click "Login"
3. Use these credentials:
   - **Email**: john@example.com
   - **Password**: password123

### Option 2: Create New Account
1. Click "Create Account"
2. Fill in:
   - Full Name
   - Email
   - Phone (10 digits)
   - Password (min 6 characters)
3. Accept terms and conditions
4. Click "Create Account"

### Option 3: Login with Phone OTP
1. Click "Login"
2. Enter 10-digit phone number
3. Click "Send OTP"
4. Enter the OTP code
5. Click "OK"

## Explore Features

### Browse Restaurants
- Click "Order Online", "Dining", or "Nightlife" tabs
- Browse restaurant listings
- Filter by cuisine, rating, price
- Click on any restaurant for details

### View Profile
- Click on user icon (top right)
- View your orders, reviews, photos
- Edit profile information
- Manage bookmarks and addresses

### Place Order (via code)
```javascript
const { createOrder } = useOrders();
await createOrder({
  restaurant: 'restaurant_id',
  items: [{ menuItem: 'item_id', quantity: 2 }],
  deliveryAddress: 'address_id',
  paymentMethod: 'online'
});
```

## Verify Setup

### Check Backend
Visit: `http://localhost:5000/api/restaurants`
- Should return JSON with restaurants

### Check Frontend
Visit: `http://localhost:5173`
- Should show Zomato homepage
- Login should work
- Restaurants should load

## Common Issues

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Try different port in .env
PORT=5001
```

### MongoDB connection fails
- Verify MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure username/password are correct

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Check API_URL in `src/services/api.js`

### Authentication not working
```javascript
// Clear localStorage in browser console
localStorage.clear()
// Then try login again
```

## Project Structure

```
zomato_clone/
├── backend/                    # Backend API
│   ├── config/                 # Configuration files
│   ├── controllers/            # Business logic
│   ├── models/                 # Database models
│   ├── routes/                 # API routes
│   ├── middleware/             # Auth & error handling
│   ├── utils/                  # Helper functions
│   ├── scripts/                # Database scripts
│   ├── .env                    # Environment variables
│   └── server.js               # Entry point
│
├── src/                        # Frontend React app
│   ├── components/             # React components
│   ├── pages/                  # Page components
│   ├── context/                # React context (Auth)
│   ├── hooks/                  # Custom hooks
│   ├── services/               # API service layer
│   ├── utils/                  # Utility components
│   └── main.jsx                # Entry point
│
├── API_INTEGRATION_GUIDE.md    # Detailed API docs
├── INTEGRATION_SUMMARY.md      # What's been done
└── README.md                   # Project overview
```

## Available Scripts

### Backend
```bash
npm start          # Start server
npm run dev        # Start with nodemon
node scripts/seedData.js  # Seed database
```

### Frontend
```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Next Steps

1. ✅ **Backend is running** - Port 5000
2. ✅ **Frontend is running** - Port 5173
3. ✅ **Database is seeded** - Test data available
4. ✅ **Login works** - Try john@example.com / password123
5. ✅ **Restaurants load** - Browse and filter restaurants
6. 🔄 **Explore more** - Orders, reviews, bookmarks

## Documentation

- **API Guide**: `API_INTEGRATION_GUIDE.md`
- **Integration Summary**: `INTEGRATION_SUMMARY.md`
- **Backend README**: `backend/README.md`

## Test Credentials

| User | Email | Password | Phone |
|------|-------|----------|-------|
| John Doe | john@example.com | password123 | 9876543210 |
| Jane Smith | jane@example.com | password123 | 9876543211 |
| Bob Wilson | bob@example.com | password123 | 9876543212 |

## Sample Data

After seeding, you'll have:
- 4 users
- 3 restaurants (Paradise Biryani, Pizza Hut, Cafe Coffee Day)
- 3 reviews
- Sample menu items

## Support

If you encounter issues:
1. Check console for errors (both browser and terminal)
2. Verify all dependencies are installed
3. Ensure MongoDB connection is working
4. Clear browser cache and localStorage
5. Restart both servers

## Development Tips

### Auto-reload
Both frontend and backend have hot-reload enabled:
- Frontend: Changes auto-reload in browser
- Backend: Uses nodemon for auto-restart

### Debugging
```javascript
// Frontend - Check auth state
console.log(localStorage.getItem('token'));

// Backend - Check requests
// Logs are shown in terminal
```

### API Testing
Use these tools to test API directly:
- Postman
- Thunder Client (VS Code extension)
- cURL commands

Example:
```bash
curl http://localhost:5000/api/restaurants
```

## Ready to Code! 🎉

Your Zomato clone is now fully integrated with:
- ✅ Authentication system
- ✅ Restaurant browsing
- ✅ User profiles
- ✅ Order system (hooks ready)
- ✅ Review system (hooks ready)
- ✅ Complete API layer

Start building features and enjoy! 🚀
