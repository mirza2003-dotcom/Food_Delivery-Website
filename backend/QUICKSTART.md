# Quick Start Guide

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation Steps

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
NODE_ENV=development
PORT=5000

# MongoDB - Choose one:
# Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/zomato_clone

# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/zomato_clone

# JWT Configuration
JWT_SECRET=your_super_secret_key_here_change_in_production
JWT_EXPIRE=7d

# Email (Optional - for OTP feature)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (Optional - for image uploads)
# Leave empty to use local file storage
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### 3. Start MongoDB

If using local MongoDB:

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

Or use MongoDB Atlas (cloud database) - no installation needed!

### 4. Seed Sample Data (Optional)

```bash
npm run seed
```

This will create sample users, restaurants, and reviews.

**Sample Login Credentials:**
- User: `john@example.com` / `password123`
- Restaurant Owner: `owner@example.com` / `password123`
- Admin: `admin@example.com` / `password123`

### 5. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start at `http://localhost:5000`

### 6. Test the API

Visit `http://localhost:5000` in your browser or use tools like:
- Postman
- Thunder Client (VS Code extension)
- cURL

Health check:
```bash
curl http://localhost:5000/api/health
```

## Project Structure

```
backend/
├── config/
│   └── db.js              # Database connection
├── controllers/           # Request handlers
│   ├── authController.js
│   ├── userController.js
│   ├── restaurantController.js
│   ├── orderController.js
│   ├── reviewController.js
│   └── bookingController.js
├── models/               # Database schemas
│   ├── User.js
│   ├── Restaurant.js
│   ├── Order.js
│   ├── Review.js
│   └── Booking.js
├── routes/              # API routes
│   ├── auth.js
│   ├── users.js
│   ├── restaurants.js
│   ├── orders.js
│   ├── reviews.js
│   └── bookings.js
├── middleware/          # Custom middleware
│   ├── auth.js         # Authentication
│   ├── error.js        # Error handling
│   └── validator.js    # Input validation
├── utils/              # Utility functions
│   ├── auth.js        # JWT helpers
│   ├── email.js       # Email sending
│   └── cloudinary.js  # Image upload
├── scripts/           # Utility scripts
│   └── seedData.js   # Database seeding
├── docs/             # Documentation
│   └── API.md       # API documentation
├── .env             # Environment variables
├── .env.example     # Example env file
├── .gitignore
├── package.json
├── README.md
└── server.js        # Entry point
```

## Common Issues & Solutions

### Issue: MongoDB Connection Error

**Solution:**
- Ensure MongoDB is running: `mongod` or check MongoDB Atlas connection string
- Verify MONGODB_URI in .env file
- Check if port 27017 is available (for local MongoDB)

### Issue: JWT Token Error

**Solution:**
- Ensure JWT_SECRET is set in .env
- Check if token is being sent in Authorization header: `Bearer <token>`

### Issue: Image Upload Failing

**Solution:**
- If using Cloudinary, verify credentials in .env
- If not using Cloudinary, ensure `uploads/` directory exists
- Check file size (max 5MB)

### Issue: Email/OTP Not Working

**Solution:**
- Configure email credentials in .env
- For Gmail, use an "App Password" instead of your regular password
- Enable "Less secure app access" or use OAuth2

### Issue: CORS Error from Frontend

**Solution:**
- Update FRONTEND_URL in .env to match your frontend URL
- Ensure CORS is enabled in server.js

## Testing the API

### Register a New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543299",
    "password": "password123"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response and use it for protected routes:

```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Get Restaurants

```bash
curl http://localhost:5000/api/restaurants
```

## Next Steps

1. **Integrate with Frontend:** Update frontend API calls to point to `http://localhost:5000/api`

2. **Setup Cloudinary:** 
   - Sign up at https://cloudinary.com
   - Get credentials from dashboard
   - Add to .env file

3. **Configure Email:**
   - Setup SMTP credentials
   - Test OTP functionality

4. **Deploy:**
   - Deploy to platforms like Heroku, Railway, or Render
   - Use MongoDB Atlas for production database

## Development Tips

- Use Postman or Thunder Client to test APIs
- Check server logs for debugging
- Use MongoDB Compass to view database
- Enable Morgan logging in development

## Support

For issues or questions:
- Check the API documentation: `docs/API.md`
- Review error logs in console
- Verify environment variables

Happy coding! 🚀
