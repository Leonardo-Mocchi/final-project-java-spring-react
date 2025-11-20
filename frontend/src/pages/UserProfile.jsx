import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BootstrapModal from '../components/BootstrapModal';
import '../components/BootstrapModal.css';
import './UserProfile.css';

function UserProfile() {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('info');
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [emailChangeRequested, setEmailChangeRequested] = useState(false);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});
    // Modal state for alerts
    const [modal, setModal] = useState({ show: false, title: '', message: '' });
    const showModal = (title, message) => setModal({ show: true, title, message });
    const closeModal = () => setModal({ show: false, title: '', message: '' });

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);

            // Fetch user info
            const userResponse = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
                withCredentials: true
            });
            setUser(userResponse.data);
            setFormData({
                username: userResponse.data.username,
                email: userResponse.data.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Fetch orders
            const ordersResponse = await axios.get(`${import.meta.env.VITE_API_URL}/orders/my-orders`, {
                withCredentials: true
            });
            setOrders(ordersResponse.data);

            // Fetch reviews
            const reviewsResponse = await axios.get(`${import.meta.env.VITE_API_URL}/reviews/my-reviews`, {
                withCredentials: true
            });
            setReviews(reviewsResponse.data);

        } catch (error) {
            console.error('Error fetching user data:', error);
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (formData.newPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = 'Current password required to change password';
            }
            if (formData.newPassword.length < 6) {
                newErrors.newPassword = 'Password must be at least 6 characters';
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Passwords do not match';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveChanges = async () => {
        if (!validateForm()) return;

        try {
            const updateData = {
                username: formData.username
            };

            // Check if email changed
            if (formData.email !== user.email) {
                updateData.email = formData.email;
            }

            // Check if password change requested
            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.newPassword = formData.newPassword;
            }

            await axios.put(`${import.meta.env.VITE_API_URL}/user/me`, updateData, {
                withCredentials: true
            });

            if (formData.email !== user.email) {
                setEmailChangeRequested(true);
            } else {
                showModal('Success', 'Profile updated successfully!');
                setEditMode(false);
                fetchUserData();
            }

            // Clear password fields
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

        } catch (error) {
            console.error('Error updating profile:', error);
            if (error.response?.data?.error) {
                showModal('Error', error.response.data.error);
            } else if (error.response?.data?.message) {
                showModal('Error', error.response.data.message);
            } else {
                showModal('Error', 'Failed to update profile');
            }
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (!window.confirm('Are you sure you want to delete this review?')) return;

        try {
            await axios.delete(`${import.meta.env.VITE_API_URL}/reviews/${reviewId}`, {
                withCredentials: true
            });

            setReviews(reviews.filter(review => review.id !== reviewId));
            showModal('Success', 'Review deleted successfully!');
        } catch (error) {
            console.error('Error deleting review:', error);
            showModal('Error', 'Failed to delete review');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const renderStars = (rating) => {
        return '⭐'.repeat(rating);
    };

    if (loading) {
        return (
            <div className="user-profile-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="user-profile-page">
                <div className="error-container">
                    <h2>Unable to load profile</h2>
                    <button onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        );
    }

    return (
        <div className="user-profile-page">
            <BootstrapModal show={modal.show} title={modal.title} message={modal.message} onClose={closeModal} />
            <div className="profile-container">
                {/* Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <div className="profile-header-info">
                        <h1>{user.username}</h1>
                    </div>
                </div>

                <div className="profile-content">
                    {/* Sidebar Navigation */}
                    <div className="profile-sidebar">
                        <nav className="profile-nav">
                            <button
                                className={`nav-item ${activeSection === 'info' ? 'active' : ''}`}
                                onClick={() => setActiveSection('info')}
                            >
                                <i className="fas fa-user"></i>
                                <span>Your Information</span>
                            </button>
                            <button
                                className={`nav-item ${activeSection === 'orders' ? 'active' : ''}`}
                                onClick={() => setActiveSection('orders')}
                            >
                                <i className="fas fa-shopping-bag"></i>
                                <span>Your Orders</span>
                                {orders.length > 0 && <span className="badge">{orders.length}</span>}
                            </button>
                            <button
                                className={`nav-item ${activeSection === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveSection('reviews')}
                            >
                                <i className="fas fa-star"></i>
                                <span>Your Reviews</span>
                                {reviews.length > 0 && <span className="badge">{reviews.length}</span>}
                            </button>
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="profile-main">
                        {/* User Information Section */}
                        {activeSection === 'info' && (
                            <div className="section-content">
                                <div className="section-header">
                                    <h2><i className="fas fa-user"></i> Your Information</h2>
                                    {!editMode ? (
                                        <button className="edit-btn" onClick={() => setEditMode(true)}>
                                            <i className="fas fa-edit"></i> Edit Profile
                                        </button>
                                    ) : (
                                        <div className="edit-actions">
                                            <button className="save-btn" onClick={handleSaveChanges}>
                                                <i className="fas fa-check"></i> Save Changes
                                            </button>
                                            <button className="cancel-btn" onClick={() => {
                                                setEditMode(false);
                                                setFormData({
                                                    username: user.username,
                                                    email: user.email,
                                                    currentPassword: '',
                                                    newPassword: '',
                                                    confirmPassword: ''
                                                });
                                                setErrors({});
                                            }}>
                                                <i className="fas fa-times"></i> Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {emailChangeRequested && (
                                    <div className="alert alert-info">
                                        <i className="fas fa-envelope"></i>
                                        <div>
                                            <strong>Email Confirmation Required</strong>
                                            <p>We've sent a confirmation email to {formData.email}. Please check your inbox and click the link to verify your new email address.</p>
                                        </div>
                                    </div>
                                )}

                                <div className="info-form">
                                    <div className="form-group">
                                        <label><i className="fas fa-user"></i> Username</label>
                                        {editMode ? (
                                            <>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    value={formData.username}
                                                    onChange={handleInputChange}
                                                    className={errors.username ? 'error' : ''}
                                                />
                                                {errors.username && <span className="error-message">{errors.username}</span>}
                                            </>
                                        ) : (
                                            <p className="info-display">{user.username}</p>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label><i className="fas fa-envelope"></i> Email</label>
                                        {editMode ? (
                                            <>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className={errors.email ? 'error' : ''}
                                                />
                                                {errors.email && <span className="error-message">{errors.email}</span>}
                                                <small className="form-hint">
                                                    <i className="fas fa-info-circle"></i> Changing your email requires confirmation
                                                </small>
                                            </>
                                        ) : (
                                            <p className="info-display">{user.email}</p>
                                        )}
                                    </div>

                                    {editMode && (
                                        <div className="password-section">
                                            <h3><i className="fas fa-lock"></i> Change Password</h3>
                                            <p className="section-description">Leave blank if you don't want to change your password</p>

                                            <div className="form-group">
                                                <label>Current Password</label>
                                                <input
                                                    type="password"
                                                    name="currentPassword"
                                                    value={formData.currentPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter current password"
                                                    className={errors.currentPassword ? 'error' : ''}
                                                />
                                                {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label>New Password</label>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={formData.newPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter new password"
                                                    className={errors.newPassword ? 'error' : ''}
                                                />
                                                {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                                            </div>

                                            <div className="form-group">
                                                <label>Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    name="confirmPassword"
                                                    value={formData.confirmPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Confirm new password"
                                                    className={errors.confirmPassword ? 'error' : ''}
                                                />
                                                {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                                            </div>
                                        </div>
                                    )}

                                    {!editMode && (
                                        <div className="info-display">
                                            <div className="info-item">
                                                <span className="info-label">Account Status:</span>
                                                <span className="info-value status-active">
                                                    <i className="fas fa-check-circle"></i> Active
                                                </span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Total Orders:</span>
                                                <span className="info-value">{orders.length}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Total Reviews:</span>
                                                <span className="info-value">{reviews.length}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Orders Section */}
                        {activeSection === 'orders' && (
                            <div className="section-content">
                                <div className="section-header">
                                    <h2><i className="fas fa-shopping-bag"></i> Your Orders</h2>
                                </div>

                                {orders.length === 0 ? (
                                    <div className="empty-state">
                                        <i className="fas fa-shopping-cart"></i>
                                        <h3>No orders yet</h3>
                                        <p>Start shopping to see your order history here!</p>
                                        <button onClick={() => navigate('/games')} className="cta-button">
                                            Browse Games
                                        </button>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map(order => (
                                            <div key={order.id} className="order-card">
                                                <div className="order-header">
                                                    <div className="order-info">
                                                        <h3>Order #{order.id}</h3>
                                                        <span className="order-date">{formatDate(order.orderDate)}</span>
                                                    </div>
                                                    <div className="order-total">€{order.totalPrice.toFixed(2)}</div>
                                                </div>
                                                <div className="order-items">
                                                    {order.items && order.items.map((item, index) => (
                                                        <div key={index} className="order-item">
                                                            <div className="item-info">
                                                                <i className="fas fa-gamepad"></i>
                                                                <div>
                                                                    <p className="item-name">{item.gameName}</p>
                                                                    <p className="item-platform">{item.platformName}</p>
                                                                </div>
                                                            </div>
                                                            <div className="item-key">
                                                                <i className="fas fa-key"></i> {item.keyCode}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Reviews Section */}
                        {activeSection === 'reviews' && (
                            <div className="section-content">
                                <div className="section-header">
                                    <h2><i className="fas fa-star"></i> Your Reviews</h2>
                                </div>

                                {reviews.length === 0 ? (
                                    <div className="empty-state">
                                        <i className="fas fa-star"></i>
                                        <h3>No reviews yet</h3>
                                        <p>Share your gaming experiences by reviewing games you've played!</p>
                                        <button onClick={() => navigate('/games')} className="cta-button">
                                            Browse Games
                                        </button>
                                    </div>
                                ) : (
                                    <div className="reviews-list">
                                        {reviews.map(review => (
                                            <div key={review.id} className="review-card">
                                                <div className="review-header">
                                                    <div className="review-game-info">
                                                        <h3>{review.gameName}</h3>
                                                        <span className="review-rating">{renderStars(review.rating)}</span>
                                                    </div>
                                                    <div className="review-actions">
                                                        <button
                                                            className="view-game-btn"
                                                            onClick={() => navigate(`/games/${review.gameId}`)}
                                                        >
                                                            <i className="fas fa-eye"></i> View Game
                                                        </button>
                                                        <button
                                                            className="delete-btn"
                                                            onClick={() => handleDeleteReview(review.id)}
                                                        >
                                                            <i className="fas fa-trash"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="review-comment">{review.comment}</p>
                                                <span className="review-date">{formatDate(review.createdAt)}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfile;
