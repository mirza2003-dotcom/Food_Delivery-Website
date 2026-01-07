import { useState, useEffect } from 'react';
import { userAPI } from '../services/api';

export const useUserProfile = (userId = 'me') => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProfile();
    }, [userId]);

    const fetchProfile = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userAPI.getProfile(userId);
            setProfile(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch profile');
            setProfile(null);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await userAPI.updateProfile(profileData);
            setProfile(response.data);
            return { success: true, data: response.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to update profile' };
        }
    };

    const refetch = () => {
        fetchProfile();
    };

    return { profile, loading, error, updateProfile, refetch };
};

export const useUserReviews = (userId = 'me') => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchReviews();
    }, [userId]);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userAPI.getMyReviews(userId);
            setReviews(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch reviews');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchReviews();
    };

    return { reviews, loading, error, refetch };
};

export const useUserPhotos = (userId = 'me') => {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchPhotos();
    }, [userId]);

    const fetchPhotos = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userAPI.getMyPhotos(userId);
            setPhotos(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch photos');
            setPhotos([]);
        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchPhotos();
    };

    return { photos, loading, error, refetch };
};

export const useFollowers = (userId = 'me') => {
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchFollowers();
    }, [userId]);

    const fetchFollowers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userAPI.getFollowers(userId);
            setFollowers(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch followers');
            setFollowers([]);
        } finally {
            setLoading(false);
        }
    };

    const followUser = async (userIdToFollow) => {
        try {
            await userAPI.followUser(userIdToFollow);
            fetchFollowers();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to follow user' };
        }
    };

    const unfollowUser = async (userIdToUnfollow) => {
        try {
            await userAPI.unfollowUser(userIdToUnfollow);
            fetchFollowers();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to unfollow user' };
        }
    };

    const refetch = () => {
        fetchFollowers();
    };

    return { followers, loading, error, followUser, unfollowUser, refetch };
};

export const useBookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBookmarks();
    }, []);

    const fetchBookmarks = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await userAPI.getBookmarks();
            setBookmarks(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch bookmarks');
            setBookmarks([]);
        } finally {
            setLoading(false);
        }
    };

    const addBookmark = async (restaurantId) => {
        try {
            await userAPI.addBookmark(restaurantId);
            fetchBookmarks();
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to add bookmark' };
        }
    };

    const removeBookmark = async (restaurantId) => {
        try {
            await userAPI.removeBookmark(restaurantId);
            setBookmarks(prev => prev.filter(bookmark => bookmark._id !== restaurantId));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to remove bookmark' };
        }
    };

    const refetch = () => {
        fetchBookmarks();
    };

    return { bookmarks, loading, error, addBookmark, removeBookmark, refetch };
};
