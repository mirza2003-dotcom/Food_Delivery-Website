import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSearch } from '../../hooks/useSearch';
import css from './SearchBar.module.css'

import downArrow from '/icons/down-arrow1.png'
import locationIcon from '/icons/location.png'
import searchIcon from '/icons/search.png'

let SearchBar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const { results, loading, search, clearResults } = useSearch();
    const navigate = useNavigate();
    const searchRef = useRef(null);

    // Handle search input change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.trim().length >= 2) {
                search(searchQuery);
                setShowResults(true);
            } else {
                clearResults();
                setShowResults(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery, search, clearResults]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRestaurantClick = (restaurantId) => {
        console.log('🎯 Clicked restaurant ID:', restaurantId);
        console.log('🎯 Navigating to:', `/restaurant/${restaurantId}`);
        navigate(`/restaurant/${restaurantId}`);
        setSearchQuery('');
        setShowResults(false);
        clearResults();
    };

    return <div className={css.outerDiv} ref={searchRef}>
        <div className={css.srch1}>
            <div className={css.iconBox}><img className={css.icon} src={locationIcon} alt="location pointer" /></div>
            <input type="text" placeholder="Place.." className={css.inpt} />
            <div className={css.iconBox}><img className={css.downArrow} src={downArrow} alt="down arrow" /></div>
        </div>
        <hr className={css.hr} />
        <div className={css.srch2}>
            <div className={css.iconBox}><img className={css.icon} src={searchIcon} alt="search icon" /></div>
            <input 
                type="text" 
                placeholder='Search for restaurant, cuisine or a dish' 
                className={css.inpt}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length >= 2 && setShowResults(true)}
            />
        </div>
        <div className={css.dropdownBox} style={{ display: showResults && (results.length > 0 || loading || (searchQuery.length >= 2 && results.length === 0)) ? "block" : "none" }}>
            <div className={css.dropdown}>
                {loading ? (
                    <div className={css.loadingState}>
                        <div className={css.spinner}></div>
                        <span>Searching restaurants...</span>
                    </div>
                ) : results.length > 0 ? (
                    results.map((restaurant) => {
                        console.log('📋 Rendering search result:', restaurant.name, 'ID:', restaurant._id);
                        return (
                        <div 
                            key={restaurant._id} 
                            onClick={() => handleRestaurantClick(restaurant._id)}
                            className={css.resultItem}
                        >
                            <div className={css.resultContent}>
                                <div className={css.restaurantInfo}>
                                    <h4 className={css.restaurantName}>{restaurant.name}</h4>
                                    <div className={css.restaurantMeta}>
                                        {restaurant.ratings?.average && (
                                            <span className={css.rating}>
                                                ⭐ {restaurant.ratings.average.toFixed(1)}
                                            </span>
                                        )}
                                        {restaurant.cuisines && restaurant.cuisines.length > 0 && (
                                            <span className={css.cuisines}>
                                                {restaurant.cuisines.slice(0, 3).join(', ')}
                                            </span>
                                        )}
                                    </div>
                                    <div className={css.restaurantDetails}>
                                        {restaurant.address?.area && (
                                            <span className={css.location}>📍 {restaurant.address.area}, {restaurant.address.city || ''}</span>
                                        )}
                                        {restaurant.costForTwo && (
                                            <span className={css.cost}>💰 ₹{restaurant.costForTwo} for two</span>
                                        )}
                                    </div>
                                    {restaurant.popularDishes && restaurant.popularDishes.length > 0 && (
                                        <div className={css.dishes}>
                                            <span className={css.dishLabel}>Popular:</span> {restaurant.popularDishes.slice(0, 3).join(', ')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        );
                    })
                ) : searchQuery.length >= 2 ? (
                    <div className={css.noResults}>
                        <div className={css.noResultsIcon}>🔍</div>
                        <p>No restaurants found for "{searchQuery}"</p>
                        <span>Try searching for different cuisines or restaurant names</span>
                    </div>
                ) : null}
            </div>
        </div>
    </div>
}

export default SearchBar;