import React from 'react'
import { StandardsData } from '../../utils/data.js';


const Standards = () => {
    return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {StandardsData.map((item, index) => (
          <div key={index} className='w-full max-w-[236px] relative ltr:lg:pl-9 rtl:lg:pr-9'>
            <img src={item.image} alt=""  className='w-6 mb-4 lg:mb-0 lg:absolute lg:top-0 ltr:lg:left-0 rtl:lg:right-0'/>
            <h4>{item.heading}</h4>
            <p>{item.text}</p>
        </div>
        ))}
      </div>
    );
  };
  
export default Standards
