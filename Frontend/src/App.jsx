import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './Context/AuthContext';
import UserSidebar from './Components/Sidebar/Sidebar';

import LandingPage from './Pages/LandingPage';
import LoginSignup from './Pages/LoginSignup/LoginSignup';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import ProductList from './Pages/ProductList/ProductList';
import ProductPage from './Pages/ProductPage/ProductPage';
import Cart from './Pages/Cart/Cart';
import AdminPage from './Pages/AdminPage';

function App() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddToWishlist = (product, isAdding) => {
    setWishlistItems(currentItems => {
      if (isAdding) {
        const exists = currentItems.some(item => item.id === product.id);
        if (!exists) {
          return [...currentItems, {
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
          }];
        }
        return currentItems;
      } else {
        return currentItems.filter(item => item.id !== product.id);
      }
    });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/admin" element={<AdminPage />} />

          <Route path="/" element={
            <LandingPage onAddToWishlist={handleAddToWishlist} onOpenSidebar={toggleSidebar} />
          } />
          <Route path="/login" element={<LoginSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/products/:category" element={
            <ProductList onAddToWishlist={handleAddToWishlist} onOpenSidebar={toggleSidebar} />
          } />
          <Route path="/product/:id" element={
            <ProductPage onAddToWishlist={handleAddToWishlist} onOpenSidebar={toggleSidebar} />
          } />
        </Routes>


        <UserSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} initialWishlistItems={wishlistItems} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;