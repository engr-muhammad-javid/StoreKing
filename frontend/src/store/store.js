import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import categoryReducer from "./slices/categorySlice";
import brandsReducer from "./slices/brandSlice";
import unitReducer from "./slices/unitSlice";
import taxReducer from "./slices/taxSlice";
import productReducer from "./slices/productSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    productCategory: categoryReducer,
    product:productReducer,
    productBrand:brandsReducer,
    unit:unitReducer,
    tax:taxReducer,
  },
});

export default store;
