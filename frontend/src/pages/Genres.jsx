import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../contexts/GlobalContext';
import './Genres.css';

function Genres() {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const { setIsLoading } = useContext(GlobalContext);
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        setError(null);

        axios.get(`${import.meta.env.VITE_API_URL}/categories`)
            .then(response => {
                console.log('Categories:', response.data);
                setCategories(response.data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
                setError('Failed to load genres. Make sure the backend is running.');
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [setIsLoading]);

    const handleGenreClick = (categoryId) => {
        // Navigate to games page with category filter
        navigate(`/games?category=${categoryId}`);
    };

    if (error) {
        return <div className="error">{error}</div>;
    }

    return (
        <div className="genres-page">
            <h1>Browse by Genre</h1>
            <p className="genres-subtitle">Discover games by your favorite genres</p>

            <div className="genres-grid">
                {categories.map(category => (
                    <div
                        key={category.id}
                        className="genre-card"
                        onClick={() => handleGenreClick(category.id)}
                    >
                        <div className="genre-card-content">
                            <h2>{category.name}</h2>
                            <div className="genre-arrow">→</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Genres;
