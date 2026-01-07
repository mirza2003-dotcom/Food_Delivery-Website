import { useState } from 'react';

import PlacesCard from '../../../utils/Cards/card3/PlacesCard'
import ShowMore from '../../../utils/Cards/card3/ShowMore'

import css from './PopularPlaces.module.css';

let PopularPlaces = () => {
    let [showMore, setShowMore] = useState();
    return <div className={css.outerDiv}>
        <div className={css.title}><span className={css.titleTxt}>Popular localities in and around</span> <span className={css.bld}>Kolkata</span></div>
        <div className={css.placesCards}>
            <PlacesCard place="Park Street" count="421" link='/parkstreet' />
            <PlacesCard place="Salt Lake" count="385" link='/saltlake' />
            <PlacesCard place="New Town" count="298" link='/newtown' />
            <PlacesCard place="Ballygunge" count="312" link='/ballygunge' />
            <PlacesCard place="Alipore" count="267" link='/alipore' />
            <ShowMore setShowMore={setShowMore} />
        </div>
    </div>
}

export default PopularPlaces;