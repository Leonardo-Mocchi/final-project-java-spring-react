import { useContext, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import DefaultLayout from './layouts/DefaultLayout';
import Homepage from './pages/Homepage';
import GameList from './pages/GameList';
import GameDetail from './pages/GameDetail';
import Genres from './pages/Genres';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import Register from './pages/Register';
import Login from './pages/Login';
import UserProfile from './pages/UserProfile';
import NotFound from './pages/NotFound';
import NewsletterModal from './components/NewsletterModal';
import ScrollToTop from './components/ScrollToTop';
import { GlobalContext } from './contexts/GlobalContext';
import './App.css';

function App() {
  const { setUser } = useContext(GlobalContext);

  const checkAuth = useCallback(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/user/me`, { withCredentials: true })
      .then(response => {
        console.log('Authenticated user:', response.data);
        setUser(response.data);

        // Handle redirect after login
        const pendingRedirect = sessionStorage.getItem('pendingRedirect');
        if (pendingRedirect && pendingRedirect !== window.location.pathname) {
          sessionStorage.removeItem('pendingRedirect');
          sessionStorage.removeItem('redirectAfterLogin');
          window.location.href = pendingRedirect;
        }
      })
      .catch(error => {
        console.log('No authenticated user:', error);
        setUser(null);
      });
  }, [setUser]);

  useEffect(() => {
    // Check auth on mount
    checkAuth();

    // Check auth when window gains focus (after login redirect from backend)
    const handleFocus = () => {
      checkAuth();
    };

    // Also check auth periodically in case of changes
    const intervalId = setInterval(() => {
      checkAuth();
    }, 5000); // Check every 5 seconds

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [checkAuth]);

  return (
    <Router>
      <div className="App">
        <NewsletterModal />
        <ScrollToTop />
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Homepage />} />
            <Route path="/games" element={<GameList />} />
            <Route path="/games/:id" element={<GameDetail />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/checkout/success" element={<CheckoutSuccess />} />
            <Route path="/checkout/cancel" element={<CheckoutCancel />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
