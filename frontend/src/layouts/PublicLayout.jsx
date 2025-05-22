import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Nav from '../navigation/Nav'
import Footer from '../components/Footer';

const PublicLayout = () => (
  <>
    <header className="sm:mb-6 sm:shadow-xs bg-white">
      <div className="container">
        <Header/>
        <Nav/>
      </div>
    </header>
    <Outlet />
    <Footer />
  </>
);

export default PublicLayout;
