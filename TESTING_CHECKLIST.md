# 🧪 Integration Testing Checklist

## Test Environment Status

✅ **Backend Server**: Running on `http://localhost:5000`
✅ **Frontend Server**: Running on `http://localhost:3001`
✅ **Database**: MongoDB Atlas connected
✅ **Sample Data**: Seeded with test users and restaurants

## Authentication Tests

### Login with Email/Password
- [ ] Open `http://localhost:3001`
- [ ] Click "Login" button
- [ ] Click "Continue with Email"
- [ ] Enter email: `john@example.com`
- [ ] Enter password: `password123`
- [ ] Click "Login"
- [ ] ✅ Should redirect to homepage with user logged in
- [ ] Check browser console - should see token in localStorage

### Login with Phone OTP
- [ ] Click "Login"
- [ ] Enter phone: `9876543210`
- [ ] Click "Send OTP"
- [ ] ✅ Should show "OTP sent" message
- [ ] Enter any 6-digit OTP (e.g., `123456`)
- [ ] Click "OK"
- [ ] ✅ Should verify and login user

### Registration
- [ ] Click "Create Account"
- [ ] Enter name: `Test User`
- [ ] Enter email: `test@example.com`
- [ ] Enter phone: `9999999999`
- [ ] Enter password: `password123`
- [ ] Check "Accept terms"
- [ ] Click "Create Account"
- [ ] ✅ Should create account and login
- [ ] Check network tab - should see POST to `/api/auth/register`

### Logout
- [ ] Click user profile icon
- [ ] Click "Logout"
- [ ] ✅ Should clear token and redirect to login

## Restaurant Browsing Tests

### View Restaurant List
- [ ] Navigate to ShowCase page (click Delivery/Dining/Nightlife)
- [ ] ✅ Should see loading state first
- [ ] ✅ Should display restaurants from API
- [ ] Check network tab - should see GET `/api/restaurants`
- [ ] ✅ Each restaurant card should show:
  - Restaurant name
  - Rating
  - Image
  - Delivery time

### Filter Restaurants
- [ ] On ShowCase page, click filter options
- [ ] Select "Rating: 4.0+"
- [ ] ✅ Should filter restaurants
- [ ] Check network tab - should see filtered request

### View Single Restaurant
- [ ] Click on any restaurant card
- [ ] ✅ Should navigate to restaurant details page
- [ ] ✅ Should show:
  - Restaurant info
  - Menu items
  - Reviews
  - Location
- [ ] Check network tab - should see GET `/api/restaurants/:id`

## User Profile Tests

### View Profile
- [ ] Click on user profile icon/name
- [ ] ✅ Should navigate to profile page
- [ ] ✅ Should display:
  - User name
  - Profile picture
  - Statistics (reviews, photos, followers)
- [ ] Check network tab - should see GET `/api/users/profile/me`

### View Orders
- [ ] On profile page, click "Order History"
- [ ] ✅ Should show user's orders
- [ ] Check network tab - should see GET `/api/orders/my-orders`

### View Reviews
- [ ] On profile page, click "Reviews"
- [ ] ✅ Should show user's reviews
- [ ] Check network tab - should see GET `/api/users/reviews/me`

## API Integration Tests

### Check API Responses
1. **Authentication**:
```javascript
// In browser console
localStorage.getItem('token')
// Should return JWT token
```

2. **Fetch Restaurants**:
```javascript
// In browser console
fetch('http://localhost:5000/api/restaurants')
  .then(r => r.json())
  .then(console.log)
// Should return restaurants array
```

3. **Authenticated Request**:
```javascript
// In browser console
const token = localStorage.getItem('token');
fetch('http://localhost:5000/api/auth/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(console.log)
// Should return current user data
```

## Error Handling Tests

### Invalid Login
- [ ] Try login with wrong password
- [ ] ✅ Should show error message
- [ ] ✅ Should not redirect

### Network Error
- [ ] Stop backend server
- [ ] Try to login
- [ ] ✅ Should show connection error
- [ ] Start backend again

### Unauthorized Access
- [ ] Clear localStorage
- [ ] Try to access profile page
- [ ] ✅ Should show "Please login" message or redirect

## Component Integration Tests

### ShowCase Page
- [ ] Visit `/showcase?page=orderOnline`
- [ ] ✅ Restaurants load from API
- [ ] ✅ Loading state shows
- [ ] ✅ Error handling works
- [ ] ✅ Empty state shows if no restaurants

