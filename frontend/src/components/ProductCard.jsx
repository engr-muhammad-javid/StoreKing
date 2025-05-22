import React from 'react';

const ProductCard = ({ item }) => {
  return (
    <div className='product-grid border border-gray-100 p-2 rounded-[10px] relative'>
      <img src={item.image} alt='product1' />
      <label className='absolute top-1 bg-black text-white p-[2px] font-semibold text-xs rounded-full py-1 px-2'>
        Flash Sale
      </label>
      <button className='add-to-wish-list shadow-badge rounded-full bg-white text-base absolute right-1 top-1 p-1'>
        <i className='fa-regular fa-heart'></i>
      </button>
      <button className='bg-green-500 flex items-center gap-1.5 absolute bottom-24 right-1 text-white px-[15px] py-[5px] rounded-[15px]'>
        <i className='fa fa-lock'></i>Add
      </button>
      <div className='product-title font-bold'>{item.name}</div>
      <div className='product-unit'>{item.unit}</div>
      <p className='regular-price font-bold text-green-600'>
        {item.regularPrice}{' '}
        <del className='discounted-price text-slate-400'>{item.discountedPrice}</del>
      </p>
    </div>
  );
};

export default ProductCard;
