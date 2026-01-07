import { useState, useCallback } from 'react';
import { restaurantAPI } from '../services/api';

export const useSearch = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastQuery, setLastQuery] = useState('');

    const search = useCallback(async (query) => {
        if (!query || query.trim().length < 2) {
            setResults([]);
            setLastQuery('');
            return;
        }

        // Prevent duplicate searches
        if (query === lastQuery && results.length > 0) {
            console.log('Skipping duplicate search for:', query);
            return;
        }

        setLoading(true);
        setError(null);
        setLastQuery(query);

        try {
            console.log('🔍 Searching for:', query, 'at', new Date().toLocaleTimeString());
            const response = await restaurantAPI.search(query);
            console.log('✅ Search response for "' + query + '":', response);
            console.log('📊 Found', response.data?.length || 0, 'results');
            setResults(response.data || []);
        } catch (err) {
            console.error('❌ Search error:', err);
            setError(err.message || 'Search failed');
            setResults([]);
        } finally {
            setLoading(false);
        }
    }, [lastQuery, results.length]);

    const clearResults = useCallback(() => {
        setResults([]);
        setError(null);
        setLastQuery('');
    }, []);

    return { results, loading, error, search, clearResults };
};
