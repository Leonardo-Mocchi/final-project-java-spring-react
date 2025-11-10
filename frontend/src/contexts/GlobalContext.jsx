import { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const GlobalContext = createContext()

// Provider component
function GlobalProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Fetch current user on mount and when window regains focus
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        console.log('🔍 Fetching user from:', `${import.meta.env.VITE_API_URL}/user/me`);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
          withCredentials: true
        });
        console.log('✅ User response:', response.data);
        setUser(response.data);
        console.log('✅ User logged in:', response.data.username);
      } catch (error) {
        // User not logged in - this is fine
        console.log('ℹ️ No user logged in - Error:', error.response?.status, error.response?.data);
        setUser(null);
      }
    };

    fetchCurrentUser();

    // Refetch user when window regains focus (after login redirect)
    const handleFocus = () => {
      console.log('🔄 Window focused, refetching user...');
      fetchCurrentUser();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const addToCart = (game, platform) => {
    setCart(prev => [...prev, { game, platform }]);
  };

  const removeFromCart = (index) => {
    setCart(prev => prev.filter((_, i) => i !== index));
  };

  const clearCart = () => {
    setCart([]);
  };

  const refetchUser = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
        withCredentials: true
      });
      setUser(response.data);
      console.log('✅ User refetched:', response.data.username);
      return response.data;
    } catch {
      console.log('ℹ️ User refetch failed');
      setUser(null);
      return null;
    }
  };

  const value = {
    isLoading,
    setIsLoading,
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    user,
    setUser,
    refetchUser
  };

  return (
    <GlobalContext.Provider value={value}>
      {children}
    </GlobalContext.Provider>
  );
}

export { GlobalProvider, GlobalContext }
export default GlobalContext
