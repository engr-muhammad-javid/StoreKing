import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Nav from '../navigation/Nav';
import Footer from '../components/Footer';
import Sidebar from '../components/account/Sidebar';

const AccountLayout = () => {

  return (
    <>
      <header className="bg-white shadow-sm">
        <div className="container mx-auto">
          <Header />
          <Nav />
        </div>
      </header>

      {/* Layout for sidebar + content */}
      <div className="container mx-auto flex gap-4 py-6">
        {/* Sidebar on left */}
        <aside className="w-3/12">
          <Sidebar />
        </aside>

        {/* Main content on right */}
        <main className="w-9/12 bg-white rounded-lg p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </>
  );
};

export default AccountLayout;
