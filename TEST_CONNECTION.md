# 🔍 Connection Test & Troubleshooting Guide

## Current Status
✅ **Backend**: Running on `http://localhost:5000`
✅ **Frontend**: Running on `http://localhost:3000`
✅ **MongoDB**: Connected successfully

## Test the Connection

### Step 1: Test Backend API Directly

Open your browser and visit these URLs to verify the backend is working:

1. **Health Check**:
```
http://localhost:5000/api/restaurants
```
Should return JSON with restaurants list

2. **Check All Endpoints**:
```
http://localhost:5000/api/auth/health
```

### Step 2: Test Frontend Connection

Open browser console (F12) on `http://localhost:3000` and run:

```javascript
// Test 1: Check if fetch works
fetch('http://localhost:5000/api/restaurants')
  .then(r => r.json())
  .then(data => console.log('✅ Backend connected:', data))
  .catch(err => console.error('❌ Backend error:', err));

// Test 2: Check CORS
fetch('http://localhost:5000/api/restaurants', {
  method: 'GET',
  headers: { 'Content-Type': 'application/json' }
})
  .then(r => r.json())
  .then(data => console.log('✅ CORS working:', data))
  .catch(err => console.error('❌ CORS error:', err));
```

## Common Issues & Solutions

### Issue 1: "Cannot fetch data" or "Network Error"

**Cause**: Backend not running or wrong URL

**Solution**:
```bash
# Check if backend is running
curl http://localhost:5000/api/restaurants

# If not working, restart backend
cd backend
npm start
```

### Issue 2: "CORS Error"

**Cause**: CORS not configured properly

**Solution**: Check `backend/server.js` has:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Issue 3: "401 Unauthorized" for Protected Routes

**Cause**: No token or expired token

**Solution**:
```javascript
// In browser console, check token
console.log(localStorage.getItem('token'));

// If null or expired, login again
// Clear old token
localStorage.clear();
```

### Issue 4: Registration Not Working

**Possible causes**:
1. Email already exists
2. Phone number format wrong
3. Password too short
4. Network request failing

**Debug in browser console**:
```javascript
// Open Network tab in DevTools
// Try to register
// Check the failed request
// Look at the response for error message
```

## Step-by-Step Registration Test

### 1. Open Frontend
Visit: `http://localhost:3000`

### 2. Open Browser DevTools (F12)
- Go to Console tab
- Go to Network tab

### 3. Click "Create Account"

### 4. Fill Registration Form
- Name: Test User
- Email: test123@example.com
- Phone: 9999999999
- Password: password123
- Check "Accept terms"

### 5. Click "Create Account"

### 6. Check Network Tab
Look for request to: `POST http://localhost:5000/api/auth/register`

**If request shows**:
- ✅ **Status 201**: Success! User created
- ❌ **Status 400**: Bad request - check error message
- ❌ **Status 409**: User already exists
- ❌ **Failed/CORS**: Connection issue

### 7. Check Console Tab
Should see:
- No red errors
- Token stored in localStorage

## Verify Data Fetching

### Test 1: Login
```javascript
// In browser console
const loginTest = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'john@example.com',
        password: 'password123'
      })
    });
    const data = await response.json();
    console.log('Login result:', data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      console.log('✅ Token saved!');
    }
  } catch (error) {
    console.error('❌ Login failed:', error);
  }
};
loginTest();
```

### Test 2: Fetch Restaurants (No Auth Required)
```javascript
const fetchRestaurants = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/restaurants');
    const data = await response.json();
    console.log('✅ Restaurants:', data);
  } catch (error) {
    console.error('❌ Failed to fetch:', error);
  }
};
fetchRestaurants();
```

### Test 3: Fetch User Profile (Auth Required)
```javascript
const fetchProfile = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.error('❌ No token found. Login first!');
    return;
  }
  
  try {
    const response = await fetch('http://localhost:5000/api/auth/me', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    console.log('✅ Profile:', data);
  } catch (error) {
    console.error('❌ Failed to fetch profile:', error);
  }
};
fetchProfile();
```

