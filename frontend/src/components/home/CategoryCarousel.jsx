import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { CategoriesData } from '../../utils/data.js';

const CategoryCarousel = () => {
  return (
    <div className="relative px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-6 sm:mb-10 relative z-10">
        <h2 className="text-xl sm:text-4xl font-bold">Shop by Categories</h2>
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
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }}
        spaceBetween={15}
        slidesPerView={6}
      >
        {CategoriesData.map((cat, index) => (
          <SwiperSlide key={index}>
            <a
              href={cat.url}
              className="flex flex-col items-center p-3 bg-white border rounded-lg shadow hover:shadow-md transition"
            >
              <img src={cat.image} alt={cat.name} className="w-20 h-20 object-cover mb-2" />
              <span className="text-sm font-medium text-center">{cat.name}</span>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default CategoryCarousel;
