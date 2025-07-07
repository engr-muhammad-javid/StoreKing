import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import modelReducer from "./slices/modalSlice";
import formReducer from "./slices/formSlice";
import companyReducer from "./slices/companySlice";
import siteReducer from "./slices/siteSlice";
import mailReducer from "./slices/mailSlice";
import otpReducer from "./slices/otpSlice";
import notificationReducer from "./slices/notificationSlice";
import socialReducer from "./slices/socialSlice";                                                                               
import deliveryZonesReducer from "./slices/deliveryZoneSlice";
import categoryReducer from "./slices/categorySlice";
import brandsReducer from "./slices/brandSlice";
import unitReducer from "./slices/unitSlice";
import taxReducer from "./slices/taxSlice";
import productReducer from "./slices/productSlice";
import currencyReducer from './slices/currencySlice';



const store = configureStore({
  reducer: {
    auth: authReducer,
    modal:modelReducer,
    form:formReducer,
    company: companyReducer,
    site:siteReducer,
    mail:mailReducer,
    otp:otpReducer,
    notification:notificationReducer,
    social:socialReducer,
    category: categoryReducer,
    product:productReducer,
    brand:brandsReducer,
    unit:unitReducer,
    tax:taxReducer,
    deliveryZone: deliveryZonesReducer,
    currency: currencyReducer,

  },
});

export default store;
