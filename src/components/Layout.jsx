

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx'; 
import Footer from './Footer.jsx'; 

const Layout = () => {
  return (
    <div>
      <Navbar />
      <main>
    
        <Outlet />
      </main>
      <Footer /> 
    </div>
  );
};

export default Layout;