import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './Filters.css';

function Filters({ onFilterChange, activeFilters, isCollapsed, setIsCollapsed }) {
    const [genres, setGenres] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        // Fetch genres (categories)
        axios.get(`${import.meta.env.VITE_API_URL}/categories`)
            .then(response => setGenres(response.data))
            .catch(error => console.error('Error fetching genres:', error));
    }, []);

    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({
            ...activeFilters,
            priceRange: {
                ...activeFilters.priceRange,
                [name]: value
            }
        });
    };

    const handleRatingChange = (rating) => {
        onFilterChange({
            ...activeFilters,
            minRating: activeFilters.minRating === rating ? 0 : rating
        });
    };

    const handleSortChange = (e) => {
        onFilterChange({
            ...activeFilters,
            sortBy: e.target.value
        });
    };

    const handleInStockChange = (e) => {
        onFilterChange({
            ...activeFilters,
            inStockOnly: e.target.checked
        });
    };

    const clearFilters = () => {
        onFilterChange({
            categories: [],
            priceRange: { min: '', max: '' },
            minRating: 0,
            sortBy: 'featured',
            inStockOnly: false,
            gameModes: []
        });
        // Also remove 'filter' search param from URL
        try {
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('filter');
            setSearchParams(newParams);
        } catch (e) {
            console.warn('Could not clear "filter" search param from Filters', e);
        }
    };

    const hasActiveFilters =
        activeFilters.categories.length > 0 ||
        activeFilters.priceRange.min !== '' ||
        activeFilters.priceRange.max !== '' ||
        activeFilters.minRating > 0 ||
        activeFilters.inStockOnly ||
        activeFilters.gameModes.length > 0;

    return (
        <div className="filters-sidebar">
            <div className="filters-header">
                <h3>Filters</h3>
                <button
                    className="filters-toggle-btn"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    aria-label={isCollapsed ? "Show filters" : "Hide filters"}
                >
                    {isCollapsed ? '▼' : '▲'}
                </button>
                <div className="clear-btn-placeholder">
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="clear-filters-btn">
                            Clear All
                        </button>
                    )}
                </div>
            </div>

            <div className={`filters-content ${isCollapsed ? 'collapsed' : ''}`}>
                {/* Genres Filter */}
                <div className="filter-section">
                    <h4>Genre</h4>
                    <div className="genre-grid">
                        <button
                            className={`genre-btn ${activeFilters.categories.length === 0 ? 'active' : ''}`}
                            onClick={() => onFilterChange({ ...activeFilters, categories: [] })}
                        >
                            All
                        </button>
                        {genres.map(genre => (
                            <button
                                key={genre.id}
                                className={`genre-btn ${activeFilters.categories.includes(genre.id) ? 'active' : ''}`}
                                onClick={() => onFilterChange({ ...activeFilters, categories: [genre.id] })}
                            >
                                {genre.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Price Range Filter */}
                <div className="filter-section">
                    <h4>Price Range</h4>
                    <div className="price-inputs">
                        <input
                            type="number"
                            name="min"
                            placeholder="Min"
                            value={activeFilters.priceRange.min}
                            onChange={handlePriceChange}
                            min="0"
                        />
                        <span>-</span>
                        <input
                            type="number"
                            name="max"
                            placeholder="Max"
                            value={activeFilters.priceRange.max}
                            onChange={handlePriceChange}
                            min="0"
                        />
                    </div>
                </div>

                {/* Rating Filter */}
                <div className="filter-section">
                    <h4>Minimum Rating</h4>
                    <div className="filter-star-rating">
                        <input
                            type="radio"
                            id="filter-star5"
                            name="filter-rating"
                            value="5"
                            checked={activeFilters.minRating === 5}
                            onChange={() => handleRatingChange(5)}
                        />
                        <label htmlFor="filter-star5">★</label>

                        <input
                            type="radio"
                            id="filter-star4"
                            name="filter-rating"
                            value="4"
                            checked={activeFilters.minRating === 4}
                            onChange={() => handleRatingChange(4)}
                        />
                        <label htmlFor="filter-star4">★</label>

                        <input
                            type="radio"
                            id="filter-star3"
                            name="filter-rating"
                            value="3"
                            checked={activeFilters.minRating === 3}
                            onChange={() => handleRatingChange(3)}
                        />
                        <label htmlFor="filter-star3">★</label>

                        <input
                            type="radio"
                            id="filter-star2"
                            name="filter-rating"
                            value="2"
                            checked={activeFilters.minRating === 2}
                            onChange={() => handleRatingChange(2)}
                        />
                        <label htmlFor="filter-star2">★</label>

                        <input
                            type="radio"
                            id="filter-star1"
                            name="filter-rating"
                            value="1"
                            checked={activeFilters.minRating === 1}
                            onChange={() => handleRatingChange(1)}
                        />
                        <label htmlFor="filter-star1">★</label>

                        {activeFilters.minRating > 0 && (
                            <button
                                className="clear-rating-btn"
                                onClick={() => handleRatingChange(0)}
                                title="Clear rating filter"
                            >
                                ✕
                            </button>
                        )}
                    </div>
                </div>

                {/* Sort By */}
                <div className="filter-section">
                    <h4>Sort By</h4>
                    <select
                        className="sort-select"
                        value={activeFilters.sortBy}
                        onChange={handleSortChange}
                    >
                        <option value="featured">Featured</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                        <option value="rating">Highest Rated</option>
                        <option value="name">Name: A-Z</option>
                    </select>
                </div>

                {/* In Stock Only */}
                <div className="filter-section">
                    <label className="checkbox-label in-stock-checkbox">
                        <input
                            type="checkbox"
                            checked={activeFilters.inStockOnly}
                            onChange={handleInStockChange}
                        />
                        <span>In Stock Only</span>
                    </label>
                </div>
            </div>
        </div>
    );
} export default Filters;
