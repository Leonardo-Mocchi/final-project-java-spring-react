import { useNavigate } from 'react-router-dom';
import './GameCard.css';

function GameCard({ game }) {
  const navigate = useNavigate();
  const hasDiscount = game.discountPercentage > 0;
  const discountedPrice = hasDiscount
    ? (game.price * (1 - game.discountPercentage / 100)).toFixed(2)
    : null;

  const isOutOfStock = !game.availableStock || game.availableStock === 0;

  const handleCardClick = () => {
    navigate(`/games/${game.id}`);
  };

  return (
    <div className="game-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      {hasDiscount && (
        <div className="discount-badge">{game.discountPercentage}% OFF</div>
      )}
      {game.imageUrl && (
        <img
          src={game.imageUrl}
          alt={game.title}
          className="game-card-image"
        />
      )}
      <div className="game-card-body">
        <h3 className="game-card-title">{game.title}</h3>
        <p className="game-card-description">
          {game.description
            ? game.description.substring(0, 100) + (game.description.length > 100 ? '...' : '')
            : 'No description available'}
        </p>
        <div className="game-card-categories">
          {game.categories && game.categories.map(category => (
            <span key={category.id} className="badge">
              {category.name}
            </span>
          ))}
        </div>
        <div className="game-card-footer">
          <div className={`price-container${isOutOfStock ? ' out-of-stock-layout' : ''}`}>
            {isOutOfStock ? (
              <span className="out-of-stock-text">⚠️ Out of Stock</span>
            ) : hasDiscount ? (
              <>
                <span className="game-card-price-original">${game.price}</span>
                <span className="game-card-price">${discountedPrice}</span>
              </>
            ) : (
              <span className="game-card-price">${game.price}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GameCard;
