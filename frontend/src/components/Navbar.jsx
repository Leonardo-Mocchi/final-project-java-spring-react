import { Link, useNavigate } from 'react-router-dom';
import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { GlobalContext } from '../contexts/GlobalContext';
import './Navbar.css';

function Navbar() {
  const [search, setSearch] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPlatformDropdownOpen, setIsPlatformDropdownOpen] = useState(false);
  const { cart, user, setUser } = useContext(GlobalContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch platforms
    axios.get(`${import.meta.env.VITE_API_URL}/platforms`)
      .then(response => setPlatforms(response.data))
      .catch(error => console.error('Error fetching platforms:', error));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/games?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handlePlatformClick = (platformId) => {
    if (platformId) {
      navigate(`/games?platform=${platformId}`);
    } else {
      navigate('/games');
    }
  };

  const handleLogout = async () => {
    try {
      // Submit logout form to backend
      const formData = new FormData();
      await axios.post('http://localhost:8080/logout', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Clear user state immediately
      setUser(null);

      // Navigate to home
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if error, try to clear user state
      setUser(null);
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Hamburger Menu Button (Mobile/Tablet) */}
        <button
          className="hamburger-menu"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* Logo */}
        <Link to="/" className="navbar-brand">
          <img src="/full-logo.png" alt="BoolArcade" className="navbar-logo navbar-logo-desktop" />
          <img src="/small logo.png" alt="BoolArcade" className="navbar-logo navbar-logo-mobile" />
        </Link>

        {/* Desktop Navigation Content */}
        <div className="nav-content">
          {/* All Games + Platforms */}
          <div className="nav-games-platforms">
            <button
              className="all-games-link"
              onClick={() => handlePlatformClick(null)}
            >
              All Games
            </button>

            <div className="platform-dropdown">
              <button
                className="platform-dropdown-btn"
                onClick={() => setIsPlatformDropdownOpen(!isPlatformDropdownOpen)}
              >
                Choose Platform
                <span style={{ paddingTop: "2px", fontWeight: "bolder" }}>
                  {isPlatformDropdownOpen ? <i className="fa-solid fa-chevron-up"></i> : <i className="fa-solid fa-chevron-down"></i>}
                </span>
              </button>
              {isPlatformDropdownOpen && (
                <div className="platform-dropdown-menu">
                  {platforms.map(platform => (
                    <button
                      key={platform.id}
                      className="platform-dropdown-item"
                      onClick={() => {
                        handlePlatformClick(platform.id);
                        setIsPlatformDropdownOpen(false);
                      }}
                    >
                      {platform.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="search-bar">
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>

          {/* Login/User Actions */}
          <div className="nav-actions">
            {user ? (
              <>
                <Link to="/profile" className="user-greeting" title="View Profile">
                  👤 {user.username}
                </Link>
                {/* Only show admin gear for users with ADMIN authority */}
                {user.authorities && user.authorities.some(auth =>
                  auth.authority === 'ROLE_ADMIN' || auth.authority === 'ADMIN'
                ) && (
                    <a href="http://localhost:8080/admin/games" className="admin-link" title="Admin Panel">
                      ⚙️
                    </a>
                  )}
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/register" className="register-btn">Sign Up</Link>
                <a href="http://localhost:8080/login" className="login-btn">Login</a>
              </>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="cart-link">
            🛒
            {cart.length > 0 && (
              <span className="cart-badge">{cart.length}</span>
            )}
          </Link>
        </div>

        {/* Mobile/Tablet Menu Content */}
        <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
          {/* Login/User Actions - First Line */}
          <div>
            {user ? (
              <>
                <div className="mobile-auth-section">
                  <Link to="/profile" className="user-greeting" onClick={() => setIsMenuOpen(false)}>
                    👤 {user.username}
                  </Link>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mobile-auth-section">
                  <Link to="/register" className="register-btn">Sign Up</Link>
                  <a href="http://localhost:8080/login" className="login-btn">Login</a>
                </div>
              </>
            )}
          </div>

          {/* All Games + Platforms */}
          <div className="mobile-games-platforms">
            <button
              className="all-games-link"
              onClick={() => handlePlatformClick(null)}
            >
              All Games
            </button>

            <div className="platform-links-inline">
              {platforms.map(platform => (
                <button
                  key={platform.id}
                  className="platform-link"
                  onClick={() => handlePlatformClick(platform.id)}
                >
                  {platform.name}
                </button>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mobile-search-bar">
            <input
              type="text"
              placeholder="Search games..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              🔍
            </button>
          </form>
        </div>

        {/* Cart - Always Visible on Mobile/Tablet */}
        <Link to="/cart" className="cart-link-mobile">
          🛒
          {cart.length > 0 && (
            <span className="cart-badge">{cart.length}</span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
