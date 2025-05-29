import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import productCategoryReducer from "./slices/productCategorySlice";
import ProductBrandsReducer from "./slices/productBrandSlice";
import productReducer from "./slices/productSlice";


const store = configureStore({
  reducer: {
    auth: authReducer,
    productCategory: productCategoryReducer,
    product:productReducer,
    productBrand:ProductBrandsReducer,
  },
});

export default store;
