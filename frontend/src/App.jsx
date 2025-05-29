import './App.css'
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PublicLayout from './layouts/PublicLayout';
import AccountLayout from './layouts/AccountLayout';
import DashboardLayout from './layouts/DashboardLayout';
import SettingsLayout from './layouts/admin/SettingsLayout';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoutes';

import Home from './pages/public/Home';
import Login from  './pages/public/Login';
import Register from  './pages/public/Register';
import Offers from "./pages/public/Offers";
import Deals from "./pages/public/DailyDeals";
import FalshSale from "./pages/public/FlashSale";

import Overview from "./pages/account/Overview";
import AccountInfo from "./pages/account/AccountInfo";
import OrderHistory from "./pages/account/OrderHistory";
import Addresses from './pages/account/Addresses';
import ChangePassword from './pages/account/ChangePassword';

import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductCategories from './pages/admin/settings/ProductCategories';
import ProductBrands from './pages/admin/settings/ProductBrands';
import SiteSettings from './pages/admin/settings/SiteSettings';
import DeliveryZones from './pages/admin/settings/DeliveryZones';


function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/daily-deals" element={<Deals />} />
          <Route path="/offers" element={<Offers />} />
          <Route path="/flashSale" element={<FalshSale />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        <Route element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
          <Route path="/account/overview" element={<Overview />} />
          <Route path="/account/info" element={<AccountInfo />} />
          <Route path="/account/orders" element={<OrderHistory />} />
          <Route path="/account/address" element={<Addresses />} />
          <Route path="/account/password" element={<ChangePassword />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          
          {/* Settings Sub-Routes */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route path="product-categories" element={<ProductCategories />} />
            <Route path="product-brands" element={<ProductBrands />} />
            <Route path="site" element={<SiteSettings />} />
            <Route path="delivery-zones" element={<DeliveryZones />} />
            {/* Add other settings routes here */}
          </Route>
        </Route>
      </Routes>

      {/* Toastify Flash Messages */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App
