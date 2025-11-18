import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const navigate = useNavigate();

    useEffect(() => {
        // Redirect to Spring Security login page
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/';

        // Store the redirect path in a way that can be retrieved after login
        sessionStorage.setItem('pendingRedirect', redirectPath);

        // Redirect to backend login
        window.location.href = 'http://localhost:8080/login';
    }, [navigate]);

    return (
        <div className="container py-5 text-center">
            <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Redirecting to login...</span>
            </div>
            <p className="mt-3" style={{ color: '#e0e0e0' }}>Redirecting to login...</p>
        </div>
    );
}
