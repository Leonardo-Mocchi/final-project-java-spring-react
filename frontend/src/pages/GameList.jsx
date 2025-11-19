import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import GameCard from '../components/GameCard';
import Filters from '../components/Filters';
import Loader from '../components/Loader';
import { GlobalContext } from '../contexts/GlobalContext';
import './GameList.css';

function GameList() {
  const [allGames, setAllGames] = useState([]);
  const [filteredGames, setFilteredGames] = useState([]);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();
  const { isLoading, setIsLoading } = useContext(GlobalContext);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: '', max: '' },
    minRating: 0,
    sortBy: 'featured',
    inStockOnly: false,
    gameModes: []
  });

  // Platform filter from navbar (URL only)
  const [platformFilter, setPlatformFilter] = useState(null);

  const fetchGames = (searchTerm = '') => {
    console.log('Fetching games...', searchTerm ? `search: ${searchTerm}` : '');
    setIsLoading(true);
    setError(null);

    const url = searchTerm
      ? `${import.meta.env.VITE_API_URL}/games?search=${searchTerm}`
      : `${import.meta.env.VITE_API_URL}/games`;

    axios.get(url)
      .then(response => {
        console.log('Games:', response.data);
        const { data } = response;
        setAllGames(data);
        setFilteredGames(data);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
        setError('Failed to load games. Make sure the backend is running on http://localhost:8080');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const searchQuery = searchParams.get('search');
    const platformParam = searchParams.get('platform');

    // Reset filters when platform changes from navbar
    setFilters({
      categories: [],
      priceRange: { min: '', max: '' },
      minRating: 0,
      sortBy: 'featured',
      inStockOnly: false,
      gameModes: []
    });

    // Show loading when search/platform changes
    setIsLoading(true);

    fetchGames(searchQuery || '');

    // Check if there's a category filter in URL
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setFilters(prev => ({
        ...prev,
        categories: [parseInt(categoryParam)]
      }));
    }

    // Platform filter from navbar
    setPlatformFilter(platformParam ? parseInt(platformParam) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, platformFilter, allGames]);

  const applyFilters = () => {
    let filtered = [...allGames];

    // Debug: Log first game's stock info
    if (allGames.length > 0 && filters.inStockOnly) {
      console.log('Stock check - First game:', {
        title: allGames[0].title,
        stock: allGames[0].stock,
        availableStock: allGames[0].availableStock,
        gameKeys: allGames[0].gameKeys
      });
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(game =>
        game.categories?.some(cat => filters.categories.includes(cat.id))
      );
    }

    // Filter by platform (from navbar URL param)
    if (platformFilter) {
      filtered = filtered.filter(game =>
        game.platforms?.some(plat => plat.id === platformFilter)
      );
    }

    // Filter by price range
    if (filters.priceRange.min !== '') {
      filtered = filtered.filter(game => {
        const price = game.discountPercentage > 0
          ? game.price * (1 - game.discountPercentage / 100)
          : game.price;
        return price >= parseFloat(filters.priceRange.min);
      });
    }
    if (filters.priceRange.max !== '') {
      filtered = filtered.filter(game => {
        const price = game.discountPercentage > 0
          ? game.price * (1 - game.discountPercentage / 100)
          : game.price;
        return price <= parseFloat(filters.priceRange.max);
      });
    }

    // Filter by minimum rating
    if (filters.minRating > 0) {
      filtered = filtered.filter(game => {
        // Show games that have a rating and meet the minimum threshold
        const hasValidRating = game.averageRating != null && game.averageRating > 0;
        const meetsMinimum = hasValidRating && game.averageRating >= filters.minRating;
        return meetsMinimum;
      });
    }

    // Filter by in stock only
    if (filters.inStockOnly) {
      filtered = filtered.filter(game =>
        (game.availableStock !== undefined && game.availableStock > 0) ||
        (game.stock !== undefined && game.stock > 0)
      );
    }

    // Filter by game modes (if your backend has this field)
    if (filters.gameModes.length > 0) {
      filtered = filtered.filter(game =>
        filters.gameModes.some(mode =>
          game.gameModes?.includes(mode) ||
          game.tags?.some(tag => tag.toLowerCase().includes(mode.toLowerCase()))
        )
      );
    }

    // Sort the filtered games
    switch (filters.sortBy) {
      case 'price-asc':
        filtered.sort((a, b) => {
          const priceA = a.discountPercentage > 0 ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.discountPercentage > 0 ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceA - priceB;
        });
        break;
      case 'price-desc':
        filtered.sort((a, b) => {
          const priceA = a.discountPercentage > 0 ? a.price * (1 - a.discountPercentage / 100) : a.price;
          const priceB = b.discountPercentage > 0 ? b.price * (1 - b.discountPercentage / 100) : b.price;
          return priceB - priceA;
        });
        break;
      case 'rating':
        filtered.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // 'featured' - keep original order
        break;
    }

    setFilteredGames(filtered);
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  const searchQuery = searchParams.get('search');

  const hasActiveFilters =
    filters.categories.length > 0 ||
    platformFilter ||
    filters.priceRange.min !== '' ||
    filters.priceRange.max !== '' ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.gameModes.length > 0;

  return (
    <div className="game-list-page">
      {/* Global Keys Info Banner */}
      <div className="global-keys-banner">
        🌍 All game keys can be activated globally
      </div>

      {searchQuery && (
        <p className="search-result-text">
          Search results for: <strong>{searchQuery}</strong>
        </p>
      )}

      <div className="game-list-container">
        <div className="game-list-content">
          {isLoading && <Loader />}
          {filteredGames.length === 0 && !isLoading ? (
            <div className="no-games-container">
              <div className="no-games-icon">🎮</div>
              <h3>No games found</h3>
              {searchQuery && <p>No results for "{searchQuery}"</p>}
              {hasActiveFilters && (
                <p>Try adjusting your filters or search criteria</p>
              )}
              {!searchQuery && !hasActiveFilters && (
                <p>No games available at the moment. Check back soon!</p>
              )}
            </div>
          ) : filteredGames.length > 0 ? (
            <>
              <div className="results-header">
                <div className="results-count">
                  Showing {filteredGames.length} {filteredGames.length === 1 ? 'game' : 'games'}
                </div>
                <div className="view-toggle">
                  <button
                    className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    aria-label="Grid view"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z" />
                    </svg>
                  </button>
                  <button
                    className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    aria-label="List view"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={`game-grid ${viewMode === 'list' ? 'list-view' : ''}`}>
                {filteredGames.map(game => (
                  <GameCard key={game.id} game={game} />
                ))}
              </div>
            </>
          ) : null}
        </div>

        <Filters
          onFilterChange={setFilters}
          activeFilters={filters}
        />
      </div>
    </div>
  );
}

export default GameList;
