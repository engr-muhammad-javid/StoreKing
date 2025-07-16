import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import modelReducer from "./slices/modalSlice";
import formReducer from "./slices/formSlice";
import companyReducer from "./slices/companySlice";
import siteReducer from "./slices/siteSlice";
import mailReducer from "./slices/mailSlice";
import otpReducer from "./slices/otpSlice";
import notificationReducer from "./slices/notificationSlice";
import notificationAlertReducer from './slices/notificationAlertSlice';
import socialReducer from "./slices/socialSlice";
import cookieReducer from "./slices/cookieSlice";
import themeReducer from "./slices/themeSlice";
import slidersReducer from "./slices/sliderSlice";                                                                               
import deliveryZonesReducer from "./slices/deliveryZoneSlice";
import categoryReducer from "./slices/categorySlice";
import brandsReducer from "./slices/brandSlice";
import attributeReducer from "./slices/attributeSlice";
import unitReducer from "./slices/unitSlice";
import taxReducer from "./slices/taxSlice";
import supplierReducer from "./slices/supplierSlice";
import productReducer from "./slices/productSlice";
import currencyReducer from './slices/currencySlice';
import outletsReducer from "./slices/outletSlice";
import benefitReducer from "./slices/benefitSlice";
import pageReducer from "./slices/pageSlice";
import languageReducer from "./slices/languageSlice";
import roleReducer from "./slices/roleSlice";



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
    notificationAlert: notificationAlertReducer,
    social:socialReducer,
    cookie:cookieReducer,
    theme:themeReducer,
    slider:slidersReducer,
    category: categoryReducer,
    product:productReducer,
    brand:brandsReducer,
    attribute:attributeReducer,
    unit:unitReducer,
    tax:taxReducer,
    deliveryZone: deliveryZonesReducer,
    currency: currencyReducer,
    supplier:supplierReducer,
    outlet:outletsReducer,
    benefit:benefitReducer,
    page:pageReducer,
    language: languageReducer,
    role:roleReducer,
    
  },
});

export default store;
