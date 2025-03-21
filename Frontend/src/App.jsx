import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Cart from './Components/Cart/Cart';
import LoginSignup from './Pages/LoginSignup/LoginSignup';
import ForgotPassword from './Pages/ForgotPassword/ForgotPassword';
import AuthProvider from './Context/AuthContext';

function App() {
  return (
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
  )
}

export default App
