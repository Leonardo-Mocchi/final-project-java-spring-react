import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../contexts/GlobalContext';
import Toast from '../components/Toast';
import './GameDetail.css';

function GameDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '', username: 'Anonymous' });
  const [validationErrors, setValidationErrors] = useState({ rating: '', comment: '' });
  const [selectedPlatform, setSelectedPlatform] = useState(null);
  const [platformStock, setPlatformStock] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { setIsLoading, user, addToCart } = useContext(GlobalContext);

  const fetchGame = () => {
    console.log(`Fetching game with id: ${id}`);
    setIsLoading(true);
    setError(null);

    axios.get(`${import.meta.env.VITE_API_URL}/games/${id}`)
      .then(response => {
        console.log('Game details:', response.data);
        const { data } = response;
        setGame(data);
        setReviews(data.reviews || []);
      })
      .catch(error => {
        console.error('Error fetching game:', error);
        setError('Failed to load game details');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();

    // Validate
    const errors = { rating: '', comment: '' };
    if (newReview.rating === 0) {
      errors.rating = 'Please select a rating';
    }
    if (!newReview.comment.trim()) {
      errors.comment = 'Please write a review';
    }

    setValidationErrors(errors);

    // If there are errors, don't submit
    if (errors.rating || errors.comment) {
      return;
    }

    setIsLoading(true);

    // Use username from state if not logged in (Anonymous)
    const reviewData = user
      ? { rating: newReview.rating, comment: newReview.comment }
      : { rating: newReview.rating, comment: newReview.comment, username: 'Anonymous' };

    axios.post(`${import.meta.env.VITE_API_URL}/games/${id}/reviews`, reviewData,
      { withCredentials: true })
      .then(() => {
        setNewReview({ rating: 0, comment: '', username: 'Anonymous' });
        setValidationErrors({ rating: '', comment: '' });
        setShowReviewForm(false);
        fetchGame(); // Refresh to get new review
      })
      .catch(error => {
        console.error('Error submitting review:', error);
        alert('Failed to submit review. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleCancelReview = () => {
    setIsClosing(true);
    setTimeout(() => {
      setShowReviewForm(false);
      setIsClosing(false);
      setNewReview({ rating: 0, comment: '', username: 'Anonymous' });
      setValidationErrors({ rating: '', comment: '' });
    }, 300); // Match animation duration
  };

  useEffect(() => {
    fetchGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch stock when platform changes
  useEffect(() => {
    if (selectedPlatform && game) {
      axios.get(`${import.meta.env.VITE_API_URL}/games/${game.id}/stock/${selectedPlatform}`)
        .then(response => {
          setPlatformStock(response.data.availableStock);
        })
        .catch(error => {
          console.error('Error fetching platform stock:', error);
          setPlatformStock(0);
        });
    } else {
      setPlatformStock(null);
    }
  }, [selectedPlatform, game]);

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Games
        </button>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="error">
        Game not found
        <button onClick={() => navigate('/')} className="btn btn-primary">
          Back to Games
        </button>
      </div>
    );
  }

  const hasDiscount = game.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (game.price * (1 - game.discountPercentage / 100)).toFixed(2)
    : null;

  return (
    <div className="game-detail-page">
      {/* Hero Section with Background Image */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${game.imageUrl})`,
        }}
      >
        <button onClick={() => navigate(-1)} className="back-button-hero">
          <span className="back-icon">←</span>
          <span>Back</span>
        </button>

        <div className="hero-overlay">
          <div className="hero-content">
            {hasDiscount && (
              <div className="hero-discount-badge">
                -{game.discountPercentage}% OFF
              </div>
            )}

            <div className="hero-title-row">
              <h1 className="hero-title">{game.title}</h1>

              {/* Genre badges to the right of title */}
              {game.categories && game.categories.length > 0 && (
                <div className="hero-genres">
                  {game.categories.map(category => (
                    <span key={category.id} className="hero-genre-badge">
                      {category.name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Short Description */}
            {game.description && (
              <p className="hero-description">
                {game.description.length > 150
                  ? game.description.substring(0, 150) + '...'
                  : game.description}
              </p>
            )}

            <div className="hero-meta">
              <div className="hero-rating">
                <span className="rating-stars">⭐ {game.averageRating > 0 ? game.averageRating.toFixed(1) : 'N/A'}</span>
                <span
                  className="rating-count"
                  onClick={() => document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ cursor: 'pointer' }}
                >
                  ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                </span>
              </div>
              <div className="hero-publisher">
                <span className="publisher-label">Publisher:</span>
                <span className="publisher-name">{game.publisher}</span>
              </div>
              {game.releaseDate && (
                <div className="hero-release">
                  <span className="release-label">Release:</span>
                  <span className="release-date">{new Date(game.releaseDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>

            {/* Platforms Row with Selector */}
            <div className="hero-platforms-row">
              <div className="hero-platforms">
                {game.platforms && game.platforms.map(platform => (
                  <span key={platform.id} className="hero-platform-badge">
                    {platform.name}
                  </span>
                ))}
              </div>

              <div className="hero-platform-selector">
                <select
                  value={selectedPlatform || ''}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="hero-platform-select"
                >
                  <option value="">Select Platform</option>
                  {game.platforms && game.platforms.map(platform => (
                    <option key={platform.id} value={platform.id}>
                      {platform.name}
                    </option>
                  ))}
                </select>
                <div className="hero-stock-indicator-container">
                  {selectedPlatform && platformStock !== null ? (
                    platformStock > 0 ? (
                      <span className="stock-available">✓ {platformStock} in stock</span>
                    ) : (
                      <span className="stock-unavailable">✗ Out of stock</span>
                    )
                  ) : (
                    <span className="stock-placeholder">&nbsp;</span>
                  )}
                </div>
              </div>
            </div>

            {/* Price and Purchase Button Row */}
            <div className="hero-price-purchase-row">
              <div className="hero-price-section">
                {hasDiscount ? (
                  <>
                    <span className="hero-price-original">${game.price}</span>
                    <span className="hero-price-discounted">${discountedPrice}</span>
                  </>
                ) : (
                  <span className="hero-price-current">${game.price}</span>
                )}
              </div>

              <button
                onClick={() => {
                  if (!selectedPlatform) {
                    setToastMessage('⚠️ Please select a platform first');
                    setShowToast(true);
                    return;
                  }
                  if (platformStock > 0) {
                    const platformObj = game.platforms.find(p => p.id === parseInt(selectedPlatform));
                    if (platformObj) {
                      addToCart(game, platformObj);
                      setToastMessage(`🎮 ${game.title} added to cart!`);
                      setShowToast(true);
                    }
                  }
                }}
                className={`hero-cta-button ${!selectedPlatform || platformStock === 0 ? 'disabled' : ''}`}
                disabled={!selectedPlatform || platformStock === 0}
              >
                <span className="cta-icon">🛒</span>
                <span className="cta-text">Add to Cart</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <div className="content-wrapper">
        <div className="content-container">

          {/* About Section */}
          <section className="content-section about-section">
            <h2 className="section-title">About This Game</h2>
            <p className="section-text">{game.description || 'No description available'}</p>
          </section>

        </div>
      </div >

      {/* Reviews Section */}
      < div id="reviews-section" className="reviews-section" >
        <div className="reviews-header">
          <h2>Reviews</h2>
          {!showReviewForm && (
            <button onClick={() => setShowReviewForm(true)} className="write-review-btn">
              Write a Review
            </button>
          )}
        </div>

        {
          showReviewForm && (
            <form onSubmit={handleSubmitReview} className={`review-form ${isClosing ? 'closing' : (showReviewForm ? 'show' : '')}`}>
              <h3>Write Your Review</h3>
              <div className="review-form-row">
                <div className="review-rating-wrapper">
                  <label className="review-label">Review</label>
                  <div className="star-rating">
                    <input
                      type="radio"
                      id="star5"
                      name="rating"
                      value="5"
                      checked={newReview.rating === 5}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    />
                    <label htmlFor="star5">★</label>
                    <input
                      type="radio"
                      id="star4"
                      name="rating"
                      value="4"
                      checked={newReview.rating === 4}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    />
                    <label htmlFor="star4">★</label>
                    <input
                      type="radio"
                      id="star3"
                      name="rating"
                      value="3"
                      checked={newReview.rating === 3}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    />
                    <label htmlFor="star3">★</label>
                    <input
                      type="radio"
                      id="star2"
                      name="rating"
                      value="2"
                      checked={newReview.rating === 2}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    />
                    <label htmlFor="star2">★</label>
                    <input
                      type="radio"
                      id="star1"
                      name="rating"
                      value="1"
                      checked={newReview.rating === 1}
                      onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                    />
                    <label htmlFor="star1">★</label>
                  </div>
                </div>
                {validationErrors.rating && (
                  <div className="validation-error">{validationErrors.rating}</div>
                )}
                <div className="review-textarea-wrapper">
                  <div className="form-group">
                    <textarea
                      value={newReview.comment}
                      onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                      placeholder="Share your thoughts about this game..."
                      rows={4}
                      className="review-textarea"
                    />
                  </div>
                </div>
                {validationErrors.comment && (
                  <div className="validation-error">{validationErrors.comment}</div>
                )}
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-review-btn">Submit Review</button>
                <button type="button" onClick={handleCancelReview} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </form>
          )
        }

        <div className="reviews-list">
          {reviews.length > 0 ? (
            reviews.map(review => (
              <div key={review.id} className="review-card">
                <div className="review-header">
                  <div className="review-author">
                    <span className="author-icon">👤</span>
                    <strong>{review.user?.username || 'Anonymous'}</strong>
                  </div>
                  <div className="review-rating">
                    {'⭐'.repeat(review.rating)}
                  </div>
                </div>
                <p className="review-comment">{review.comment}</p>
                {review.reviewDate && (
                  <span className="review-date">
                    {new Date(review.reviewDate).toLocaleDateString()}
                  </span>
                )}
              </div>
            ))
          ) : (
            <p className="no-reviews">No reviews yet. Be the first to review this game!</p>
          )}
        </div>
      </div >

      {/* Toast Notification */}
      {
        showToast && (
          <Toast
            message={toastMessage}
            type="success"
            onClose={() => setShowToast(false)}
          />
        )
      }
    </div >
  );
}

export default GameDetail;
