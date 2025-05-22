import React from "react";
import {Routes, Route } from 'react-router-dom';
import Home from '../pages/public/Home';
import Login from  '../pages/public/Login';
import Register from "../pages/public/Register";
import Offers from "../pages/public/Offers";
import DailyDeals from "../pages/public/DailyDeals";
import FlashSale from "../pages/public/FlashSale";
import About from "../pages/public/About";
import Contact from "../pages/public/Contact";
import CookiesPolicy from '../pages/public/CookiesPolicy';
import Delivery from '../pages/public/Delivery';
import Faq from '../pages/public/Faq';
import PrivacyPolicy from '../pages/public/PrivacyPolicy';
import ReturnExchange from '../pages/public/ReturnExchange';
import TermsandConditions from '../pages/public/TermsandConditions';

function Navigation(){
    return (

        <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/offers" element={<Offers/>} />
            <Route path="/daily-deals" element={<DailyDeals/>} />
            <Route path="/flash-sale" element={<FlashSale/>} />
            <Route path="/page/about-us" element={<About/>} />
            <Route path="/page/contact-us" element={<Contact/>} />
            <Route path="/page/cookies-policy" element={<CookiesPolicy/>} />
            <Route path="/page/delivery" element={<Delivery/>} />
            <Route path="/page/faq" element={<Faq/>} />
            <Route path="/page/privacy-policy" element={<PrivacyPolicy/>} />
            <Route path="/page/return-and-exchange" element={<ReturnExchange/>} />
            <Route path="/page/terms-and-conditions" element={<TermsandConditions/>} />
        </Routes>
    )
}

export default Navigation;