import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import companyReducer from "./slices/companySlice";
import siteReducer from "./slices/siteSlice";
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
    company: companyReducer,
    site:siteReducer,
    productCategory: categoryReducer,
    product:productReducer,
    productBrand:brandsReducer,
    unit:unitReducer,
    tax:taxReducer,
    deliveryZone: deliveryZonesReducer,
    currency: currencyReducer,
  },
});

export default store;