### Restaurant Page
- [ ] Visit restaurant detail page
- [ ] ✅ Restaurant data loads
- [ ] ✅ Menu items display
- [ ] ✅ Reviews display
- [ ] ✅ Loading state shows

### User Page
- [ ] Visit user profile page
- [ ] ✅ Profile data loads
- [ ] ✅ Statistics update with real data
- [ ] ✅ Shows login prompt if not authenticated

## Hook Integration Tests

### useAuth Hook
```javascript
// Test in a component
import { useAuth } from './context/AuthContext';

const { user, isAuthenticated, login, logout } = useAuth();
console.log({ user, isAuthenticated });
// Should show current auth state
```

### useRestaurants Hook
```javascript
import { useRestaurants } from './hooks/useRestaurants';

const { restaurants, loading, error } = useRestaurants({
  type: 'delivery',
  minRating: 4
});
console.log({ restaurants, loading, error });
// Should fetch and display restaurants
```

### useOrders Hook
```javascript
import { useOrders } from './hooks/useOrders';

const { orders, loading, createOrder } = useOrders();
console.log({ orders, loading });
// Should fetch user orders
```

## Browser Console Tests

### Check for Errors
- [ ] Open browser DevTools (F12)
- [ ] Go to Console tab
- [ ] Navigate through app
- [ ] ✅ Should have no console errors (except expected API errors)

### Check Network Requests
- [ ] Open Network tab in DevTools
- [ ] Filter by XHR/Fetch
- [ ] Navigate through app
- [ ] ✅ Should see API requests to `localhost:5000`
- [ ] ✅ Should see proper status codes (200, 201, etc.)

### Check localStorage
- [ ] Open Application/Storage tab
- [ ] Check localStorage
- [ ] ✅ Should see `token` after login
- [ ] ✅ Token should be cleared after logout

## Performance Tests

### Page Load Time
- [ ] Clear cache
- [ ] Reload homepage
- [ ] ✅ Should load within 2 seconds

### API Response Time
- [ ] Check Network tab
- [ ] Look at API request timings
- [ ] ✅ Most requests should complete under 500ms

### Image Loading
- [ ] Check if restaurant images load
- [ ] ✅ Should use placeholder if image fails
- [ ] ✅ Should load images progressively

## Integration Verification

### Data Flow Check
1. **Login Flow**:
   - User enters credentials
   - → Frontend calls `/api/auth/login`
   - → Backend validates and returns token
   - → Frontend stores token in localStorage
   - → AuthContext updates user state
   - → UI updates to show logged-in state
   - ✅ All steps should complete successfully

2. **Restaurant Fetch Flow**:
   - Component mounts
   - → useRestaurants hook calls API
   - → Backend queries MongoDB
   - → Returns restaurant data
   - → Hook updates state
   - → Component renders data
   - ✅ All steps should complete successfully

3. **Protected Route Flow**:
   - User tries to access profile
   - → AuthContext checks authentication
   - → If not logged in, shows login prompt
   - → If logged in, loads profile data
   - ✅ Should work correctly

## Final Verification

### All Systems Go
- [ ] ✅ Backend running without errors
- [ ] ✅ Frontend running without errors
- [ ] ✅ MongoDB connected
- [ ] ✅ API calls successful
- [ ] ✅ Authentication working
- [ ] ✅ Data displaying correctly
- [ ] ✅ No console errors
- [ ] ✅ No network errors

## Common Issues & Solutions

### Issue: API calls fail with CORS error
**Solution**: Check backend CORS configuration in `server.js`

### Issue: Token not saved
**Solution**: Check if localStorage is enabled in browser

### Issue: Data not loading
**Solution**: 
1. Check if backend is running
2. Check network tab for failed requests
3. Verify API endpoint URLs

### Issue: Components not updating
**Solution**:
1. Check if hooks are properly imported
2. Verify component is using state correctly
3. Check React DevTools for state changes

## Test Results

Date: _________________

| Test Category | Pass | Fail | Notes |
|--------------|------|------|-------|
| Authentication | ☐ | ☐ | |
| Restaurant Browsing | ☐ | ☐ | |
| User Profile | ☐ | ☐ | |
| API Integration | ☐ | ☐ | |
| Error Handling | ☐ | ☐ | |
| Performance | ☐ | ☐ | |

## Overall Status: ________________

Tester Signature: _________________

---

**Note**: Run these tests after any major changes to ensure integration still works correctly.
