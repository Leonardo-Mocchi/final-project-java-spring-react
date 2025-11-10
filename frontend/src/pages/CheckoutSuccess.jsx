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
                <h1>Payment Successful!</h1>
                <p className="lead">Thank you for your purchase</p>
            </div>

            {order && (
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">Order #{order.id}</h5>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <h6>Your Game Keys:</h6>
                                    {order.gameKeys && order.gameKeys.map((key, index) => (
                                        <div key={index} className="alert alert-info">
                                            <strong>{key.game.title}</strong>
                                            <br />
                                            <code className="fs-5">{key.keyCode}</code>
                                            <br />
                                            <small className="text-muted">
                                                Platform: {key.platform.name}
                                            </small>
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between">
                                    <span>Total Paid:</span>
                                    <strong className="text-success">€{order.totalPrice}</strong>
                                </div>

                                <div className="mt-4 text-center">
                                    <p className="text-muted">
                                        <i className="fas fa-envelope me-2"></i>
                                        A confirmation email has been sent with your game keys
                                    </p>
                                    <button className="btn btn-primary" onClick={() => navigate('/games')}>
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
