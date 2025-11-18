import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export default function CheckoutSuccess() {
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            setError('Invalid session');
            setLoading(false);
            return;
        }

        const confirmPayment = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/checkout/success?session_id=${sessionId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                setOrder(response.data.order);
            } catch (err) {
                console.error('Payment confirmation error:', err);
                setError(err.response?.data?.error || 'Failed to confirm payment');
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="container py-5 text-center">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} />
                <p className="mt-3">Confirming your payment...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container py-5">
                <div className="alert alert-danger text-center">
                    <i className="fas fa-exclamation-triangle fa-3x mb-3"></i>
                    <h3>Payment Error</h3>
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => navigate('/games')}>
                        Back to Games
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="text-center mb-5">
                <i className="fas fa-check-circle fa-5x text-success mb-3"></i>
                <h1 style={{ color: '#e0e0e0' }}>Payment Successful!</h1>
                <p className="lead" style={{ color: '#b0b0b0' }}>Thank you for your purchase</p>
            </div>

            {order && (
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', border: '2px solid #2d2d44' }}>
                            <div className="card-header" style={{ background: 'linear-gradient(135deg, #51cf66 0%, #37b24d 100%)', color: 'white', borderBottom: '2px solid #2d2d44' }}>
                                <h5 className="mb-0">Order #{order.id}</h5>
                            </div>
                            <div className="card-body" style={{ color: '#e0e0e0' }}>
                                <div className="mb-4">
                                    <h6 style={{ color: '#51cf66' }}>Your Game Keys:</h6>
                                    {order.gameKeys && order.gameKeys.map((key, index) => (
                                        <div key={index} className="alert" style={{ background: '#1a3a52', color: '#6ba3d0', border: '1px solid #2d5f7f' }}>
                                            <strong>{key.game.title}</strong>
                                            <br />
                                            <code className="fs-5" style={{ background: '#0f2537', color: '#51cf66', padding: '4px 8px', borderRadius: '4px' }}>{key.keyCode}</code>
                                            <br />
                                            <small style={{ color: '#8bb4d0' }}>
                                                Platform: {key.platform.name}
                                            </small>
                                        </div>
                                    ))}
                                </div>

                                <hr style={{ borderColor: '#2d2d44' }} />

                                <div className="d-flex justify-content-between">
                                    <span>Total Paid:</span>
                                    <strong style={{ color: '#51cf66' }}>€{order.totalPrice}</strong>
                                </div>

                                <div className="mt-4 text-center">
                                    <p style={{ color: '#8bb4d0' }}>
                                        <i className="fas fa-envelope me-2"></i>
                                        A confirmation email will be sent with your game keys
                                    </p>
                                    <button className="btn" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', border: 'none' }} onClick={() => navigate('/games')}>
                                        Continue Shopping
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
