import { Link, useLocation } from 'react-router-dom';
import './AdminNav.css';

function AdminNav() {
    const location = useLocation();

    const isActive = (path) => location.pathname.startsWith(path);

    return (
        <nav className="admin-nav">
            <div className="admin-nav-container">
                <h2 className="admin-title">⚙️ Admin Panel</h2>
                <div className="admin-nav-links">
                    <Link
                        to="/admin/categories"
                        className={`admin-nav-link ${isActive('/admin/categories') ? 'active' : ''}`}
                    >
                        📁 Categories
                    </Link>
                    <Link
                        to="/admin/orders"
                        className={`admin-nav-link ${isActive('/admin/orders') ? 'active' : ''}`}
                    >
                        📦 Orders
                    </Link>
                    <Link
                        to="/admin/reviews"
                        className={`admin-nav-link ${isActive('/admin/reviews') ? 'active' : ''}`}
                    >
                        ⭐ Reviews
                    </Link>
                    <a
                        href="http://localhost:8080/admin/games"
                        className="admin-nav-link"
                    >
                        🎮 Games (Legacy)
                    </a>
                    <Link
                        to="/"
                        className="admin-nav-link back-to-site"
                    >
                        🏠 Back to Site
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default AdminNav;
