import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import PublicLayout from './layouts/PublicLayout';
import AccountLayout from './layouts/AccountLayout';
import DashboardLayout from './layouts/DashboardLayout';
import SettingsLayout from './layouts/admin/SettingsLayout';

import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoutes';

import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import Offers from './pages/public/Offers';
import Deals from './pages/public/DailyDeals';
import FlashSale from './pages/public/FlashSale';

import Overview from './pages/account/Overview';
import AccountInfo from './pages/account/AccountInfo';
import OrderHistory from './pages/account/OrderHistory';
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
import CompanySettings from './pages/admin/settings/CompanySettings';
import MailSettings from './pages/admin/settings/MailSettings';
import OtpSettings from './pages/admin/settings/OtpSettings';
import NotificationSettings from './pages/admin/settings/NotificationSettings';
import SocialSettings from './pages/admin/settings/SocialSettings';
import CookieSettings from './pages/admin/settings/CookieSettings';
import ThemeSettings from './pages/admin/settings/ThemeSettings';
import NotificationAlertSettings from './pages/admin/settings/NotificationAlertSettings';
import Sliders from './pages/admin/settings/Sliders';
import Attributes from './pages/admin/settings/Attributes';
import Suppliers from './pages/admin/settings/Suppliers';
import Outlets from './pages/admin/settings/Outlets';
import Benefits from './pages/admin/settings/Benefits';
import Pages from './pages/admin/settings/Pages';
import Languages from './pages/admin/settings/Languages';
import Roles from './pages/admin/settings/Roles';

function App() {
  return (
    <>
      <Routes>
        {/* Public Area */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="offers" element={<Offers />} />
          <Route path="daily-deals" element={<Deals />} />
          <Route path="flashSale" element={<FlashSale />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>

        {/* Account Area (Customer Only) */}
        <Route
          path="account"
          element={
            <ProtectedRoute>
              <AccountLayout />
            </ProtectedRoute>
          }
        >
          <Route path="overview" element={<Overview />} />
          <Route path="info" element={<AccountInfo />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="address" element={<Addresses />} />
          <Route path="password" element={<ChangePassword />} />
        </Route>

        {/* Admin Dashboard (Based on Permissions) */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <DashboardLayout />
            </AdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile/edit-profile" element={<AdminAccountInfo />} />
          <Route path="profile/change-password" element={<ChangeAdminPassword />} />
          <Route path="products" element={<Products />} />

          {/* Settings */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<Navigate to="company" replace />} />
            <Route path="company" element={<CompanySettings />} />
            <Route path="site" element={<SiteSettings />} />
            <Route path="delivery-zones" element={<DeliveryZones />} />
            <Route path="mail" element={<MailSettings />} />
            <Route path="otp" element={<OtpSettings />} />
            <Route path="notification" element={<NotificationSettings />} />
            <Route path="notification-alert" element={<NotificationAlertSettings />} />
            <Route path="social-media" element={<SocialSettings />} />
            <Route path="cookies" element={<CookieSettings />} />
            <Route path="theme-settings" element={<ThemeSettings />} />
            <Route path="sliders" element={<Sliders />} />
            <Route path="categories" element={<Categories />} />
            <Route path="brands" element={<Brands />} />
            <Route path="product-attributes" element={<Attributes />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="currencies" element={<Currencies />} />
            <Route path="units" element={<Units />} />
            <Route path="taxes" element={<Taxes />} />
            <Route path="outlets" element={<Outlets />} />
            <Route path="benefits" element={<Benefits />} />
            <Route path="pages" element={<Pages />} />
            <Route path="languages" element={<Languages />} />
            <Route path="roles" element={<Roles />} />
          </Route>
        </Route>
      </Routes>

      {/* Toasts */}
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

export default App;
