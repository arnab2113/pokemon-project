import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import CartDrawer from '../Cart/CartDrawer';
import SearchModal from '../Search/SearchModal';

export const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <Sidebar />
      <CartDrawer />
      <SearchModal />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <MobileNav />
      <Footer />
    </div>
  );
};

export default Layout;
