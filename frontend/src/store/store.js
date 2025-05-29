import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productCategoryReducer from "./slices/productCategorySlice";
import productReducer from "./slices/productCategorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    productCategory: productCategoryReducer,
    product:productReducer,
  },
});

export default store;
