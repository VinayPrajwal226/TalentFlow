import React, { createContext, useContext, useState } from 'react';


const ADMIN_PASSWORD = 'admin';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isHrLoggedIn') === 'true'
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('isHrLoggedIn', 'true');
      setIsLoggedIn(true);
      return true; 
    }
    return false; 
  };

  const logout = () => {
    localStorage.removeItem('isHrLoggedIn');
    setIsLoggedIn(false);
  };


  const openLoginModal = () => setIsModalOpen(true);
  const closeLoginModal = () => setIsModalOpen(false);

  const value = {
    isLoggedIn,
    login,
    logout,
    isModalOpen,
    openLoginModal,
    closeLoginModal,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};