import { useState, useEffect } from 'react';
import { reviewAPI } from '../services/api';

export const useReviews = (restaurantId) => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!restaurantId) return;
        fetchReviews();
    }, [restaurantId]);

    const fetchReviews = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await reviewAPI.getByRestaurant(restaurantId);
            setReviews(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch reviews');
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const createReview = async (reviewData) => {
        try {
            const response = await reviewAPI.create(reviewData);
            setReviews(prev => [response.data, ...prev]);
            return { success: true, data: response.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to create review' };
        }
    };

    const likeReview = async (reviewId) => {
        try {
            await reviewAPI.like(reviewId);
            setReviews(prev => prev.map(review => 
                review._id === reviewId 
                    ? { ...review, likes: review.likes + 1, isLiked: true } 
                    : review
            ));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to like review' };
        }
    };

    const replyToReview = async (reviewId, replyText) => {
        try {
            const response = await reviewAPI.reply(reviewId, { text: replyText });
            setReviews(prev => prev.map(review => 
                review._id === reviewId 
                    ? { ...review, reply: response.data } 
                    : review
            ));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to reply to review' };
        }
    };

    const refetch = () => {
        fetchReviews();
    };

    return { reviews, loading, error, createReview, likeReview, replyToReview, refetch };
};
