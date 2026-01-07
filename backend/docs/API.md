# API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header or as a cookie.

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "count": 10,
  "total": 100,
  "pages": 10,
  "currentPage": 1
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message here"
}
```

## Endpoints

### Authentication

#### Register User
```
POST /auth/register

Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "9876543210",
  "password": "password123"
}

Response: User object + JWT token
```

#### Login
```
POST /auth/login

Body:
{
  "email": "john@example.com",
  "password": "password123"
}

Response: User object + JWT token
```

#### Send OTP
```
POST /auth/send-otp

Body:
{
  "phone": "9876543210",
  "email": "john@example.com"  // optional
}

Response: Success message
```

#### Verify OTP
```
POST /auth/verify-otp

Body:
{
  "phone": "9876543210",
  "otp": "123456"
}

Response: User object + JWT token
```

### Restaurants

#### Get All Restaurants
```
GET /restaurants?page=1&limit=20&category=order-online&cuisines=Italian,Pizza&minRating=4&maxCost=1000&search=pizza

Query Parameters:
- page: Page number (default: 1)
- limit: Items per page (default: 20)
- category: Filter by category
- cuisines: Comma-separated cuisines
- minRating: Minimum rating
- maxCost: Maximum cost for two
- search: Search term
- lat, lng, radius: For geospatial search

Response: Array of restaurants
```

#### Get Single Restaurant
```
GET /restaurants/:id

Response: Restaurant object with recent reviews
```

#### Create Restaurant (Protected - Owner/Admin)
```
POST /restaurants
Authorization: Bearer <token>

Body:
{
  "name": "My Restaurant",
  "description": "Great food",
  "cuisines": ["Indian", "Chinese"],
  "category": "order-online",
  "coverImage": "url",
  "address": { ... },
  "location": {
    "type": "Point",
    "coordinates": [lng, lat]
  },
  "contact": { ... },
  "costForTwo": 500,
  ...
}

Response: Created restaurant
```

### Orders

#### Create Order (Protected)
```
POST /orders
Authorization: Bearer <token>

Body:
{
  "restaurant": "restaurantId",
  "items": [
    {
      "menuItem": {
        "name": "Pizza",
        "price": 299
      },
      "quantity": 2,
      "price": 598
    }
  ],
  "deliveryAddress": { ... },
  "paymentMethod": "card",
  "specialInstructions": "Extra cheese"
}

Response: Created order
```

#### Get My Orders (Protected)
```
GET /orders/my-orders?page=1&limit=20&status=delivered

Response: Array of user's orders
```

### Reviews

#### Create Review (Protected)
```
POST /reviews
Authorization: Bearer <token>

Body:
{
  "restaurant": "restaurantId",
  "rating": 5,
  "title": "Great food!",
  "comment": "Loved the pizza",
  "photos": [
    {
      "url": "photo_url",
      "caption": "Delicious"
    }
  ],
  "isAnonymous": false
}

Response: Created review
```

#### Get Restaurant Reviews
```
GET /reviews/restaurant/:restaurantId?page=1&limit=20&rating=5&sort=-createdAt

Response: Array of reviews
```

### Users

#### Get User Profile
```
GET /users/:id

Response: User profile with stats
```

#### Update Profile (Protected)
```
PUT /users/profile
Authorization: Bearer <token>

Body:
{
  "name": "Updated Name",
  "bio": "Food lover"
}

Response: Updated user
```

#### Add Address (Protected)
```
POST /users/addresses
Authorization: Bearer <token>

Body:
{
  "label": "Home",
  "addressLine1": "123 Street",
  "city": "Kolkata",
  "state": "West Bengal",
  "pincode": "700001",
  "isDefault": true
}

Response: Array of addresses
```

### Bookings

#### Create Booking (Protected)
```
POST /bookings
Authorization: Bearer <token>

Body:
{
  "restaurant": "restaurantId",
  "date": "2024-01-15",
  "time": "19:00",
  "numberOfGuests": 4,
  "tablePreference": "outdoor",
  "occasion": "birthday",
  "specialRequests": "Window seat please"
}

Response: Created booking
```

## Pagination

Most list endpoints support pagination:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

Response includes:
- `count`: Items in current page
- `total`: Total items
- `pages`: Total pages
- `currentPage`: Current page number

## Sorting

Use the `sort` parameter:
- Ascending: `sort=price`
- Descending: `sort=-price`
- Multiple: `sort=-rating,price`

## Filtering

Most endpoints support filtering through query parameters.

Example:
```
GET /restaurants?category=order-online&cuisines=Italian,Pizza&minRating=4
```

## Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error
