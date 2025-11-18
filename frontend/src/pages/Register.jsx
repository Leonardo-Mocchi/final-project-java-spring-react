import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [countdown, setCountdown] = useState(3);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Countdown timer for redirect
    useEffect(() => {
        if (showSuccess && countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (showSuccess && countdown === 0) {
            navigate('/login', {
                state: { message: 'Registration successful! Please log in.' }
            });
        }
    }, [showSuccess, countdown, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
                username: formData.username,
                email: formData.email,
                password: formData.password
            });

            if (response.status === 201) {
                // Show success modal
                setShowSuccess(true);
            }
        } catch (err) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <div className="register-card">
                <h2>Create Account</h2>
                <p className="register-subtitle">Join BoolArcade to start gaming</p>

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="register-form">
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Enter email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            minLength="6"
                            className="form-control"
                            placeholder="Enter password (min 6 characters)"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            className="form-control"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-register"
                        disabled={loading}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="register-footer">
                    <p>Already have an account? <Link to="/login">Log in</Link></p>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
                        padding: '40px',
                        borderRadius: '12px',
                        border: '2px solid #51cf66',
                        textAlign: 'center',
                        maxWidth: '400px',
                        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.5)'
                    }}>
                        <div style={{ fontSize: '64px', marginBottom: '20px' }}>✅</div>
                        <h2 style={{ color: '#51cf66', marginBottom: '15px' }}>Registration Successful!</h2>
                        <p style={{ color: '#e0e0e0', marginBottom: '10px' }}>
                            Welcome to BoolArcade, <strong>{formData.username}</strong>!
                        </p>
                        <p style={{ color: '#b0b0b0', fontSize: '14px', marginBottom: '20px' }}>
                            A welcome email has been sent to <strong>{formData.email}</strong>
                        </p>
                        <div style={{
                            background: '#0f1419',
                            padding: '15px',
                            borderRadius: '8px',
                            marginTop: '20px'
                        }}>
                            <p style={{ color: '#6ba3d0', margin: 0 }}>
                                Redirecting to login in <strong style={{ color: '#51cf66', fontSize: '24px' }}>{countdown}</strong> seconds...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Register;
