import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../contexts/GlobalContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export default function Checkout() {
    const { cart, user } = useContext(GlobalContext);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const calculateTotal = () => {
        return cart.reduce((sum, item) => {
            const price = item.game.price;
            const discount = item.game.discountPercentage || 0;
            const finalPrice = price - (price * discount / 100);
            return sum + finalPrice;
        }, 0).toFixed(2);
    };

    const handlePayment = async () => {
        if (!user) {
            setError('Please login to continue');
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            setError('Your cart is empty');
            navigate('/cart');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Please login to continue');
                navigate('/login');
                setLoading(false);
                return;
            }

            const items = cart.map(item => ({
                gameId: item.game.id,
                platformId: item.platform.id
            }));

            const response = await axios.post(`${API_BASE_URL}/checkout/create-session`,
                { items },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.url) {
                window.location.href = response.data.url;
            } else {
                setError('No checkout URL received from server');
                setLoading(false);
            }
        } catch (err) {
            if (err.response?.status === 401) {
                setError('Session expired. Please login again');
                navigate('/login');
            } else {
                setError(err.response?.data?.error || err.response?.data?.message || 'Failed to create checkout session');
            }
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container py-5">
                <div className="text-center">
                    <i className="fas fa-shopping-cart fa-4x mb-3"></i>
                    <h2>Your cart is empty</h2>
                    <p>Add some games to your cart to get started!</p>
                    <button className="btn btn-primary" onClick={() => navigate('/games')}>
                        Browse Games
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <h1 className="mb-4" style={{ color: '#e0e0e0' }}>
                <i className="fas fa-credit-card me-2"></i>
                Checkout
            </h1>

            {error && (
                <div className="alert alert-danger" role="alert">
                    <i className="fas fa-exclamation-triangle me-2"></i>
                    {error}
                </div>
            )}

            <div className="row">
                <div className="col-lg-8">
                    <div className="card mb-4" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '2px solid #2d2d44' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #16213e 0%, #1a1a2e 100%)', color: '#e0e0e0', borderBottom: '2px solid #2d2d44' }}>
                            <h5 className="mb-0">Order Summary</h5>
                        </div>
                        <div className="card-body" style={{ color: '#e0e0e0' }}>
                            {cart.map((item, index) => (
                                <div key={index} className="row mb-3 pb-3 border-bottom">
                                    <div className="col-md-2">
                                        <img
                                            src={item.game.imageUrl}
                                            alt={item.game.title}
                                            className="img-fluid rounded"
                                        />
                                    </div>
                                    <div className="col-md-6">
                                        <h6>{item.game.title}</h6>
                                        <p className="mb-0">
                                            <i className="fas fa-gamepad me-1"></i>
                                            {item.platform.name}
                                        </p>
                                    </div>
                                    <div className="col-md-4 text-end">
                                        {item.game.discountPercentage > 0 ? (
                                            <>
                                                <span className="badge bg-success me-2">
                                                    -{item.game.discountPercentage}%
                                                </span>
                                                <div>
                                                    <small className="text-decoration-line-through text-secondary">
                                                        €{item.game.price.toFixed(2)}
                                                    </small>
                                                </div>
                                                <h6 className="text-success">
                                                    €{(item.game.price - (item.game.price * item.game.discountPercentage / 100)).toFixed(2)}
                                                </h6>
                                            </>
                                        ) : (
                                            <h6>€{item.game.price.toFixed(2)}</h6>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '2px solid #2d2d44' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderBottom: '2px solid #2d2d44' }}>
                            <h5 className="mb-0">Payment Details</h5>
                        </div>
                        <div className="card-body" style={{ color: '#e0e0e0' }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal ({cart.length} items)</span>
                                <span>€{calculateTotal()}</span>
                            </div>
                            <hr style={{ borderColor: '#2d2d44' }} />
                            <div className="d-flex justify-content-between mb-4">
                                <strong>Total</strong>
                                <strong style={{ color: '#51cf66' }}>€{calculateTotal()}</strong>
                            </div>

                            <button
                                className="btn w-100 mb-3"
                                style={{
                                    background: 'linear-gradient(135deg, #51cf66 0%, #37b24d 100%)',
                                    color: 'white',
                                    border: 'none',
                                    padding: '12px',
                                    fontWeight: '600'
                                }}
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-lock me-2"></i>
                                        Proceed to Payment
                                    </>
                                )}
                            </button>

                            <button
                                className="btn btn-outline-secondary w-100 mb-3"
                                onClick={() => navigate('/cart')}
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Back to Cart
                            </button>

                            <div className="text-center">
                                <small style={{ color: '#b0b0b0' }}>
                                    <i className="fas fa-shield-alt me-1"></i>
                                    Secure payment powered by Stripe
                                </small>
                            </div>
                        </div>
                    </div>

                    <div className="alert mt-3" style={{ background: '#1a3a52', color: '#6ba3d0', border: '1px solid #2d5f7f' }} role="alert">
                        <i className="fas fa-info-circle me-2"></i>
                        <strong>Test Mode:</strong> Use card <code style={{ background: '#0f2638', color: '#8bc8ff', padding: '2px 6px', borderRadius: '4px' }}>4242 4242 4242 4242</code>
                    </div>
                </div>
            </div>
        </div>
    );
}
