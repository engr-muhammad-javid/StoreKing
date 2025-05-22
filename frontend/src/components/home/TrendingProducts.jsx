import React from 'react';
import ProductCard from '../ProductCard';
import { TrendingProductsData } from '../../utils/data';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

const TrendingProducts = () => {
  return (
    <div className="relative">
   
   <div className="flex justify-between items-center mb-6 sm:mb-10 relative z-10">
        <h2 className="text-xl sm:text-4xl font-bold">Trending Items</h2>
        <div className="flex gap-2">
          <button className="custom-prev bg-white border p-2 rounded-full shadow text-lg font-bold">
            ‹
          </button>
          <button className="custom-next bg-white border p-2 rounded-full shadow text-lg font-bold">
            ›
          </button>
        </div>
      </div>
      <Swiper
        modules={[Navigation]}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        spaceBetween={16}
        slidesPerView={5}
        breakpoints={{
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
          1536: { slidesPerView: 5 },
        }}
      >
        {TrendingProductsData.map((item, index) => (
          <SwiperSlide key={index}>
            <ProductCard item={item} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default TrendingProducts;
