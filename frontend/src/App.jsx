import './App.css'
import React from 'react';
import { Routes, Route, Navigate  } from 'react-router-dom';
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
import AdminAccountInfo from './pages/admin/AccountInfo';
import ChangeAdminPassword from './pages/admin/ChangePassword';
import Products from './pages/admin/Products';
import Categories from './pages/admin/settings/Categories';
import Brands from './pages/admin/settings/Brands';
import Currencies from './pages/admin/settings/Currencies';
import Units from './pages/admin/settings/Units';
import Taxes from './pages/admin/settings/Taxes';
import SiteSettings from './pages/admin/settings/SiteSettings';
import DeliveryZones from './pages/admin/settings/DeliveryZones';
import Company from './pages/admin/settings/Company';


function App() {
  return (
    <>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="daily-deals" element={<Deals />} />
          <Route path="offers" element={<Offers />} />
          <Route path="flashSale" element={<FalshSale />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        <Route path= "account" element={<ProtectedRoute><AccountLayout /></ProtectedRoute>}>
          <Route path="overview" element={<Overview />} />
          <Route path="info" element={<AccountInfo />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="address" element={<Addresses />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>

        {/* Admin Routes */}
        <Route path="admin" element={<AdminRoute><DashboardLayout /></AdminRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile/edit-profile" element={<AdminAccountInfo />} />
          <Route path="profile/change-password" element={<ChangeAdminPassword />} />
          <Route path="products" element={<Products />} />

          {/* Settings Sub-Routes */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="company" replace />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="currencies" element={<Currencies />} />
            <Route path="units" element={<Units />} />
            <Route path="taxes" element={<Taxes />} />
            <Route path="site" element={<SiteSettings />} />
            <Route path="company" element={<Company />} />
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
