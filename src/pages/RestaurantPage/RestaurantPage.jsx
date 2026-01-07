import {useState, useEffect} from 'react'
import { useParams } from 'react-router-dom'
import { useRestaurant } from '../../hooks/useRestaurants'
import { useReviews } from '../../hooks/useReviews'

import css from './RestaurantPage.module.css'

import NavigationBar from '../../components/Navbars/NavigationBar2/NavigationBar2'
import DownloadAppUtil from '../../utils/RestaurantUtils/DownloadAppUtil/DownloadAppUtil'
import HeroComponent from '../../components/RestaurantComponents/HeroComponent/HeroComponent'
import OrderTitleComponent from '../../components/RestaurantComponents/OrderTitleComponent/OrderTitleComponent'
import OrderBodyComponent from '../../components/RestaurantComponents/OrderBodyComponent/OrderBodyComponent'
import Footer from '../../components/Footer/Footer'

const RestaurantPage = () => {
  const { id } = useParams();
  console.log('🏪 RestaurantPage - Restaurant ID from URL:', id);
  
  const { restaurant, loading, error } = useRestaurant(id);
  const { reviews, loading: reviewsLoading } = useReviews(id);

  useEffect(() => {
    console.log('🏪 Restaurant data updated:', restaurant);
  }, [restaurant]);

  if (loading) {
    return <div style={{padding: '50px', textAlign: 'center'}}>
      <NavigationBar />
      <div>Loading restaurant details...</div>
    </div>
  }

  if (error || !restaurant) {
    return <div style={{padding: '50px', textAlign: 'center'}}>
      <NavigationBar />
      <div style={{color: 'red'}}>{error || 'Restaurant not found'}</div>
    </div>
  }

  return <div className={css.outerDiv} key={restaurant._id}>
    <NavigationBar />
    <div className={css.innerDiv}>
        <div className={css.breadcrumb}>
            Home
            /
            India
            /
            {restaurant.address?.city || restaurant.location?.city || 'City'}
            /
            {restaurant.address?.area || restaurant.location?.area || 'Area'}
        </div>
    </div>
    <HeroComponent restaurant={restaurant} key={`hero-${restaurant._id}`} />
    <div className={css.innerDiv2}>
      <OrderTitleComponent restaurant={restaurant} key={`title-${restaurant._id}`} />
      <OrderBodyComponent restaurant={restaurant} reviews={reviews} reviewsLoading={reviewsLoading} key={`body-${restaurant._id}`} />
    </div>
    <Footer />
  </div>
}

export default RestaurantPage