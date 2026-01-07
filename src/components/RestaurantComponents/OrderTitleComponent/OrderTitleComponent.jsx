import React from 'react'

import css from './OrderTitleComponent.module.css'

import RatingUtil from '../../../utils/RestaurantUtils/RatingUtil/RatingUtil'

import infoIcon from '/icons/info.png'

const OrderTitleComponent = ({ restaurant }) => {
  if (!restaurant) return null;

  return <div className={css.outerDiv}>
    <div className={css.innerDiv}>
        <div className={css.left}>
            <div className={css.title}>{restaurant.name}</div>
            <div className={css.specials}>{restaurant.cuisines?.join(', ') || 'Various cuisines'}</div>
            <div className={css.address}>
              {restaurant.address?.area}, {restaurant.address?.city}
            </div>
            <div className={css.timings}>
                <span className={css.opORclo}>{restaurant.isOpen ? 'Open now -' : 'Closed -'}</span>
                <span className={css.time}>
                  {restaurant.timing?.opening || '10am'} - {restaurant.timing?.closing || '11pm'} (Today)
                </span>
                <span className={css.infoIconBox}>
                    <img className={css.infoIcon} src={infoIcon} alt="info" />
                    <div className={css.infoTooltip}>   
                        <div className={css.ttil}>Opening Hours</div>
                        <div className={css.ttim}>Mon-Sun:<span className={css.ctim}>
                          {restaurant.timing?.opening || '10am'}-{restaurant.timing?.closing || '11pm'}
                        </span></div>
                    </div>
                </span>
            </div>
        </div>
        <div className={css.right}>
            <RatingUtil 
              rating={restaurant.ratings?.average?.toFixed(1) || '0'} 
              count={restaurant.ratings?.count || '0'} 
              txt="Dining Reviews" 
            />
            <RatingUtil 
              rating={restaurant.ratings?.average?.toFixed(1) || '0'} 
              count={restaurant.ratings?.count || '0'} 
              txt="Delivery Reviews" 
            />
        </div>
    </div>
  </div>
}

export default OrderTitleComponent