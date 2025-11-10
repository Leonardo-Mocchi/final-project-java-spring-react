import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './NotFound.css';

const NotFound = () => {
    return (
        <>
            <Navbar />
            <div className="not-found-container">
                <div className="not-found-content">
                    <div className="error-code">404</div>
                    <h1 className="error-title">Page Not Found</h1>
                    <p className="error-description">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                    <div className="error-illustration">
                        <i className="bi bi-controller"></i>
                        <i className="bi bi-question-circle"></i>
                    </div>
                    <div className="error-actions">
                        <Link to="/" className="btn-home">
                            <i className="bi bi-house-door"></i>
                            Back to Home
                        </Link>
                        <button onClick={() => window.history.back()} className="btn-back">
                            <i className="bi bi-arrow-left"></i>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default NotFound;
