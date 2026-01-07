import { useState } from 'react';
import { Link } from 'react-router-dom'

import Navbar from '../../Navbars/NavigationBar/NavigationBar'
import AddRestaurantMobileNavbar from '../../Navbars/AddRestaurantMobileNavbar/AddRestaurantMobileNavbar';

import css from './AddRestaurantHeader.module.css'

import banner from '/banners/banner2.jpg'

let AddRestaurantHeader = () => {
    let [toogleMenu, setToggleMenu] = useState(true);

    const handleRegisterRestaurant = () => {
        alert('Restaurant registration feature coming soon! Please contact support@zomato.com for assistance.');
    };

    const handleClaimRestaurant = () => {
        alert('Restaurant claim feature coming soon! Please contact support@zomato.com for assistance.');
    };

    let toggleBanner = toogleMenu ? (<div className={css.banner}>
        <Navbar setToggleMenu={setToggleMenu} toogleMenu={toogleMenu} page="add-restaurant" />
        <div className={css.bannerInner}>
            <img src={banner} alt="banner" className={css.bannerImg} />
            <div className={css.bannerTxt}>
                <div className={css.title}>Register your restaurant on Zomato</div>
                <div className={css.tag}>for free and get more customers!</div>
                <div className={css.btns}>
                    <button className={css.btn} onClick={handleRegisterRestaurant}>Register your restaurant</button>
                    <button className={css.btn} onClick={handleClaimRestaurant}>Restaurant already listed? Claim now</button>
                </div>
            </div>
        </div>
    </div>) : <AddRestaurantMobileNavbar setToggleMenu={setToggleMenu} toogleMenu={toogleMenu} />

    return toggleBanner;
}

export default AddRestaurantHeader;