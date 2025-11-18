import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import GameCard from '../components/GameCard';
import { GlobalContext } from '../contexts/GlobalContext';
import './Homepage.css';

function Homepage() {
  const [games, setGames] = useState([]);
  const [featuredGames, setFeaturedGames] = useState([]);
  const [hotDeals, setHotDeals] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState(null);
  const { setIsLoading } = useContext(GlobalContext);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Fetching homepage data...');
      setIsLoading(true);
      setError(null);

      try {
        const [gamesResponse, hotDealsResponse] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/games`),
          axios.get(`${import.meta.env.VITE_API_URL}/games/hot-deals`)
        ]);

        console.log('Games:', gamesResponse.data);
        console.log('Hot deals:', hotDealsResponse.data);

        const allGames = gamesResponse.data.slice(0, 8);
        setGames(allGames);

        // Randomize featured games once when loading
        const randomizedFeatured = [...allGames]
          .sort(() => Math.random() - 0.5)
          .slice(0, 6);
        setFeaturedGames(randomizedFeatured);

        setHotDeals(hotDealsResponse.data.slice(0, 5));
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Unable to load games. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % hotDeals.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + hotDeals.length) % hotDeals.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  const getSlideClass = (index) => {
    if (index === currentSlide) return 'active';

    const prevIndex = currentSlide === 0 ? hotDeals.length - 1 : currentSlide - 1;
    const nextIndex = currentSlide === hotDeals.length - 1 ? 0 : currentSlide + 1;

    if (index === prevIndex) return 'prev';
    if (index === nextIndex) return 'next';

    return '';
  };

  return (
    <div className="homepage">
      {/* Hero Carousel - 3D Style */}
      {hotDeals.length > 0 && (
        <section className="hero-carousel">
          <div className="carousel-container">
            {hotDeals.map((game, index) => (
              <div
                key={game.id}
                className={`carousel-slide ${getSlideClass(index)}`}
              >
                <div className="carousel-image-wrapper">
                  {game.imageUrl && (
                    <img src={game.imageUrl} alt={game.title} className="carousel-game-image" />
                  )}
                  {index === currentSlide && (
                    <span className="deal-badge">🔥 HOT DEAL</span>
                  )}
                </div>
                {index === currentSlide && (
                  <div className="carousel-content">
                    <h1>{game.title}</h1>
                    <p className="game-description">{game.description?.substring(0, 150)}...</p>
                    <div className="carousel-price">
                      {game.discountPercentage > 0 && game.discountedPrice ? (
                        <>
                          <span className="original-price">€{game.price?.toFixed(2)}</span>
                          <span className="discount-badge">-{game.discountPercentage}%</span>
                          <span className="current-price">€{game.discountedPrice.toFixed(2)}</span>
                        </>
                      ) : (
                        <span className="current-price">€{game.price?.toFixed(2)}</span>
                      )}
                    </div>
                    <Link to={`/games/${game.id}`} className="cta-button">
                      View Details
                    </Link>
                  </div>
                )}
              </div>
            ))}

            {/* Navigation Arrows */}
            <button className="carousel-arrow prev" onClick={prevSlide}>
              ❮
            </button>
            <button className="carousel-arrow next" onClick={nextSlide}>
              ❯
            </button>

            {/* Dots Navigation */}
            <div className="carousel-dots">
              {hotDeals.map((_, index) => (
                <button
                  key={index}
                  className={`dot ${index === currentSlide ? 'active' : ''}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Games Section */}
      {featuredGames.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2>Featured Games</h2>
            <Link to="/games" className="view-all">View All</Link>
          </div>
          <div className="game-grid featured-grid">
            {featuredGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <span className="feature-icon">🎮</span>
            <h3>Wide Selection</h3>
            <p>Choose from hundreds of popular games across all platforms</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">💰</span>
            <h3>Best Prices</h3>
            <p>Get the best deals with our exclusive discounts and offers</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">⚡</span>
            <h3>Instant Delivery</h3>
            <p>Receive your game keys instantly after purchase</p>
          </div>
          <div className="feature-card">
            <span className="feature-icon">🔒</span>
            <h3>Secure Payment</h3>
            <p>Shop safely with our secure payment processing</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Homepage;
