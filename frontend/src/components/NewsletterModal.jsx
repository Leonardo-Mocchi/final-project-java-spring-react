import { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsletterModal.css';

function NewsletterModal() {
    const [isVisible, setIsVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    useEffect(() => {
        // Check if user has already seen the modal in this session
        const hasSeenModal = sessionStorage.getItem('newsletterModalShown');

        if (!hasSeenModal) {
            // Show modal after 2 seconds
            const timer = setTimeout(() => {
                setIsVisible(true);
                sessionStorage.setItem('newsletterModalShown', 'true');
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setMessage('Please enter a valid email address');
            setMessageType('error');
            return;
        }

        setIsSubmitting(true);
        setMessage('');

        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/newsletter/subscribe`, { email });
            setMessage('🎉 Successfully subscribed! Check your email for exclusive deals.');
            setMessageType('success');

            // Close modal after 2 seconds
            setTimeout(() => {
                setIsVisible(false);
            }, 2000);
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Failed to subscribe. Please try again.';
            setMessage(errorMsg);
            setMessageType('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isVisible) return null;

    return (
        <div className="newsletter-modal-overlay" onClick={handleClose}>
            <div className="newsletter-modal" onClick={(e) => e.stopPropagation()}>
                <button className="newsletter-modal-close" onClick={handleClose}>
                    ×
                </button>

                <div className="newsletter-modal-content">
                    <div className="newsletter-modal-icon">📬</div>
                    <h2>Get Exclusive Deals!</h2>
                    <p>Subscribe to our newsletter and be the first to know about:</p>

                    <ul className="newsletter-benefits">
                        <li>🎮 New game releases</li>
                        <li>🔥 Hot deals and discounts</li>
                        <li>⭐ Exclusive member offers</li>
                        <li>🎁 Giveaways and contests</li>
                    </ul>

                    <form onSubmit={handleSubmit} className="newsletter-form">
                        <input
                            type="email"
                            placeholder="Enter your email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="newsletter-input"
                            required
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            className="newsletter-submit"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
                        </button>
                    </form>

                    {message && (
                        <div className={`newsletter-message ${messageType}`}>
                            {message}
                        </div>
                    )}

                    <p className="newsletter-disclaimer">
                        No spam, unsubscribe anytime. We respect your privacy.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default NewsletterModal;
