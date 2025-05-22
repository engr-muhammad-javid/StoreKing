import React from 'react';
import { CategoryPromotionsData } from '../../utils/data';

function CategoryPromotions() {
   
  return (
    <div className='category-promotion flex items-center justify-between gap-6'>
        {CategoryPromotionsData.map((item, index) => (
            <div key={index} className='category-promotion-img w-1/3'>
                <a href={item.url} className='w-full'>
                    <img className="w-full block rounded-2xl" src={item.image} alt={item.alt} />
                </a>
            </div>
        ))};
    </div>
  )
}

export default CategoryPromotions
