import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { GlobalContext } from '../contexts/GlobalContext';

export default function Cart() {
    const { cart, user, removeFromCart } = useContext(GlobalContext);
    const navigate = useNavigate();

    const calculateTotal = () => {
        return cart.reduce((sum, item) => {
            const price = item.game.price;
            const discount = item.game.discountPercentage || 0;
            const finalPrice = price - (price * discount / 100);
            return sum + finalPrice;
        }, 0).toFixed(2);
    };

    const handleProceedToCheckout = () => {
        if (!user) {
            // Save current location to redirect back after login
            sessionStorage.setItem('redirectAfterLogin', '/checkout');
            navigate('/login');
            return;
        }

        if (cart.length === 0) {
            return;
        }

        navigate('/checkout');
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
            <h1 className="mb-4" style={{ color: '#e0e0e0', fontSize: '2.5rem', fontWeight: 'bold' }}>
                <i className="fas fa-shopping-cart me-2"></i>
                Shopping Cart
            </h1>

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
                                    <div className="col-md-5">
                                        <h6>{item.game.title}</h6>
                                        <p className="mb-0">
                                            <i className="fas fa-gamepad me-1"></i>
                                            {item.platform.name}
                                        </p>
                                    </div>
                                    <div className="col-md-3 text-end">
                                        {item.game.discountPercentage > 0 ? (
                                            <>
                                                <span className="badge me-2" style={{ background: '#ff4757', color: 'white', margin: '0' }}>
                                                    -{item.game.discountPercentage}%
                                                </span>
                                                <div>
                                                    <small className="text-decoration-line-through text-secondary" style={{ marginRight: '0.5rem' }}>
                                                        €{item.game.price.toFixed(2)}
                                                    </small>
                                                </div>
                                                <h6 className="text-success" style={{ marginRight: '0.5rem' }}>
                                                    €{(item.game.price - (item.game.price * item.game.discountPercentage / 100)).toFixed(2)}
                                                </h6>
                                            </>
                                        ) : (
                                            <h6 style={{ marginRight: '0.5rem' }}>€{item.game.price.toFixed(2)}</h6>
                                        )}
                                    </div>
                                    <div className="col-md-2 text-end">
                                        <button
                                            className="btn btn-sm"
                                            style={{
                                                background: 'transparent',
                                                color: '#e0e0e0',
                                                border: '1px solid #2d2d44',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = '#ff4757';
                                                e.currentTarget.style.borderColor = '#ff4757';
                                                e.currentTarget.style.color = 'white';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'transparent';
                                                e.currentTarget.style.borderColor = '#2d2d44';
                                                e.currentTarget.style.color = '#e0e0e0';
                                            }}
                                            onClick={() => removeFromCart(index)}
                                            title="Remove from cart"
                                        >
                                            <i className="fas fa-trash-alt"></i>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '2px solid #2d2d44' }}>
                        <div className="card-header" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderBottom: '2px solid #2d2d44' }}>
                            <h5 className="mb-0">Cart Summary</h5>
                        </div>
                        <div className="card-body" style={{ color: '#e0e0e0' }}>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Subtotal ({cart.length} items)</span>
                                <span>€{calculateTotal()}</span>
                            </div>
                            <hr style={{ borderColor: '#2d2d44', opacity: '0.5' }} />
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
                                onClick={handleProceedToCheckout}
                            >
                                <i className="fas fa-arrow-right me-2"></i>
                                Proceed to Checkout
                            </button>

                            <button
                                className="btn btn-outline-secondary w-100"
                                onClick={() => navigate('/games')}
                            >
                                <i className="fas fa-shopping-bag me-2"></i>
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
