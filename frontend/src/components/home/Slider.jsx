import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';
import { SliderImages} from '../../utils/data.js';

const Slider = () => {

  return (
    <Swiper
      spaceBetween={10}
      slidesPerView={1}
      navigation
      loop={true}
      autoplay={{ delay: 5000 }}
      modules={[Autoplay, Navigation]}
    >
      {SliderImages.map((item, index) => (
        <SwiperSlide key={index}>
          <img
            src={item}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
