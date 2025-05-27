import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productCategoryReducer from "./slices/productCategorySlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    productCategory: productCategoryReducer,
  },
});

export default store;
