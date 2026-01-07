import { useState } from 'react';
import { Link } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext';

import mobileHand from '/icons/smartphone.png'
import menuBar from '/icons/menu.png'
import downArrow from '/icons/down-arrow.png'
import profilePic from '/images/profilepic.jpg'

import SearchBar from '../../../utils/SearchBar/SearchBar'

import css from './NavigationBar2.module.css';

let NavigationBar = ({ toogleMenu, setToggleMenu }) => {
    let [menuDisplay, setMenuDisplay] = useState(false);
    const { isAuthenticated, logout } = useAuth();

    const logoutHandler = () => {
        logout();
        setMenuDisplay(false);
    }

    return <div className={css.navbar}>
        <img className={css.menuBar} src={menuBar} alt='menu bar' onClick={() => setToggleMenu(val => !val)} />
        <div className={css.navbarInner}>
            <div className={css.leftSide}>
                <Link to='/' className={css.appTxt}>Feasto</Link>
            </div>
            <div className={css.searchBar}>
                <SearchBar />
            </div>
            <div className={css.rightSide}>
                {isAuthenticated ? (<div className={css.menuItem}>
                    <div className={css.profile} onClick={() => setMenuDisplay(val => !val)}>
                        <img src={profilePic} alt="profile pic" className={css.profilePic} />
                        <div className={css.profileName}>Profile</div>
                        <img src={downArrow} alt="arrow" className={css.arrow} />
                    </div>
                    <div className={css.menu} style={{display: menuDisplay ? "block" : ""}}>
                    <Link to='/user/ll/reviews' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Profile
                            </div>
                        </Link>
                        <Link to='/user/ll/notifications' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Notifications
                            </div>
                        </Link>
                        <Link to='/user/ll/bookmarks' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Bookmarks
                            </div>
                        </Link>
                        <Link to='/user/ll/reviews' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Reviews
                            </div>
                        </Link>
                        <Link to='/user/ll/network' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Network
                            </div>
                        </Link>
                        <Link to='/user/ll/find-friends' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Find Friends
                            </div>
                        </Link>
                        <Link to='/user/ll/settings' className={css.menuItemLinkTxt}>
                            <div className={css.menuItemLink}>
                                Settings
                            </div>
                        </Link>
                        <div className={css.menuItemLinkTxt} onClick={logoutHandler}>
                            <div className={css.menuItemLink}>
                                Logout
                            </div>
                        </div>
                    </div>
                </div>) : (<>
                    <div className={css.menuItem}>Log in</div>
                    <div className={css.menuItem}>Sign up</div>
                </>)}
            </div>
        </div>
    </div>
}

export default NavigationBar;