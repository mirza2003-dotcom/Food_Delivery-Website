import { useState, useEffect } from 'react';
import { orderAPI } from '../services/api';

export const useOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await orderAPI.getMyOrders();
            setOrders(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch orders');
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (orderData) => {
        try {
            const response = await orderAPI.create(orderData);
            setOrders(prev => [response.data, ...prev]);
            return { success: true, data: response.data };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to create order' };
        }
    };

    const cancelOrder = async (orderId) => {
        try {
            await orderAPI.cancel(orderId);
            setOrders(prev => prev.map(order => 
                order._id === orderId ? { ...order, status: 'cancelled' } : order
            ));
            return { success: true };
        } catch (err) {
            return { success: false, message: err.response?.data?.message || 'Failed to cancel order' };
        }
    };

    const refetch = () => {
        fetchOrders();
    };

    return { orders, loading, error, createOrder, cancelOrder, refetch };
};
