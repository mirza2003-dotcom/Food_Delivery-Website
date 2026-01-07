import {useState, useEffect} from 'react'
import {NavLink, useParams} from "react-router-dom"

import css from './OrderBodyComponent.module.css'

import OverviewFieldComponent from './Components/OverviewFieldComponent/OverviewFieldComponent'
import OrderOnlineFieldComponent from './Components/OrderOnlineFieldComponent/OrderOnlineFieldComponent'
import PhotosComponent from './Components/PhotosComponent/PhotosComponent'
import ReviewsComponent from './Components/ReviewsComponent/ReviewsComponent'
import MenuComponent from './Components/MenuComponent/MenuComponent'

const OrderBodyComponent = ({ restaurant, reviews, reviewsLoading }) => {

    const [pageCompo, setPageComp] = useState("")

    const {city, hotel, page="", id} = useParams();

    const isActiveClass = (e) => {
        if(e?.isActive){
            return [css.menuTxt, css.menuTxtActive].join(" ");
        }else{
            return css.menuTxt;
        }
    }

    useEffect(()=> {
        // Construct base path - use /restaurant/:id pattern or /:city/:hotel pattern
        const basePath = id ? `/restaurant/${id}` : `/${city}/${hotel}`;
        const currentPath = id ? `/restaurant/${id}/${page}` : `/${city}/${hotel}/${page}`;
        
        switch(currentPath){
            case `${basePath}/`:
            case basePath:
                setPageComp(<OverviewFieldComponent restaurant={restaurant} />);
                break;
            case `${basePath}/order`:
                setPageComp(<OrderOnlineFieldComponent restaurant={restaurant} />);
                break;
            case `${basePath}/reviews`:
                setPageComp(<ReviewsComponent restaurant={restaurant} reviews={reviews} loading={reviewsLoading} />);
                break;
            case `${basePath}/photos`:
                setPageComp(<PhotosComponent restaurant={restaurant} />);
                break;
            case `${basePath}/menu`:
                setPageComp(<MenuComponent restaurant={restaurant} />);
                break;
            default: 
                setPageComp(<OverviewFieldComponent restaurant={restaurant} />);
        }
    }, [city, hotel, page, id, restaurant, reviews, reviewsLoading])


  // Construct navigation links based on current route pattern
  const basePath = id ? `/restaurant/${id}` : `/${city}/${hotel}`;

  return <div className={css.outerDiv}>
    <div className={css.innerDiv}>
        <div className={css.menu}>
            <NavLink to={`${basePath}/`} className={isActiveClass}>
                Overview
            </NavLink>
            <NavLink to={`${basePath}/order`} className={isActiveClass}>
                Order Online
            </NavLink>
            <NavLink to={`${basePath}/reviews`} className={isActiveClass}>
                Reviews
            </NavLink>
            <NavLink to={`${basePath}/photos`} className={isActiveClass}>
                Photos
            </NavLink>
            <NavLink to={`${basePath}/menu`} className={isActiveClass}>
                Menu
            </NavLink>
        </div>
        <div className={css.componentsBody}>
            {pageCompo}
        </div>
    </div>  
  </div>
}

export default OrderBodyComponent