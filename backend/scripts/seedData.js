import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Booking from '../models/Booking.js';

dotenv.config();

// Connect to DB
mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    // Clear existing data
    console.log('Clearing existing data...');
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Booking.deleteMany();

    // Create users
    console.log('Creating users...');
    const users = await User.create([
      {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '9876543210',
        password: 'password123',
        isVerified: true,
        role: 'user'
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        phone: '9876543211',
        password: 'password123',
        isVerified: true,
        role: 'user'
      },
      {
        name: 'Restaurant Owner',
        email: 'owner@example.com',
        phone: '9876543212',
        password: 'password123',
        isVerified: true,
        role: 'restaurant_owner'
      },
      {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '9876543213',
        password: 'password123',
        isVerified: true,
        role: 'admin'
      }
    ]);

    console.log('Users created:', users.length);

    // Create restaurants
    console.log('Creating restaurants...');
    const restaurants = await Restaurant.create([
      {
        name: 'Pizza Paradise',
        description: 'Best pizzas in town with authentic Italian flavors',
        cuisines: ['Italian', 'Pizza', 'Fast Food'],
        category: 'order-online',
        coverImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591',
        address: {
          street: '123 Park Street',
          area: 'Park Street',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700016',
          landmark: 'Near Metro Station'
        },
        location: {
          type: 'Point',
          coordinates: [88.3639, 22.5726]
        },
        contact: {
          phone: '9876543220',
          email: 'info@pizzaparadise.com',
          website: 'www.pizzaparadise.com'
        },
        timing: {
          monday: { open: '11:00', close: '23:00', isOpen: true },
          tuesday: { open: '11:00', close: '23:00', isOpen: true },
          wednesday: { open: '11:00', close: '23:00', isOpen: true },
          thursday: { open: '11:00', close: '23:00', isOpen: true },
          friday: { open: '11:00', close: '23:00', isOpen: true },
          saturday: { open: '11:00', close: '23:30', isOpen: true },
          sunday: { open: '11:00', close: '23:30', isOpen: true }
        },
        costForTwo: 600,
        menu: [
          {
            category: 'Pizzas',
            items: [
              {
                name: 'Margherita Pizza',
                description: 'Classic pizza with tomato sauce and mozzarella',
                price: 299,
                isVeg: true,
                isAvailable: true,
                tags: ['Bestseller']
              },
              {
                name: 'Pepperoni Pizza',
                description: 'Pizza topped with pepperoni and cheese',
                price: 399,
                isVeg: false,
                isAvailable: true,
                tags: ['Spicy']
              }
            ]
          },
          {
            category: 'Sides',
            items: [
              {
                name: 'Garlic Bread',
                description: 'Toasted bread with garlic butter',
                price: 149,
                isVeg: true,
                isAvailable: true
              }
            ]
          }
        ],
        features: {
          hasParking: true,
          hasWifi: true,
          hasAC: true,
          hasOutdoorSeating: false,
          acceptsCards: true,
          hasHomeDelivery: true,
          hasTakeaway: true
        },
        owner: users[2]._id,
        isActive: true,
        isVerified: true,
        popularDishes: ['Margherita Pizza', 'Pepperoni Pizza']
      },
      {
        name: 'Biryani House',
        description: 'Authentic Kolkata Biryani and Mughlai cuisine',
        cuisines: ['Indian', 'Biryani', 'Mughlai'],
        category: 'order-online',
        coverImage: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8',
        address: {
          street: '456 Sector V',
          area: 'Salt Lake',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700091',
          landmark: 'Opposite Big Mall'
        },
        location: {
          type: 'Point',
          coordinates: [88.4324, 22.5744]
        },
        contact: {
          phone: '9876543221',
          email: 'contact@biryanihouse.com'
        },
        timing: {
          monday: { open: '12:00', close: '23:00', isOpen: true },
          tuesday: { open: '12:00', close: '23:00', isOpen: true },
          wednesday: { open: '12:00', close: '23:00', isOpen: true },
          thursday: { open: '12:00', close: '23:00', isOpen: true },
          friday: { open: '12:00', close: '23:30', isOpen: true },
          saturday: { open: '12:00', close: '23:30', isOpen: true },
          sunday: { open: '12:00', close: '23:30', isOpen: true }
        },
        costForTwo: 800,
        menu: [
          {
            category: 'Biryani',
            items: [
              {
                name: 'Chicken Biryani',
                description: 'Aromatic basmati rice with tender chicken',
                price: 350,
                isVeg: false,
                isAvailable: true,
                tags: ['Bestseller', 'Signature']
              },
              {
                name: 'Veg Biryani',
                description: 'Flavorful rice with mixed vegetables',
                price: 280,
                isVeg: true,
                isAvailable: true
              }
            ]
          }
        ],
        features: {
          hasParking: true,
          hasWifi: false,
          hasAC: true,
          hasOutdoorSeating: false,
          acceptsCards: true,
          hasHomeDelivery: true,
          hasTakeaway: true
        },
        owner: users[2]._id,
        isActive: true,
        isVerified: true,
        popularDishes: ['Chicken Biryani']
      },
      {
        name: 'The Coffee Club',
        description: 'Premium coffee and desserts',
        cuisines: ['Cafe', 'Coffee', 'Desserts'],
        category: 'dinning-out',
        coverImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb',
        address: {
          street: '789 Action Area',
          area: 'New Town',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700156',
          landmark: 'Near Tech Park'
        },
        location: {
          type: 'Point',
          coordinates: [88.4715, 22.5958]
        },
        contact: {
          phone: '9876543222',
          email: 'hello@coffeeclub.com',
          website: 'www.coffeeclub.com'
        },
        timing: {
          monday: { open: '08:00', close: '22:00', isOpen: true },
          tuesday: { open: '08:00', close: '22:00', isOpen: true },
          wednesday: { open: '08:00', close: '22:00', isOpen: true },
          thursday: { open: '08:00', close: '22:00', isOpen: true },
          friday: { open: '08:00', close: '23:00', isOpen: true },
          saturday: { open: '08:00', close: '23:00', isOpen: true },
          sunday: { open: '08:00', close: '23:00', isOpen: true }
        },
        costForTwo: 500,
        menu: [
          {
            category: 'Coffee',
            items: [
              {
                name: 'Cappuccino',
                description: 'Classic Italian coffee with steamed milk',
                price: 180,
                isVeg: true,
                isAvailable: true
              },
              {
                name: 'Cold Brew',
                description: 'Smooth cold brewed coffee',
                price: 220,
                isVeg: true,
                isAvailable: true,
                tags: ['Bestseller']
              }
            ]
          }
        ],
        features: {
          hasParking: true,
          hasWifi: true,
          hasAC: true,
          hasOutdoorSeating: true,
          acceptsCards: true,
          hasHomeDelivery: false,
          hasTakeaway: true
        },
        owner: users[2]._id,
        isActive: true,
        isVerified: true,
        popularDishes: ['Cold Brew', 'Cappuccino']
      },
      {
        name: 'The Lounge Bar',
        description: 'Premium cocktails and live music',
        cuisines: ['Bar', 'Continental', 'Finger Food'],
        category: 'night-life',
        coverImage: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b',
        address: {
          street: '15 Ballygunge Circular Road',
          area: 'Ballygunge',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700019',
          landmark: 'Near Film Center'
        },
        location: {
          type: 'Point',
          coordinates: [88.3661, 22.5354]
        },
        contact: {
          phone: '9876543223',
          email: 'info@loungebar.com',
          website: 'www.loungebar.com'
        },
        timing: {
          monday: { open: '18:00', close: '02:00', isOpen: true },
          tuesday: { open: '18:00', close: '02:00', isOpen: true },
          wednesday: { open: '18:00', close: '02:00', isOpen: true },
          thursday: { open: '18:00', close: '02:00', isOpen: true },
          friday: { open: '18:00', close: '03:00', isOpen: true },
          saturday: { open: '18:00', close: '03:00', isOpen: true },
          sunday: { open: '18:00', close: '02:00', isOpen: true }
        },
        costForTwo: 1500,
        menu: [
          {
            category: 'Cocktails',
            items: [
              {
                name: 'Mojito',
                description: 'Classic rum cocktail with mint and lime',
                price: 450,
                isVeg: true,
                isAvailable: true,
                tags: ['Bestseller']
              },
              {
                name: 'Long Island Iced Tea',
                description: 'Strong cocktail with multiple spirits',
                price: 550,
                isVeg: true,
                isAvailable: true
              }
            ]
          },
          {
            category: 'Appetizers',
            items: [
              {
                name: 'Chicken Wings',
                description: 'Spicy buffalo wings',
                price: 380,
                isVeg: false,
                isAvailable: true
              }
            ]
          }
        ],
        features: {
          hasParking: true,
          hasWifi: true,
          hasAC: true,
          hasOutdoorSeating: true,
          acceptsCards: true,
          hasHomeDelivery: false,
          hasTakeaway: false
        },
        owner: users[2]._id,
        isActive: true,
        isVerified: true,
        popularDishes: ['Mojito', 'Long Island Iced Tea']
      },
      {
        name: 'Skyline Pub',
        description: 'Rooftop pub with city views and craft beer',
        cuisines: ['Pub', 'North Indian', 'Chinese'],
        category: 'night-life',
        coverImage: 'https://images.unsplash.com/photo-1572116469696-31de0f17cc34',
        address: {
          street: '22 Judges Court Road',
          area: 'Alipore',
          city: 'Kolkata',
          state: 'West Bengal',
          pincode: '700027',
          landmark: 'Near South City Mall'
        },
        location: {
          type: 'Point',
          coordinates: [88.3302, 22.5352]
        },
        contact: {
          phone: '9876543224',
          email: 'hello@skylinepub.com'
        },
        timing: {
          monday: { open: '17:00', close: '01:00', isOpen: true },
          tuesday: { open: '17:00', close: '01:00', isOpen: true },
          wednesday: { open: '17:00', close: '01:00', isOpen: true },
          thursday: { open: '17:00', close: '01:00', isOpen: true },
          friday: { open: '17:00', close: '02:00', isOpen: true },
          saturday: { open: '17:00', close: '02:00', isOpen: true },
          sunday: { open: '17:00', close: '01:00', isOpen: true }
        },
        costForTwo: 1200,
        menu: [
          {
            category: 'Beer',
            items: [
              {
                name: 'Craft Beer Pitcher',
                description: 'House special craft beer',
                price: 650,
                isVeg: true,
                isAvailable: true,
                tags: ['Bestseller']
              }
            ]
          }
        ],
        features: {
          hasParking: true,
          hasWifi: true,
          hasAC: false,
          hasOutdoorSeating: true,
          acceptsCards: true,
          hasHomeDelivery: false,
          hasTakeaway: false
        },
        owner: users[2]._id,
        isActive: true,
        isVerified: true,
        popularDishes: ['Craft Beer', 'Tandoori Chicken']
      }
    ]);

    console.log('Restaurants created:', restaurants.length);

    // Create reviews
    console.log('Creating reviews...');
    const reviews = await Review.create([
      {
        user: users[0]._id,
        restaurant: restaurants[0]._id,
        rating: 5,
        title: 'Amazing Pizza!',
        comment: 'Best pizza I have ever had. The crust was perfect and toppings were fresh.',
        orderVerified: true
      },
      {
        user: users[1]._id,
        restaurant: restaurants[0]._id,
        rating: 4,
        title: 'Good but can improve',
        comment: 'Pizza was good but delivery took longer than expected.',
        orderVerified: true
      },
      {
        user: users[0]._id,
        restaurant: restaurants[1]._id,
        rating: 5,
        title: 'Authentic Biryani',
        comment: 'Finally found authentic Kolkata biryani. Highly recommended!',
        orderVerified: true
      }
    ]);

    console.log('Reviews created:', reviews.length);

    // Update restaurant ratings
    for (const restaurant of restaurants) {
      const restaurantReviews = reviews.filter(
        r => r.restaurant.toString() === restaurant._id.toString()
      );

      if (restaurantReviews.length > 0) {
        const avgRating = restaurantReviews.reduce((sum, r) => sum + r.rating, 0) / restaurantReviews.length;
        const distribution = { five: 0, four: 0, three: 0, two: 0, one: 0 };
        
        restaurantReviews.forEach(r => {
          const key = ['one', 'two', 'three', 'four', 'five'][r.rating - 1];
          distribution[key]++;
        });

        restaurant.ratings = {
          average: avgRating,
          count: restaurantReviews.length,
          distribution
        };

        await restaurant.save();
      }
    }

    console.log('✅ Database seeded successfully!');
    console.log('\nSample Credentials:');
    console.log('User: john@example.com / password123');
    console.log('Restaurant Owner: owner@example.com / password123');
    console.log('Admin: admin@example.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
