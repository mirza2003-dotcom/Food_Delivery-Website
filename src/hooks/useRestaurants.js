import { useState, useEffect } from 'react';
import { restaurantAPI } from '../services/api';

export const useRestaurants = (filters = {}) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1,
        limit: 10
    });

    useEffect(() => {
        fetchRestaurants();
    }, [JSON.stringify(filters)]);

    const fetchRestaurants = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await restaurantAPI.getAll(filters);
            // response is already the data object from API
            setRestaurants(response.data || []);
            setPagination({
                total: response.total || 0,
                page: response.currentPage || 1,
                pages: response.pages || 1,
                limit: 20
            });
        } catch (err) {
            setError(err.message || 'Failed to fetch restaurants');
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchRestaurants();
    };

    return { restaurants, loading, error, pagination, refetch };
};

export const useRestaurant = (restaurantId) => {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRestaurant = async () => {
            if (!restaurantId) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);

            try {
                console.log('🏪 Fetching restaurant with ID:', restaurantId);
                const response = await restaurantAPI.getById(restaurantId);
                console.log('🏪 Restaurant API response:', response);
                console.log('🏪 Restaurant data:', response.data);
                console.log('🏪 Restaurant name:', response.data?.name);
                setRestaurant(response.data || null);
            } catch (err) {
                console.error('Error fetching restaurant:', err);
                setError(err.message || 'Failed to fetch restaurant');
                setRestaurant(null);
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [restaurantId]);

    const refetch = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await restaurantAPI.getById(restaurantId);
            setRestaurant(response.data || null);
        } catch (err) {
            setError(err.message || 'Failed to fetch restaurant');
            setRestaurant(null);
        } finally {
            setLoading(false);
        }
    };

    return { restaurant, loading, error, refetch };
};

export const useCollections = (city = '') => {
    const [collections, setCollections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCollections();
    }, [city]);

    const fetchCollections = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await restaurantAPI.getCollections(city);
            setCollections(response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch collections');
            setCollections([]);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchCollections();
    };

    return { collections, loading, error, refetch };
};

export const useNearbyRestaurants = (lat, lng, radius = 5) => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!lat || !lng) return;
        fetchNearbyRestaurants();
    }, [lat, lng, radius]);

    const fetchNearbyRestaurants = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await restaurantAPI.getNearby(lat, lng, radius);
            setRestaurants(response.data || []);
        } catch (err) {
            setError(err.message || 'Failed to fetch nearby restaurants');
            setRestaurants([]);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchNearbyRestaurants();
    };

    return { restaurants, loading, error, refetch };
};
