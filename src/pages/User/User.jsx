import { useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useUserProfile, useUserReviews, useUserPhotos, useFollowers } from '../../hooks/useUser'
import { useOrders } from '../../hooks/useOrders'
import css from './User.module.css'

import Navbar from '../../components/Navbars/NavigationBar2/NavigationBar2'
import UserProfileRightsideBar from '../../components/UserProfileComponents/UserProfileRightsideBar/UserProfileRightsideBar'

import UserHero from '../../utils/UserProfileUtils/UserHero/UserHero'
import LeftSideCardPanel from '../../utils/Cards/LeftSideCardPanel/LeftSideCardPanel'
import SuggestedFollowCard from '../../utils/UserProfileUtils/SuggestedFollowCard/SuggestedFollowCard'
import ProfileWidget from '../../utils/UserProfileUtils/ProfileWidget/ProfileWidget'

import userImg from '/images/koushil.jpg';

const User = () => {
    const { user, isAuthenticated } = useAuth();
    const { profile, loading: profileLoading } = useUserProfile('me');
    const { reviews } = useUserReviews('me');
    const { photos } = useUserPhotos('me');
    const { followers } = useFollowers('me');
    const { orders } = useOrders();

    if (!isAuthenticated) {
        return <div style={{padding: '50px', textAlign: 'center'}}>
            <Navbar />
            <div>Please login to view your profile</div>
        </div>
    }

    if (profileLoading) {
        return <div style={{padding: '50px', textAlign: 'center'}}>
            <Navbar />
            <div>Loading profile...</div>
        </div>
    }

    let data1 = [ 
        {title: "Reviews", hash: "reviews"},
        {title: "Photos", hash: "photos"},
        {title: "Followers", hash: "followers"},
        {title: "Recently Viewed", hash: "recently-viewed"},
        {title: "Bookmarks", hash: "bookmarks"},
        {title: "Blog Posts", hash: "blog-posts"}
    ];
    let data2 = [ 
        {title: "Order History", hash: "order-history"},
        {title: "My Address", hash: "my-address"},
        {title: "Favorite Orders", hash: "favorite-orders"},
    ];
    let data5 = [ 
        {title: "Yours Booking", hash: "bookings"},
    ];

    let data3 = [
        {userId: 123, imgSrc:userImg, userName: "Koushil Mankali", reviews: 200, followers: "123"},
        {userId: 123, imgSrc:userImg, userName: "Koushil Mankali", reviews: 200, followers: "123"},
        {userId: 123, imgSrc:userImg, userName: "Koushil Mankali", reviews: 200, followers: "123"},
        {userId: 123, imgSrc:userImg, userName: "Koushil Mankali", reviews: 200, followers: "123"}
    ]

    let data4 = {
      profilePic: profile?.profilePicture || user?.profilePicture || userImg,
      userName: profile?.name || user?.name || "User",
      reviews: reviews?.length || 0,
      photos: photos?.length || 0,
      followers: followers?.length || 0
    }

  return (<div className={css.outerDiv}>
    <div className={css.navbar}>
      <Navbar />
    </div>
    <div className={css.box}>
      <UserHero profile={profile} user={user} />
      <div className={css.mainbody}>
        <div className={css.leftBox}>
          <LeftSideCardPanel name='ACTIVITY' data={data1} />
          <LeftSideCardPanel name='ONLINE ORDERING' data={data2} />
          <LeftSideCardPanel name='TABLE BOOKING' data={data5} />
          <SuggestedFollowCard name='SUGGESTED FOODIES TO FOLLOW' data={data3} />
          <ProfileWidget name='ZOMATO PROFILE WIDGET' tag="Showcase your Zomato profile on your blog." data={data4} />
        </div>
        <div className={css.rightBox}>
          <UserProfileRightsideBar 
            profile={profile} 
            reviews={reviews} 
            photos={photos} 
            orders={orders}
          />
        </div>
      </div>
    </div>
  </div>)
}

export default User