## Check Frontend Code

### Verify API Service
Check if `src/services/api.js` has correct URL:
```javascript
const API_URL = 'http://localhost:5000/api';
```

### Verify AuthContext
Check if `src/context/AuthContext.jsx` is imported in `main.jsx`:
```javascript
import { AuthProvider } from './context/AuthContext';

// Wrapped around app
<AuthProvider>
  <RouterProvider router={router} />
</AuthProvider>
```

## Debug Mode

### Enable Detailed Logging

Add this to your component:
```javascript
import { useAuth } from './context/AuthContext';

const { user, isAuthenticated } = useAuth();

console.log('Auth State:', { user, isAuthenticated });
console.log('Token:', localStorage.getItem('token'));
```

### Check API Calls

In `src/services/api.js`, add logging:
```javascript
// Add interceptor
api.interceptors.request.use(config => {
  console.log('API Request:', config.method, config.url);
  return config;
});

api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);
```

## Full Test Sequence

### 1. Test Backend Directly
```bash
# Test restaurants endpoint
curl http://localhost:5000/api/restaurants

# Expected: JSON with restaurants array
```

### 2. Test Registration
1. Go to `http://localhost:3000`
2. Click "Create Account"
3. Enter new user details
4. Submit form
5. Check Network tab for API call
6. Check Console for errors

### 3. Test Login
1. Click "Login"
2. Enter: john@example.com / password123
3. Submit
4. Check if token is saved in localStorage
5. Check if user state updates

### 4. Test Data Fetching
1. Navigate to restaurant listing page
2. Open Network tab
3. Should see GET request to `/api/restaurants`
4. Should see restaurants displayed

## Quick Fixes

### Fix 1: Clear Everything and Restart
```bash
# Stop both servers (Ctrl+C)

# Clear browser data
# In browser console:
localStorage.clear();
sessionStorage.clear();

# Restart backend
cd backend
npm start

# Restart frontend (new terminal)
cd ..
npm run dev
```

### Fix 2: Check MongoDB Data
```bash
# In backend directory
node scripts/checkData.js
```

### Fix 3: Reseed Database
```bash
cd backend
node scripts/seedData.js
```

## Expected Results

### ✅ Working Registration
1. Form submits without errors
2. Network shows: POST `/api/auth/register` - Status 201
3. Console shows: "Registration successful"
4. User is logged in automatically
5. Token is stored in localStorage
6. Redirects to homepage

### ✅ Working Data Fetch
1. Page loads without errors
2. Network shows: GET `/api/restaurants` - Status 200
3. Restaurants display on page
4. No console errors

### ✅ Working Authentication
1. Login form works
2. Token is saved
3. User state updates
4. Protected routes accessible
5. Logout clears token

## Still Not Working?

### Check These:

1. **Backend Console**: Any error messages?
2. **Frontend Console**: Any red errors?
3. **Network Tab**: What's the failed request?
4. **MongoDB**: Is it connected? Check backend console
5. **Ports**: Backend on 5000, Frontend on 3000?

### Get Detailed Info

Run this in browser console:
```javascript
console.log('=== DEBUG INFO ===');
console.log('Frontend URL:', window.location.href);
console.log('API URL:', 'http://localhost:5000/api');
console.log('Token:', localStorage.getItem('token'));
console.log('User:', JSON.parse(localStorage.getItem('user') || 'null'));

// Test connection
fetch('http://localhost:5000/api/restaurants')
  .then(r => {
    console.log('Backend Status:', r.status);
    return r.json();
  })
  .then(data => console.log('Backend Data:', data))
  .catch(err => console.error('Backend Error:', err));
```

## Contact Points

If still facing issues, check:
1. Backend terminal for errors
2. Frontend terminal for errors
3. Browser console for JavaScript errors
4. Network tab for failed requests
5. MongoDB connection status

---

**Current Configuration**:
- Backend: `http://localhost:5000`
- Frontend: `http://localhost:3000`
- MongoDB: Atlas (cloud)
- Auth: JWT tokens

**Test User**:
- Email: john@example.com
- Password: password123
